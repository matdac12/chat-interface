# Completions

## Table of Contents

- [Create completion](#create-completion)

---

## Create completion

**Method:** `POST`

**Endpoint:** `/completions`

### Description

Creates a completion for the provided prompt and parameters.

### Request Body

Reference: `CreateCompletionRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "VAR_completion_model_id",
    "prompt": "Say this is a test",
    "max_tokens": 7,
    "temperature": 0
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
completion = client.completions.create(
    model="string",
    prompt="This is a test.",
)
print(completion)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const completion = await client.completions.create({ model: 'string', prompt: 'This is a test.' });

console.log(completion);
```

---

