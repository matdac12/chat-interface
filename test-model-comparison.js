/**
 * Comprehensive Model Comparison Test Suite
 *
 * Tests different OpenAI model configurations:
 * - Models: gpt-5-nano, gpt-5-mini, gpt-5
 * - Reasoning effort: low, medium, high
 * - (Verbosity is typically controlled via prompt, not API parameter)
 *
 * Usage:
 *   node test-model-comparison.js
 */

const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

// Load environment variables from .env.local or .env
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const envFile of envFiles) {
    const envPath = path.join(__dirname, envFile);
    if (fs.existsSync(envPath)) {
      console.log(`Loading environment from: ${envFile}`);
      const envContent = fs.readFileSync(envPath, "utf-8");
      envContent.split("\n").forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith("#")) return;
        const [key, ...valueParts] = trimmedLine.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
          process.env[key.trim()] = value;
        }
      });
      break;
    }
  }
}

loadEnv();

if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY not found in .env.local");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load prompt ID
const PROMPT_ID = process.env.OPENAI_PROMPT_ID;
if (!PROMPT_ID) {
  console.error("ERROR: OPENAI_PROMPT_ID not found in .env.local");
  process.exit(1);
}

console.log("Using Prompt ID:", PROMPT_ID);

// Test configuration
const CONFIG = {
  models: ["gpt-5-nano", "gpt-5-mini", "gpt-5"],
  reasoningEfforts: ["low", "medium", "high"],

  // Test query - complex enough to show differences in reasoning
  testQuery: `Analizza i pro e i contro dell'utilizzo di microservizi rispetto a un'architettura monolitica per una startup che sta sviluppando un'app di e-commerce. Considera scalabilità, costi, complessità di sviluppo e time-to-market.`,

  // User name variable for the prompt
  userName: "Test User (test@example.com)",
};

// Results storage
const results = [];

/**
 * Run a single test with specific configuration
 */
async function runTest(model, reasoningEffort) {
  const testId = `${model}_reasoning-${reasoningEffort}`;
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Testing: ${testId}`);
  console.log(`${"=".repeat(60)}`);

  const startTime = Date.now();

  try {
    // Use stored prompt with reasoning effort override
    const response = await openai.responses.create({
      model: model,
      prompt: {
        id: PROMPT_ID,
        variables: {
          user_name: CONFIG.userName,
        },
      },
      input: CONFIG.testQuery,
      reasoning: {
        effort: reasoningEffort,
      },
    });

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; // seconds

    const outputText = response.output_text || "";
    const wordCount = outputText.split(/\s+/).filter(w => w.length > 0).length;
    const charCount = outputText.length;

    // Extract usage info if available
    const usage = response.usage || {};

    const result = {
      testId,
      model,
      reasoningEffort,
      success: true,
      duration: duration.toFixed(2),
      responseLength: charCount,
      wordCount,
      inputTokens: usage.input_tokens || "N/A",
      outputTokens: usage.output_tokens || "N/A",
      totalTokens: usage.total_tokens || "N/A",
      reasoningTokens: usage.reasoning_tokens || usage.completion_tokens_details?.reasoning_tokens || "N/A",
      responsePreview: outputText.substring(0, 200) + (outputText.length > 200 ? "..." : ""),
      fullResponse: outputText,
    };

    results.push(result);

    console.log(`\n  Duration: ${result.duration}s`);
    console.log(`  Response length: ${charCount} chars, ${wordCount} words`);
    console.log(`  Tokens - Input: ${result.inputTokens}, Output: ${result.outputTokens}, Reasoning: ${result.reasoningTokens}`);
    console.log(`  Preview: ${result.responsePreview.substring(0, 100)}...`);

    return result;

  } catch (error) {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    const result = {
      testId,
      model,
      reasoningEffort,
      success: false,
      duration: duration.toFixed(2),
      error: error.message,
      errorCode: error.code || error.status || "unknown",
    };

    results.push(result);

    console.log(`\n  ERROR: ${error.message}`);

    return result;
  }
}

/**
 * Run all test combinations
 */
async function runAllTests() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════════╗");
  console.log("║     OPENAI MODEL COMPARISON TEST SUITE                         ║");
  console.log("╚════════════════════════════════════════════════════════════════╝");
  console.log(`\nTest Query: "${CONFIG.testQuery.substring(0, 80)}..."`);
  console.log(`\nModels: ${CONFIG.models.join(", ")}`);
  console.log(`Reasoning Efforts: ${CONFIG.reasoningEfforts.join(", ")}`);
  console.log(`Total combinations: ${CONFIG.models.length * CONFIG.reasoningEfforts.length}`);

  const overallStart = Date.now();

  // Run tests sequentially to avoid rate limits
  for (const model of CONFIG.models) {
    for (const effort of CONFIG.reasoningEfforts) {
      await runTest(model, effort);

      // Small delay between tests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const overallEnd = Date.now();
  const totalDuration = ((overallEnd - overallStart) / 1000 / 60).toFixed(2);

  // Generate summary report
  generateReport(totalDuration);
}

/**
 * Generate comprehensive report
 */
function generateReport(totalDuration) {
  console.log("\n\n");
  console.log("╔════════════════════════════════════════════════════════════════╗");
  console.log("║                    TEST RESULTS SUMMARY                        ║");
  console.log("╚════════════════════════════════════════════════════════════════╝");

  const successfulTests = results.filter(r => r.success);
  const failedTests = results.filter(r => !r.success);

  console.log(`\nTotal tests: ${results.length}`);
  console.log(`Successful: ${successfulTests.length}`);
  console.log(`Failed: ${failedTests.length}`);
  console.log(`Total time: ${totalDuration} minutes`);

  if (failedTests.length > 0) {
    console.log("\n--- FAILED TESTS ---");
    failedTests.forEach(t => {
      console.log(`  ${t.testId}: ${t.error}`);
    });
  }

  // Results table
  console.log("\n\n┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐");
  console.log("│                                    DETAILED RESULTS TABLE                                          │");
  console.log("├──────────────┬───────────────┬──────────┬───────────┬────────────┬─────────────┬──────────────────┤");
  console.log("│ Model        │ Reasoning     │ Duration │ Words     │ Chars      │ Out Tokens  │ Reasoning Tokens │");
  console.log("├──────────────┼───────────────┼──────────┼───────────┼────────────┼─────────────┼──────────────────┤");

  successfulTests.forEach(r => {
    const model = r.model.padEnd(12);
    const effort = r.reasoningEffort.padEnd(13);
    const duration = `${r.duration}s`.padEnd(8);
    const words = String(r.wordCount).padEnd(9);
    const chars = String(r.responseLength).padEnd(10);
    const outTokens = String(r.outputTokens).padEnd(11);
    const reasoningTokens = String(r.reasoningTokens).padEnd(16);

    console.log(`│ ${model} │ ${effort} │ ${duration} │ ${words} │ ${chars} │ ${outTokens} │ ${reasoningTokens} │`);
  });

  console.log("└──────────────┴───────────────┴──────────┴───────────┴────────────┴─────────────┴──────────────────┘");

  // Analysis by model
  console.log("\n\n--- ANALYSIS BY MODEL ---");
  for (const model of CONFIG.models) {
    const modelResults = successfulTests.filter(r => r.model === model);
    if (modelResults.length === 0) continue;

    const avgDuration = (modelResults.reduce((sum, r) => sum + parseFloat(r.duration), 0) / modelResults.length).toFixed(2);
    const avgWords = Math.round(modelResults.reduce((sum, r) => sum + r.wordCount, 0) / modelResults.length);
    const avgChars = Math.round(modelResults.reduce((sum, r) => sum + r.responseLength, 0) / modelResults.length);

    console.log(`\n${model}:`);
    console.log(`  Avg Duration: ${avgDuration}s`);
    console.log(`  Avg Words: ${avgWords}`);
    console.log(`  Avg Chars: ${avgChars}`);
  }

  // Analysis by reasoning effort
  console.log("\n\n--- ANALYSIS BY REASONING EFFORT ---");
  for (const effort of CONFIG.reasoningEfforts) {
    const effortResults = successfulTests.filter(r => r.reasoningEffort === effort);
    if (effortResults.length === 0) continue;

    const avgDuration = (effortResults.reduce((sum, r) => sum + parseFloat(r.duration), 0) / effortResults.length).toFixed(2);
    const avgWords = Math.round(effortResults.reduce((sum, r) => sum + r.wordCount, 0) / effortResults.length);

    // Calculate avg reasoning tokens (only if available)
    const reasoningTokenResults = effortResults.filter(r => r.reasoningTokens !== "N/A");
    const avgReasoningTokens = reasoningTokenResults.length > 0
      ? Math.round(reasoningTokenResults.reduce((sum, r) => sum + parseInt(r.reasoningTokens), 0) / reasoningTokenResults.length)
      : "N/A";

    console.log(`\n${effort}:`);
    console.log(`  Avg Duration: ${avgDuration}s`);
    console.log(`  Avg Words: ${avgWords}`);
    console.log(`  Avg Reasoning Tokens: ${avgReasoningTokens}`);
  }

  // Best performers
  console.log("\n\n--- HIGHLIGHTS ---");

  if (successfulTests.length > 0) {
    const fastest = successfulTests.reduce((a, b) => parseFloat(a.duration) < parseFloat(b.duration) ? a : b);
    const slowest = successfulTests.reduce((a, b) => parseFloat(a.duration) > parseFloat(b.duration) ? a : b);
    const mostVerbose = successfulTests.reduce((a, b) => a.wordCount > b.wordCount ? a : b);
    const leastVerbose = successfulTests.reduce((a, b) => a.wordCount < b.wordCount ? a : b);

    console.log(`\nFastest response: ${fastest.testId} (${fastest.duration}s)`);
    console.log(`Slowest response: ${slowest.testId} (${slowest.duration}s)`);
    console.log(`Most verbose: ${mostVerbose.testId} (${mostVerbose.wordCount} words)`);
    console.log(`Least verbose: ${leastVerbose.testId} (${leastVerbose.wordCount} words)`);
  }

  // Save full results to JSON
  const fs = require("fs");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `test-results-${timestamp}.json`;

  fs.writeFileSync(filename, JSON.stringify({
    config: CONFIG,
    results: results,
    summary: {
      totalTests: results.length,
      successful: successfulTests.length,
      failed: failedTests.length,
      totalDurationMinutes: parseFloat(totalDuration),
    }
  }, null, 2));

  console.log(`\n\nFull results saved to: ${filename}`);

  // Print recommendations
  console.log("\n\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║                      RECOMMENDATIONS                           ║");
  console.log("╚════════════════════════════════════════════════════════════════╝");
  console.log(`
Based on the test results, consider:

1. SPEED vs QUALITY tradeoff:
   - For quick responses: Use lower reasoning effort
   - For complex analysis: Use higher reasoning effort

2. COST considerations:
   - gpt-5-nano: Most cost-effective for simple tasks
   - gpt-5-mini: Good balance of capability and cost
   - gpt-5: Best for complex reasoning tasks

3. VERBOSITY:
   - Controlled via system prompt, not API parameter
   - Add instructions like "Be concise" or "Provide detailed explanations"

4. For your chat app:
   - Consider using gpt-5-nano with medium reasoning for general chat
   - Switch to gpt-5-mini/gpt-5 for complex analytical questions
`);
}

// Run the test suite
runAllTests().catch(console.error);
