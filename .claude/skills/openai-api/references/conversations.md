# Conversations

## Table of Contents

- [Create items](#create-items)
- [List items](#list-items)
- [Retrieve an item](#retrieve-an-item)
- [Delete an item](#delete-an-item)
- [Create a conversation](#create-a-conversation)
- [Retrieve a conversation](#retrieve-a-conversation)
- [Delete a conversation](#delete-a-conversation)
- [Update a conversation](#update-a-conversation)

---

## Create items

**Method:** `POST`

**Endpoint:** `/conversations/{conversation_id}/items`

### Description

Create items in a conversation with the given ID.

### Parameters

- **conversation_id** (path, string) (required): The ID of the conversation to add the item to.
- **include** (query, array): Additional fields to include in the response. See the `include`
parameter for [listing Conversation items above](https://platform.openai.com/docs/api-reference/conversations/list-items#conversations_list_items-include) for more information.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/conversations/conv_123/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "items": [
      {
        "type": "message",
        "role": "user",
        "content": [
          {"type": "input_text", "text": "Hello!"}
        ]
      },
      {
        "type": "message",
        "role": "user",
        "content": [
          {"type": "input_text", "text": "How are you?"}
        ]
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
conversation_item_list = client.conversations.items.create(
    conversation_id="conv_123",
    items=[{
        "content": "string",
        "role": "user",
        "type": "message",
    }],
)
print(conversation_item_list.first_id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const conversationItemList = await client.conversations.items.create('conv_123', {
  items: [{ content: 'string', role: 'user', type: 'message' }],
});

console.log(conversationItemList.first_id);
```

---

## List items

**Method:** `GET`

**Endpoint:** `/conversations/{conversation_id}/items`

### Description

List all items for a conversation with the given ID.

### Parameters

- **conversation_id** (path, string) (required): The ID of the conversation to list items for.
- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between
1 and 100, and the default is 20.

- **order** (query, string): The order to return the input items in. Default is `desc`.
- `asc`: Return the input items in ascending order.
- `desc`: Return the input items in descending order.

- **after** (query, string): An item ID to list items after, used in pagination.

- **include** (query, array): Specify additional output data to include in the model response. Currently supported values are:
- `web_search_call.action.sources`: Include the sources of the web search tool call.
- `code_interpreter_call.outputs`: Includes the outputs of python code execution in code interpreter tool call items.
- `computer_call_output.output.image_url`: Include image urls from the computer call output.
- `file_search_call.results`: Include the search results of the file search tool call.
- `message.input_image.image_url`: Include image urls from the input message.
- `message.output_text.logprobs`: Include logprobs with assistant messages.
- `reasoning.encrypted_content`: Includes an encrypted version of reasoning tokens in reasoning item outputs. This enables reasoning items to be used in multi-turn conversations when using the Responses API statelessly (like when the `store` parameter is set to `false`, or when an organization is enrolled in the zero data retention program).

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl "https://api.openai.com/v1/conversations/conv_123/items?limit=10" \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.conversations.items.list(
    conversation_id="conv_123",
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
for await (const conversationItem of client.conversations.items.list('conv_123')) {
  console.log(conversationItem);
}
```

---

## Retrieve an item

**Method:** `GET`

**Endpoint:** `/conversations/{conversation_id}/items/{item_id}`

### Description

Get a single item from a conversation with the given IDs.

### Parameters

- **conversation_id** (path, string) (required): The ID of the conversation that contains the item.
- **item_id** (path, string) (required): The ID of the item to retrieve.
- **include** (query, array): Additional fields to include in the response. See the `include`
parameter for [listing Conversation items above](https://platform.openai.com/docs/api-reference/conversations/list-items#conversations_list_items-include) for more information.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/conversations/conv_123/items/msg_abc \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
conversation_item = client.conversations.items.retrieve(
    item_id="msg_abc",
    conversation_id="conv_123",
)
print(conversation_item)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const conversationItem = await client.conversations.items.retrieve('msg_abc', {
  conversation_id: 'conv_123',
});

console.log(conversationItem);
```

---

## Delete an item

**Method:** `DELETE`

**Endpoint:** `/conversations/{conversation_id}/items/{item_id}`

### Description

Delete an item from a conversation with the given IDs.

### Parameters

- **conversation_id** (path, string) (required): The ID of the conversation that contains the item.
- **item_id** (path, string) (required): The ID of the item to delete.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl -X DELETE https://api.openai.com/v1/conversations/conv_123/items/msg_abc \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
conversation = client.conversations.items.delete(
    item_id="msg_abc",
    conversation_id="conv_123",
)
print(conversation.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const conversation = await client.conversations.items.delete('msg_abc', { conversation_id: 'conv_123' });

console.log(conversation.id);
```

---

## Create a conversation

**Method:** `POST`

**Endpoint:** `/conversations`

### Description

Create a conversation.

### Request Body

Reference: `CreateConversationBody`

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "metadata": {"topic": "demo"},
    "items": [
      {
        "type": "message",
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
conversation = client.conversations.create()
print(conversation.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const conversation = await client.conversations.create();

console.log(conversation.id);
```

---

## Retrieve a conversation

**Method:** `GET`

**Endpoint:** `/conversations/{conversation_id}`

### Description

Get a conversation

### Parameters

- **conversation_id** (path, string) (required): The ID of the conversation to retrieve.

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/conversations/conv_123 \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
conversation = client.conversations.retrieve(
    "conv_123",
)
print(conversation.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const conversation = await client.conversations.retrieve('conv_123');

console.log(conversation.id);
```

---

## Delete a conversation

**Method:** `DELETE`

**Endpoint:** `/conversations/{conversation_id}`

### Description

Delete a conversation. Items in the conversation will not be deleted.

### Parameters

- **conversation_id** (path, string) (required): The ID of the conversation to delete.

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl -X DELETE https://api.openai.com/v1/conversations/conv_123 \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
conversation_deleted_resource = client.conversations.delete(
    "conv_123",
)
print(conversation_deleted_resource.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const conversationDeletedResource = await client.conversations.delete('conv_123');

console.log(conversationDeletedResource.id);
```

---

## Update a conversation

**Method:** `POST`

**Endpoint:** `/conversations/{conversation_id}`

### Description

Update a conversation

### Parameters

- **conversation_id** (path, string) (required): The ID of the conversation to update.

### Request Body

Reference: `UpdateConversationBody`

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/conversations/conv_123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "metadata": {"topic": "project-x"}
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
conversation = client.conversations.update(
    conversation_id="conv_123",
    metadata={
        "foo": "string"
    },
)
print(conversation.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const conversation = await client.conversations.update('conv_123', { metadata: { foo: 'string' } });

console.log(conversation.id);
```

---

