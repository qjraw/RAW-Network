import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL || "https://qrawthink.app.n8n.cloud/webhook/raw-input";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, content } = body as {
      type: "text" | "voice_memo";
      content: string;
    };

    if (!type || !content) {
      return NextResponse.json(
        { error: "Missing required fields: type, content" },
        { status: 400 }
      );
    }

    if (!["text", "voice_memo"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be 'text' or 'voice_memo'." },
        { status: 400 }
      );
    }

    // Call n8n content pipeline webhook
    const n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, content }),
    });

    if (!n8nRes.ok) {
      const errText = await n8nRes.text();
      console.error("n8n pipeline error:", n8nRes.status, errText);
      return NextResponse.json(
        { error: "Content pipeline failed. Please try again." },
        { status: 502 }
      );
    }

    const pipeline = await n8nRes.json();

    // Store submission in Supabase (fire-and-forget, don't block response)
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      fetch(`${SUPABASE_URL}/rest/v1/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          pipeline_id: pipeline.id,
          input_type: type,
          raw_content: content,
          linkedin_content: pipeline.linkedin?.content,
          linkedin_char_count: pipeline.linkedin?.char_count,
          substack_content: pipeline.substack?.content,
          substack_word_count: pipeline.substack?.word_count,
          linkedin_status: "pending",
          substack_status: "pending",
        }),
      }).catch((err) => console.error("Supabase insert error:", err));
    }

    return NextResponse.json(pipeline, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
