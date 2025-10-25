import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { updateConversation, getConversationById } from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, conversationId } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 },
      );
    }

    // Verify conversation belongs to user
    const conversation = await getConversationById(
      conversationId,
      session.user.id
    );

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    console.log("Generating title for message:", message.substring(0, 50) + "...");

    // Use gpt-5-nano for title generation
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content: "Generate a concise chat title from the user's first message. The title must be between 2 and 5 words. Only respond with the title, nothing else.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const title = completion.choices[0]?.message?.content?.trim() || "Nuova Chat";

    console.log("Generated title:", title);

    // Update conversation title in database
    await updateConversation(conversationId, session.user.id, { title });

    return NextResponse.json({
      success: true,
      title: title,
    });
  } catch (error) {
    console.error("Title generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate title", details: (error as Error).message },
      { status: 500 },
    );
  }
}
