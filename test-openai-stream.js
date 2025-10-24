// Quick test to see the structure of OpenAI streaming response
import OpenAI from "openai";
import { readFileSync } from "fs";

// Manually load .env.local
const envFile = readFileSync(".env.local", "utf-8");
const envVars = {};
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});
process.env.OPENAI_API_KEY = envVars.OPENAI_API_KEY;
process.env.OPENAI_PROMPT_ID = envVars.OPENAI_PROMPT_ID;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testStreaming() {
  console.log("Creating conversation...");
  const conversation = await openai.conversations.create();
  console.log("Conversation ID:", conversation.id);

  console.log("\nAdding user message...");
  await openai.conversations.items.create(conversation.id, {
    items: [
      {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: "Tell me a very short joke (one sentence)",
          },
        ],
      },
    ],
  });

  console.log("\nCreating streaming response...");
  const stream = await openai.responses.create({
    model: "gpt-5-nano",
    prompt: {
      id: process.env.OPENAI_PROMPT_ID,
    },
    conversation: conversation.id,
    stream: true,
  });

  console.log("\nStreaming chunks:");
  let chunkCount = 0;
  for await (const chunk of stream) {
    chunkCount++;
    console.log(`\nChunk ${chunkCount}:`);
    console.log(JSON.stringify(chunk, null, 2));

    // Stop after first 5 chunks to see structure
    if (chunkCount >= 5) {
      console.log("\n... (stopping after 5 chunks for inspection)");
      break;
    }
  }
}

testStreaming().catch(console.error);
