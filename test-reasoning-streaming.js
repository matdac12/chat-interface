/**
 * Test script to inspect streaming events from OpenAI Responses API
 * Specifically looking for reasoning-related events
 *
 * Usage: Make sure OPENAI_API_KEY and OPENAI_PROMPT_ID are set in your environment
 * You can run: export $(cat .env.local | xargs) && node test-reasoning-streaming.js
 */

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testReasoningStreaming() {
  console.log("🧪 Testing OpenAI Responses API Streaming for Reasoning Events\n");
  console.log("=" .repeat(80));

  try {
    // Get prompt ID from env
    const promptId = process.env.OPENAI_PROMPT_ID;
    if (!promptId) {
      console.error("❌ OPENAI_PROMPT_ID not found in .env.local");
      process.exit(1);
    }

    console.log(`\n📋 Using Prompt ID: ${promptId}`);
    console.log(`📝 Sending test message: "Explain why the sky is blue in detail."\n`);

    // Create a streaming response with reasoning effort only (no summary)
    console.log("⚙️  Testing with reasoning.effort = 'high' (without summary parameter)\n");

    const stream = await openai.responses.create({
      model: "gpt-5-nano", // Using the same model as your app
      prompt: {
        id: promptId,
      },
      input: "Explain why the sky is blue in detail.",
      stream: true,
      // Request high reasoning effort (without summary - which requires verification)
      reasoning: {
        effort: "high", // Request more reasoning (low, medium, high)
      },
      store: true,
    });

    console.log("🔄 Stream started, listening for events...\n");
    console.log("=" .repeat(80));

    let eventCount = 0;
    let reasoningEvents = [];
    let textEvents = [];
    let allEventTypes = new Set();

    // Process streaming events
    for await (const event of stream) {
      eventCount++;

      // Track all event types
      if (event.type) {
        allEventTypes.add(event.type);
      }

      // Log event details
      console.log(`\n📦 Event #${eventCount}`);
      console.log(`   Type: ${event.type || 'unknown'}`);

      // Check for different types of events
      if (event.type === 'response.reasoning_text.delta') {
        console.log(`   🧠 REASONING TEXT DELTA FOUND!`);
        console.log(`   Delta: ${event.delta || event.reasoning_text?.delta || '[no delta field]'}`);
        reasoningEvents.push(event);
      } else if (event.type === 'response.reasoning_summary_text.delta') {
        console.log(`   🧠 REASONING SUMMARY TEXT DELTA FOUND!`);
        console.log(`   Delta: ${event.delta || '[no delta field]'}`);
        reasoningEvents.push(event);
      } else if (event.type === 'response.reasoning_summary.delta') {
        console.log(`   🧠 REASONING SUMMARY DELTA FOUND!`);
        console.log(`   Delta: ${event.delta || '[no delta field]'}`);
        reasoningEvents.push(event);
      } else if (event.type === 'response.output_text.delta') {
        console.log(`   💬 Output text delta`);
        console.log(`   Delta: ${event.delta || event.output_text?.delta || '[no delta field]'}`);
        textEvents.push(event);
      } else if (event.delta !== undefined) {
        console.log(`   ⚡ Delta field: ${event.delta}`);
      } else if (event.output_text !== undefined) {
        console.log(`   📄 output_text: ${typeof event.output_text === 'string' ? event.output_text.substring(0, 50) + '...' : JSON.stringify(event.output_text)}`);
      } else if (event.reasoning_text !== undefined) {
        console.log(`   🧠 reasoning_text field present!`);
        console.log(`   Value: ${typeof event.reasoning_text === 'string' ? event.reasoning_text : JSON.stringify(event.reasoning_text)}`);
      }

      // Log full event structure for first few events
      if (eventCount <= 5) {
        console.log(`   Full event keys: ${Object.keys(event).join(', ')}`);
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log("✅ Stream completed!\n");

    // Summary
    console.log("📊 SUMMARY:");
    console.log(`   Total events: ${eventCount}`);
    console.log(`   Reasoning-related events: ${reasoningEvents.length}`);
    console.log(`   Text output events: ${textEvents.length}`);
    console.log(`\n   Unique event types found:`);
    allEventTypes.forEach(type => {
      console.log(`     - ${type}`);
    });

    if (reasoningEvents.length > 0) {
      console.log(`\n   ✅ SUCCESS: Found ${reasoningEvents.length} reasoning events!`);
      console.log(`\n   Sample reasoning event structure:`);
      console.log(JSON.stringify(reasoningEvents[0], null, 2));
    } else {
      console.log(`\n   ⚠️  No reasoning events found.`);
      console.log(`   This might mean:`);
      console.log(`     - The model doesn't emit reasoning for this type of query`);
      console.log(`     - Reasoning is only available for specific models/modes`);
      console.log(`     - The reasoning appears in a different event type`);
    }

  } catch (error) {
    console.error("\n❌ Error during streaming test:");
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testReasoningStreaming();
