import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const N8N_APPROVE_URL =
  process.env.N8N_APPROVE_URL || "https://qrawthink.app.n8n.cloud/webhook/approve-content";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, platform, action, edited_content } = body as {
      id: string;
      platform: string;
      action: "approve" | "edit" | "reject";
      edited_content?: string;
    };

    if (!id || !platform || !action) {
      return NextResponse.json(
        { error: "Missing required fields: id, platform, action" },
        { status: 400 }
      );
    }

    if (!["approve", "edit", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve', 'edit', or 'reject'." },
        { status: 400 }
      );
    }

    if (!["linkedin", "substack", "tiktok", "instagram"].includes(platform)) {
      return NextResponse.json(
        { error: "Invalid platform. Must be 'linkedin', 'substack', 'tiktok', or 'instagram'." },
        { status: 400 }
      );
    }

    // Call n8n approval webhook
    const n8nRes = await fetch(N8N_APPROVE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, platform, action, edited_content }),
    });

    if (!n8nRes.ok) {
      const errText = await n8nRes.text();
      console.error("n8n approval error:", n8nRes.status, errText);
      return NextResponse.json(
        { error: "Approval action failed. Please try again." },
        { status: 502 }
      );
    }

    const result = await n8nRes.json();

    // Update status in Supabase (fire-and-forget)
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      const statusColumn = `${platform}_status`;
      const statusValue = action === "approve" ? "approved" : action === "reject" ? "rejected" : "pending";

      fetch(
        `${SUPABASE_URL}/rest/v1/submissions?pipeline_id=eq.${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ [statusColumn]: statusValue }),
        }
      ).catch((err) => console.error("Supabase update error:", err));
    }

    return NextResponse.json(
      {
        success: true,
        id,
        platform,
        action,
        ...(action === "edit" && edited_content ? { edited_content } : {}),
        timestamp: result.timestamp || new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
