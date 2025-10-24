# Embeddings

## Table of Contents

- [Create embeddings](#create-embeddings)

---

## Create embeddings

**Method:** `POST`

**Endpoint:** `/embeddings`

### Description

Creates an embedding vector representing the input text.

### Request Body

Reference: `CreateEmbeddingRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/embeddings \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "The food was delicious and the waiter...",
    "model": "text-embedding-ada-002",
    "encoding_format": "float"
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
create_embedding_response = client.embeddings.create(
    input="The quick brown fox jumped over the lazy dog",
    model="text-embedding-3-small",
)
print(create_embedding_response.data)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const createEmbeddingResponse = await client.embeddings.create({
  input: 'The quick brown fox jumped over the lazy dog',
  model: 'text-embedding-3-small',
});

console.log(createEmbeddingResponse.data);
```

---

