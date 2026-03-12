import { NextRequest, NextResponse } from "next/server";

// TODO: Replace mock with n8n webhook call for distribution

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

    // Mock response — simulates a successful approval action.
    const response = {
      success: true,
      id,
      platform,
      action,
      ...(action === "edit" && edited_content
        ? { edited_content }
        : {}),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
