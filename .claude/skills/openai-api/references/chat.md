# Chat

## Table of Contents

- [List Chat Completions](#list-chat-completions)
- [Create chat completion](#create-chat-completion)
- [Get chat completion](#get-chat-completion)
- [Update chat completion](#update-chat-completion)
- [Delete chat completion](#delete-chat-completion)
- [Get chat messages](#get-chat-messages)

---

## List Chat Completions

**Method:** `GET`

**Endpoint:** `/chat/completions`

### Description

List stored Chat Completions. Only Chat Completions that have been stored
with the `store` parameter set to `true` will be returned.


### Parameters

- **model** (query, string): The model used to generate the Chat Completions.
- **metadata** (query, ): A list of metadata keys to filter the Chat Completions by. Example:

`metadata[key1]=value1&metadata[key2]=value2`

- **after** (query, string): Identifier for the last chat completion from the previous pagination request.
- **limit** (query, integer): Number of Chat Completions to retrieve.
- **order** (query, string): Sort order for Chat Completions by timestamp. Use `asc` for ascending order or `desc` for descending order. Defaults to `asc`.

### Responses

- **200**: A list of Chat Completions

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.chat.completions.list()
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
for await (const chatCompletion of client.chat.completions.list()) {
  console.log(chatCompletion.id);
}
```

---

## Create chat completion

**Method:** `POST`

**Endpoint:** `/chat/completions`

### Description

**Starting a new project?** We recommend trying [Responses](https://platform.openai.com/docs/api-reference/responses) 
to take advantage of the latest OpenAI platform features. Compare
[Chat Completions with Responses](https://platform.openai.com/docs/guides/responses-vs-chat-completions?api-mode=responses).

---

Creates a model response for the given chat conversation. Learn more in the
[text generation](https://platform.openai.com/docs/guides/text-generation), [vision](https://platform.openai.com/docs/guides/vision),
and [audio](https://platform.openai.com/docs/guides/audio) guides.

Parameter support can differ depending on the model used to generate the
response, particularly for newer reasoning models. Parameters that are only
supported for reasoning models are noted below. For the current state of 
unsupported parameters in reasoning models, 
[refer to the reasoning guide](https://platform.openai.com/docs/guides/reasoning).


### Request Body

Reference: `CreateChatCompletionRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "VAR_chat_model_id",
    "messages": [
      {
        "role": "developer",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
chat_completion = client.chat.completions.create(
    messages=[{
        "content": "string",
        "role": "developer",
    }],
    model="gpt-4o",
)
print(chat_completion)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const chatCompletion = await client.chat.completions.create({
  messages: [{ content: 'string', role: 'developer' }],
  model: 'gpt-4o',
});

console.log(chatCompletion);
```

---

## Get chat completion

**Method:** `GET`

**Endpoint:** `/chat/completions/{completion_id}`

### Description

Get a stored chat completion. Only Chat Completions that have been created
with the `store` parameter set to `true` will be returned.


### Parameters

- **completion_id** (path, string) (required): The ID of the chat completion to retrieve.

### Responses

- **200**: A chat completion

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/chat/completions/chatcmpl-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
chat_completion = client.chat.completions.retrieve(
    "completion_id",
)
print(chat_completion.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const chatCompletion = await client.chat.completions.retrieve('completion_id');

console.log(chatCompletion.id);
```

---

## Update chat completion

**Method:** `POST`

**Endpoint:** `/chat/completions/{completion_id}`

### Description

Modify a stored chat completion. Only Chat Completions that have been
created with the `store` parameter set to `true` can be modified. Currently,
the only supported modification is to update the `metadata` field.


### Parameters

- **completion_id** (path, string) (required): The ID of the chat completion to update.

### Responses

- **200**: A chat completion

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/chat/completions/chat_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"metadata": {"foo": "bar"}}'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
chat_completion = client.chat.completions.update(
    completion_id="completion_id",
    metadata={
        "foo": "string"
    },
)
print(chat_completion.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const chatCompletion = await client.chat.completions.update('completion_id', { metadata: { foo: 'string' } });

console.log(chatCompletion.id);
```

---

## Delete chat completion

**Method:** `DELETE`

**Endpoint:** `/chat/completions/{completion_id}`

### Description

Delete a stored chat completion. Only Chat Completions that have been
created with the `store` parameter set to `true` can be deleted.


### Parameters

- **completion_id** (path, string) (required): The ID of the chat completion to delete.

### Responses

- **200**: The chat completion was deleted successfully.

### Code Examples

**Curl:**

```curl
curl -X DELETE https://api.openai.com/v1/chat/completions/chat_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
chat_completion_deleted = client.chat.completions.delete(
    "completion_id",
)
print(chat_completion_deleted.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const chatCompletionDeleted = await client.chat.completions.delete('completion_id');

console.log(chatCompletionDeleted.id);
```

---

## Get chat messages

**Method:** `GET`

**Endpoint:** `/chat/completions/{completion_id}/messages`

### Description

Get the messages in a stored chat completion. Only Chat Completions that
have been created with the `store` parameter set to `true` will be
returned.


### Parameters

- **completion_id** (path, string) (required): The ID of the chat completion to retrieve messages from.
- **after** (query, string): Identifier for the last message from the previous pagination request.
- **limit** (query, integer): Number of messages to retrieve.
- **order** (query, string): Sort order for messages by timestamp. Use `asc` for ascending order or `desc` for descending order. Defaults to `asc`.

### Responses

- **200**: A list of messages

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/chat/completions/chat_abc123/messages \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.chat.completions.messages.list(
    completion_id="completion_id",
)
page = page.data[0]
print(page)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

// Automatically fetches more pages as needed.
for await (const chatCompletionStoreMessage of client.chat.completions.messages.list('completion_id')) {
  console.log(chatCompletionStoreMessage);
}
```

---

