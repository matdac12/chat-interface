import { NextRequest } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import {
  getConversationById,
  createMessage,
  updateConversation,
} from "@/lib/db";
import {
  StreamingManager,
  StreamingResponseBuilder,
} from "@/lib/streaming";
import { getModelConfig, ModelTier } from "@/lib/model-config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { message, conversationId, openaiConversationId, file, tier = "base" } =
      await req.json();

    // Get model configuration for the selected tier
    const modelConfig = getModelConfig(tier as ModelTier);
    console.log(`📊 Selected tier: ${tier} -> Model: ${modelConfig.model}, Reasoning: ${modelConfig.reasoning}`);

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required and must be a string" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!conversationId) {
      return new Response(
        JSON.stringify({ error: "Conversation ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify conversation belongs to user
    const conversation = await getConversationById(
      conversationId,
      session.user.id
    );

    if (!conversation) {
      return new Response(
        JSON.stringify({ error: "Conversation not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("🚀 Starting streaming request");
    console.log("Conversation ID:", conversationId);
    console.log("Message:", message.substring(0, 50) + "...");

    // Save user message to database BEFORE streaming starts
    const userMessage = await createMessage(conversationId, "user", message, file);
    console.log("✅ User message saved to database, ID:", userMessage.id);

    // Get or create OpenAI conversation
    let convId = openaiConversationId || conversation.openai_conversation_id;

    if (!convId) {
      console.log("Creating new OpenAI conversation...");
      const openaiConv = await openai.conversations.create();
      convId = openaiConv.id;
      console.log("Created conversation:", convId);

      // Update our database with the OpenAI conversation ID
      await updateConversation(conversationId, session.user.id, {
        openai_conversation_id: convId,
      });
    } else {
      console.log("Using existing OpenAI conversation:", convId);
    }

    // Validate prompt ID
    if (!process.env.OPENAI_PROMPT_ID) {
      return new Response(
        JSON.stringify({ error: "OPENAI_PROMPT_ID not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build user name variable for prompt
    const userName = `${session.user.name}${session.user.lastName ? ` ${session.user.lastName}` : ''} (${session.user.email})`;
    console.log("User name for streaming prompt:", userName);

    // Get user info (role description) for prompt
    const userInfo = session.user.roleDescription || "Utente Zafferano.";
    console.log("User info for streaming prompt:", userInfo);

    // Create streaming manager with user context and model config
    const streamingManager = new StreamingManager(
      openai,
      process.env.OPENAI_PROMPT_ID,
      userName,
      userInfo,
      modelConfig.model,
      modelConfig.reasoning
    );

    // Build and return streaming response
    console.log("🔄 Building streaming response...");
    const streamingResponse = await StreamingResponseBuilder.buildChatStream(
      streamingManager,
      conversationId,
      conversationId, // local conversation ID (same as conversationId in our case)
      message,
      session.user.id,
      convId, // OpenAI conversation ID
      file,
      30 // timeout in seconds
    );

    return streamingResponse;

  } catch (error) {
    console.error("❌ Streaming API route error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process streaming request",
        details: (error as Error).message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
