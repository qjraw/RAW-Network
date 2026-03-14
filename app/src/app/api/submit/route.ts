import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// TODO: Replace mock with n8n webhook call to https://qrawthink.app.n8n.cloud/webhook/raw-input

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

    // Mock response — simulates the n8n pipeline output.
    const id = `raw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const timestamp = new Date().toISOString();

    const mockLinkedInContent = `[LinkedIn version]\n\n${content}\n\n#RAWNetwork #ContentPipeline`;
    const mockSubstackContent = `# From the RAW Network\n\n${content}\n\nThis piece was generated from a ${type === "voice_memo" ? "voice memo" : "text input"} through the RAW Network content pipeline.`;

    const response = {
      id,
      linkedin: {
        content: mockLinkedInContent,
        char_count: mockLinkedInContent.length,
      },
      substack: {
        content: mockSubstackContent,
        word_count: mockSubstackContent.split(/\s+/).length,
      },
      metadata: {
        input_type: type,
        timestamp,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
