# Models

## Table of Contents

- [List models](#list-models)
- [Retrieve model](#retrieve-model)
- [Delete a fine-tuned model](#delete-a-fine-tuned-model)

---

## List models

**Method:** `GET`

**Endpoint:** `/models`

### Description

Lists the currently available models, and provides basic information about each one such as the owner and availability.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.models.list()
page = page.data[0]
print(page.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

// Automatically fetches more pages as needed.
for await (const model of client.models.list()) {
  console.log(model.id);
}
```

---

## Retrieve model

**Method:** `GET`

**Endpoint:** `/models/{model}`

### Description

Retrieves a model instance, providing basic information about the model such as the owner and permissioning.

### Parameters

- **model** (path, string) (required): The ID of the model to use for this request

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/models/VAR_chat_model_id \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
model = client.models.retrieve(
    "gpt-4o-mini",
)
print(model.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const model = await client.models.retrieve('gpt-4o-mini');

console.log(model.id);
```

---

## Delete a fine-tuned model

**Method:** `DELETE`

**Endpoint:** `/models/{model}`

### Description

Delete a fine-tuned model. You must have the Owner role in your organization to delete a model.

### Parameters

- **model** (path, string) (required): The model to delete

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/models/ft:gpt-4o-mini:acemeco:suffix:abc123 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
model_deleted = client.models.delete(
    "ft:gpt-4o-mini:acemeco:suffix:abc123",
)
print(model_deleted.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const modelDeleted = await client.models.delete('ft:gpt-4o-mini:acemeco:suffix:abc123');

console.log(modelDeleted.id);
```

---

