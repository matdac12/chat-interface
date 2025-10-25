import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import {
  getConversationById,
  createMessage,
  updateConversation,
} from "@/lib/db";

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

    const { message, conversationId, openaiConversationId, file } =
      await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
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

    // Save user message to database
    const userMessage = await createMessage(conversationId, "user", message);

    // Step 1: Get or create OpenAI conversation
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
      console.log("Using existing conversation:", convId);
    }

    // Step 2: Prepare input based on whether file is present
    let responseInput: any;

    if (!file) {
      // No file - use simple string input (current behavior)
      console.log("No file attached, using simple text input");
      responseInput = message;
    } else {
      // File attached - determine type and format accordingly
      const isImage = file.type.startsWith("image/");
      const isPDF = file.type === "application/pdf";

      console.log(
        `File attached: ${file.name} (${file.type}, ${file.size} bytes)`,
      );

      if (isImage) {
        // Image - use input_image with base64 data URL
        console.log("Processing as image input");
        responseInput = [
          {
            role: "user",
            content: [
              {
                type: "input_image",
                image_url: `data:${file.type};base64,${file.data}`,
              },
              {
                type: "input_text",
                text: message,
              },
            ],
          },
        ];
      } else if (isPDF) {
        // PDF - upload to Files API first, then use input_file
        console.log("Processing as PDF, uploading to Files API...");
        try {
          const pdfBuffer = Buffer.from(file.data, "base64");
          const blob = new Blob([pdfBuffer], { type: "application/pdf" });

          const uploadedFile = await openai.files.create({
            file: new File([blob], file.name, { type: "application/pdf" }),
            purpose: "assistants",
          });

          console.log("PDF uploaded successfully, file ID:", uploadedFile.id);

          responseInput = [
            {
              role: "user",
              content: [
                {
                  type: "input_file",
                  file_id: uploadedFile.id,
                },
                {
                  type: "input_text",
                  text: message,
                },
              ],
            },
          ];
        } catch (uploadError) {
          console.error("PDF upload failed:", uploadError);
          return NextResponse.json(
            {
              error: "Failed to upload PDF file",
              details: (uploadError as Error).message,
            },
            { status: 500 },
          );
        }
      } else {
        // Unsupported file type
        return NextResponse.json(
          { error: "Unsupported file type. Only images and PDFs are allowed." },
          { status: 400 },
        );
      }
    }

    // Step 3: Create response with stored prompt
    console.log(
      "Creating response with prompt_id:",
      process.env.OPENAI_PROMPT_ID,
    );
    const response = await openai.responses.create({
      model: "gpt-5-nano",
      prompt: {
        id: process.env.OPENAI_PROMPT_ID!,
      },
      input: responseInput,
      conversation: convId,
    });

    console.log("Response completed successfully");
    console.log("Response ID:", response.id);

    // Extract the text content from the response
    const assistantText = response.output_text || "No response generated";

    console.log("Assistant response:", assistantText.substring(0, 100) + "...");
    console.log("Response length:", assistantText.length, "characters");

    // Save assistant message to database
    const assistantMessage = await createMessage(
      conversationId,
      "assistant",
      assistantText
    );

    // Return the complete response
    return NextResponse.json({
      success: true,
      conversationId: convId,
      message: assistantText,
      responseId: response.id,
      userMessageId: userMessage.id,
      assistantMessageId: assistantMessage.id,
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: (error as Error).message },
      { status: 500 },
    );
  }
}
