import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import {
  createMessage,
  getConversationById,
} from "@/lib/db";

// POST /api/messages - Create a new message
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { conversationId, role, content } = body;

    // Validation
    if (!conversationId || !role || !content) {
      return NextResponse.json(
        { error: "conversationId, role, and content are required" },
        { status: 400 }
      );
    }

    if (role !== "user" && role !== "assistant") {
      return NextResponse.json(
        { error: "role must be 'user' or 'assistant'" },
        { status: 400 }
      );
    }

    // Verify the conversation belongs to the user
    const conversation = await getConversationById(
      conversationId,
      session.user.id
    );

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const message = await createMessage(conversationId, role, content);

    return NextResponse.json(
      {
        message: {
          id: message.id,
          conversationId: message.conversation_id,
          role: message.role,
          content: message.content,
          createdAt: message.created_at,
          editedAt: message.edited_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
