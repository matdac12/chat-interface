# Moderations

## Table of Contents

- [Create moderation](#create-moderation)

---

## Create moderation

**Method:** `POST`

**Endpoint:** `/moderations`

### Description

Classifies if text and/or image inputs are potentially harmful. Learn
more in the [moderation guide](https://platform.openai.com/docs/guides/moderation).


### Request Body

Reference: `CreateModerationRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/moderations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "input": "I want to kill them."
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
moderation = client.moderations.create(
    input="I want to kill them.",
)
print(moderation.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const moderation = await client.moderations.create({ input: 'I want to kill them.' });

console.log(moderation.id);
```

---

