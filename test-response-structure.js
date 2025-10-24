// Test to see the actual response structure
import OpenAI from 'openai';
import { readFileSync } from 'fs';

// Load env
const envFile = readFileSync('.env.local', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
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

async function test() {
  console.log('Creating conversation...');
  const conversation = await openai.conversations.create();

  console.log('Adding message...');
  await openai.conversations.items.create(conversation.id, {
    items: [{
      type: 'message',
      role: 'user',
      content: [{ type: 'input_text', text: 'Say hello in one word' }],
    }],
  });

  console.log('Creating response...');
  const response = await openai.responses.create({
    model: 'gpt-5-nano',
    prompt: { id: process.env.OPENAI_PROMPT_ID },
    conversation: conversation.id,
    stream: false,
  });

  console.log('\n=== FULL RESPONSE ===');
  console.log(JSON.stringify(response, null, 2));

  console.log('\n=== OUTPUT ARRAY ===');
  console.log(JSON.stringify(response.output, null, 2));
}

test().catch(console.error);
