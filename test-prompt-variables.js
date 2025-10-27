import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const promptId = process.env.OPENAI_PROMPT_ID;

async function testVariablePassing() {
  console.log('Testing OpenAI Responses API with prompt variables...\n');
  console.log('Prompt ID:', promptId);

  try {
    // Test with a user from the database (Diana Scantamburlo)
    const response = await client.responses.create({
      prompt: {
        id: promptId,
        variables: {
          user_name: "Diana Scantamburlo"
        }
      },
      input: [{ role: "user", content: "Ciao!" }],
      model: "gpt-5-nano"
    });

    console.log('\n✅ Response received successfully!\n');
    console.log('Response ID:', response.id);
    console.log('\nOutput text:');
    console.log('---');
    console.log(response.output_text);
    console.log('---\n');

    // Check if the variable was used
    if (response.output_text.includes('Diana')) {
      console.log('✅ Variable substitution WORKED - "Diana" found in response!');
    } else {
      console.log('⚠️  Variable substitution might not have worked - "Diana" not found in response');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testVariablePassing();
