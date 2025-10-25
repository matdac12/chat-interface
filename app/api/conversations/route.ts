import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import {
  getConversationsByUserId,
  createConversation,
  getMessagesByConversationId,
} from "@/lib/db";

// GET /api/conversations - List all conversations for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await getConversationsByUserId(session.user.id);

    // For each conversation, get message count and preview
    const conversationsWithMeta = await Promise.all(
      conversations.map(async (conv: any) => {
        const messages = await getMessagesByConversationId(conv.id);
        const lastMessage = messages[messages.length - 1];

        return {
          id: conv.id,
          title: conv.title,
          pinned: conv.pinned,
          openaiConversationId: conv.openai_conversation_id,
          createdAt: conv.created_at,
          updatedAt: conv.updated_at,
          messageCount: messages.length,
          preview: lastMessage?.content?.slice(0, 80) || "Inizia a scrivere...",
          messages: messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            createdAt: msg.created_at,
            editedAt: msg.edited_at,
          })),
        };
      })
    );

    return NextResponse.json({ conversations: conversationsWithMeta });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title } = body;

    const conversation = await createConversation(
      session.user.id,
      title || "Nuova Chat"
    );

    return NextResponse.json(
      {
        conversation: {
          id: conversation.id,
          title: conversation.title,
          pinned: conversation.pinned,
          openaiConversationId: conversation.openai_conversation_id,
          createdAt: conversation.created_at,
          updatedAt: conversation.updated_at,
          messageCount: 0,
          preview: "Inizia a scrivere...",
          messages: [],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
