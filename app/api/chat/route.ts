import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, openaiConversationId } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 },
      );
    }

    // Step 1: Get or create OpenAI conversation
    let convId = openaiConversationId;

    if (!convId) {
      console.log("Creating new OpenAI conversation...");
      const conversation = await openai.conversations.create();
      convId = conversation.id;
      console.log("Created conversation:", convId);
    } else {
      console.log("Using existing conversation:", convId);
    }

    // Step 2: Create response with stored prompt (using input parameter)
    console.log(
      "Creating response with prompt_id:",
      process.env.OPENAI_PROMPT_ID,
    );
    const response = await openai.responses.create({
      model: "gpt-5-nano",
      prompt: {
        id: process.env.OPENAI_PROMPT_ID!,
      },
      input: message, // Use input parameter directly
      conversation: convId, // This links to conversation for history
    });

    console.log("Response completed successfully");
    console.log("Response ID:", response.id);

    // Extract the text content from the response
    // Based on official docs, response has output_text property
    const assistantText = response.output_text || "No response generated";

    console.log("Assistant response:", assistantText.substring(0, 100) + "...");
    console.log("Response length:", assistantText.length, "characters");

    // Return the complete response
    return NextResponse.json({
      success: true,
      conversationId: convId,
      message: assistantText,
      responseId: response.id,
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: (error as Error).message },
      { status: 500 },
    );
  }
}
