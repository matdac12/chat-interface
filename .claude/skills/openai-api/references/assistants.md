# Assistants

## Table of Contents

- [List assistants](#list-assistants)
- [Create assistant](#create-assistant)
- [Retrieve assistant](#retrieve-assistant)
- [Modify assistant](#modify-assistant)
- [Delete assistant](#delete-assistant)
- [Create thread](#create-thread)
- [Create thread and run](#create-thread-and-run)
- [Retrieve thread](#retrieve-thread)
- [Modify thread](#modify-thread)
- [Delete thread](#delete-thread)
- [List messages](#list-messages)
- [Create message](#create-message)
- [Retrieve message](#retrieve-message)
- [Modify message](#modify-message)
- [Delete message](#delete-message)
- [List runs](#list-runs)
- [Create run](#create-run)
- [Retrieve run](#retrieve-run)
- [Modify run](#modify-run)
- [Cancel a run](#cancel-a-run)
- [List run steps](#list-run-steps)
- [Retrieve run step](#retrieve-run-step)
- [Submit tool outputs to run](#submit-tool-outputs-to-run)

---

## List assistants

**Method:** `GET`

**Endpoint:** `/assistants`

### Description

Returns a list of assistants.

### Parameters

- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **order** (query, string): Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **before** (query, string): A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl "https://api.openai.com/v1/assistants?order=desc&limit=20" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.beta.assistants.list()
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
for await (const assistant of client.beta.assistants.list()) {
  console.log(assistant.id);
}
```

---

## Create assistant

**Method:** `POST`

**Endpoint:** `/assistants`

### Description

Create an assistant with a model and instructions.

### Request Body

Reference: `CreateAssistantRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl "https://api.openai.com/v1/assistants" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "instructions": "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
    "name": "Math Tutor",
    "tools": [{"type": "code_interpreter"}],
    "model": "gpt-4o"
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
assistant = client.beta.assistants.create(
    model="gpt-4o",
)
print(assistant.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const assistant = await client.beta.assistants.create({ model: 'gpt-4o' });

console.log(assistant.id);
```

---

## Retrieve assistant

**Method:** `GET`

**Endpoint:** `/assistants/{assistant_id}`

### Description

Retrieves an assistant.

### Parameters

- **assistant_id** (path, string) (required): The ID of the assistant to retrieve.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/assistants/asst_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
assistant = client.beta.assistants.retrieve(
    "assistant_id",
)
print(assistant.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const assistant = await client.beta.assistants.retrieve('assistant_id');

console.log(assistant.id);
```

---

## Modify assistant

**Method:** `POST`

**Endpoint:** `/assistants/{assistant_id}`

### Description

Modifies an assistant.

### Parameters

- **assistant_id** (path, string) (required): The ID of the assistant to modify.

### Request Body

Reference: `ModifyAssistantRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/assistants/asst_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies. Always response with info from either of the files.",
      "tools": [{"type": "file_search"}],
      "model": "gpt-4o"
    }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
assistant = client.beta.assistants.update(
    assistant_id="assistant_id",
)
print(assistant.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const assistant = await client.beta.assistants.update('assistant_id');

console.log(assistant.id);
```

---

## Delete assistant

**Method:** `DELETE`

**Endpoint:** `/assistants/{assistant_id}`

### Description

Delete an assistant.

### Parameters

- **assistant_id** (path, string) (required): The ID of the assistant to delete.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/assistants/asst_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
assistant_deleted = client.beta.assistants.delete(
    "assistant_id",
)
print(assistant_deleted.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const assistantDeleted = await client.beta.assistants.delete('assistant_id');

console.log(assistantDeleted.id);
```

---

## Create thread

**Method:** `POST`

**Endpoint:** `/threads`

### Description

Create a thread.

### Request Body

Reference: `CreateThreadRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d ''

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
thread = client.beta.threads.create()
print(thread.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const thread = await client.beta.threads.create();

console.log(thread.id);
```

---

## Create thread and run

**Method:** `POST`

**Endpoint:** `/threads/runs`

### Description

Create a thread and run it in one request.

### Request Body

Reference: `CreateThreadAndRunRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "assistant_id": "asst_abc123",
      "thread": {
        "messages": [
          {"role": "user", "content": "Explain deep learning to a 5 year old."}
        ]
      }
    }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
run = client.beta.threads.create_and_run(
    assistant_id="assistant_id",
)
print(run.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const run = await client.beta.threads.createAndRun({ assistant_id: 'assistant_id' });

console.log(run.id);
```

---

## Retrieve thread

**Method:** `GET`

**Endpoint:** `/threads/{thread_id}`

### Description

Retrieves a thread.

### Parameters

- **thread_id** (path, string) (required): The ID of the thread to retrieve.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/thread_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
thread = client.beta.threads.retrieve(
    "thread_id",
)
print(thread.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const thread = await client.beta.threads.retrieve('thread_id');

console.log(thread.id);
```

---

## Modify thread

**Method:** `POST`

**Endpoint:** `/threads/{thread_id}`

### Description

Modifies a thread.

### Parameters

- **thread_id** (path, string) (required): The ID of the thread to modify. Only the `metadata` can be modified.

### Request Body

Reference: `ModifyThreadRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/thread_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "metadata": {
        "modified": "true",
        "user": "abc123"
      }
    }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
thread = client.beta.threads.update(
    thread_id="thread_id",
)
print(thread.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const thread = await client.beta.threads.update('thread_id');

console.log(thread.id);
```

---

## Delete thread

**Method:** `DELETE`

**Endpoint:** `/threads/{thread_id}`

### Description

Delete a thread.

### Parameters

- **thread_id** (path, string) (required): The ID of the thread to delete.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/thread_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
thread_deleted = client.beta.threads.delete(
    "thread_id",
)
print(thread_deleted.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const threadDeleted = await client.beta.threads.delete('thread_id');

console.log(threadDeleted.id);
```

---

## List messages

**Method:** `GET`

**Endpoint:** `/threads/{thread_id}/messages`

### Description

Returns a list of messages for a given thread.

### Parameters

- **thread_id** (path, string) (required): The ID of the [thread](https://platform.openai.com/docs/api-reference/threads) the messages belong to.
- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **order** (query, string): Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **before** (query, string): A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.

- **run_id** (query, string): Filter messages by the run ID that generated them.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/thread_abc123/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.beta.threads.messages.list(
    thread_id="thread_id",
)
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
for await (const message of client.beta.threads.messages.list('thread_id')) {
  console.log(message.id);
}
```

---

## Create message

**Method:** `POST`

**Endpoint:** `/threads/{thread_id}/messages`

### Description

Create a message.

### Parameters

- **thread_id** (path, string) (required): The ID of the [thread](https://platform.openai.com/docs/api-reference/threads) to create a message for.

### Request Body

Reference: `CreateMessageRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/thread_abc123/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "role": "user",
      "content": "How does AI work? Explain it in simple terms."
    }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
message = client.beta.threads.messages.create(
    thread_id="thread_id",
    content="string",
    role="user",
)
print(message.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const message = await client.beta.threads.messages.create('thread_id', { content: 'string', role: 'user' });

console.log(message.id);
```

---

## Retrieve message

**Method:** `GET`

**Endpoint:** `/threads/{thread_id}/messages/{message_id}`

### Description

Retrieve a message.

### Parameters

- **thread_id** (path, string) (required): The ID of the [thread](https://platform.openai.com/docs/api-reference/threads) to which this message belongs.
- **message_id** (path, string) (required): The ID of the message to retrieve.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/thread_abc123/messages/msg_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
message = client.beta.threads.messages.retrieve(
    message_id="message_id",
    thread_id="thread_id",
)
print(message.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const message = await client.beta.threads.messages.retrieve('message_id', { thread_id: 'thread_id' });

console.log(message.id);
```

---

## Modify message

**Method:** `POST`

**Endpoint:** `/threads/{thread_id}/messages/{message_id}`

### Description

Modifies a message.

### Parameters

- **thread_id** (path, string) (required): The ID of the thread to which this message belongs.
- **message_id** (path, string) (required): The ID of the message to modify.

### Request Body

Reference: `ModifyMessageRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/thread_abc123/messages/msg_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "metadata": {
        "modified": "true",
        "user": "abc123"
      }
    }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
message = client.beta.threads.messages.update(
    message_id="message_id",
    thread_id="thread_id",
)
print(message.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const message = await client.beta.threads.messages.update('message_id', { thread_id: 'thread_id' });

console.log(message.id);
```

---

## Delete message

**Method:** `DELETE`

**Endpoint:** `/threads/{thread_id}/messages/{message_id}`

### Description

Deletes a message.

### Parameters

- **thread_id** (path, string) (required): The ID of the thread to which this message belongs.
- **message_id** (path, string) (required): The ID of the message to delete.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl -X DELETE https://api.openai.com/v1/threads/thread_abc123/messages/msg_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
message_deleted = client.beta.threads.messages.delete(
    message_id="message_id",
    thread_id="thread_id",
)
print(message_deleted.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const messageDeleted = await client.beta.threads.messages.delete('message_id', { thread_id: 'thread_id' });

console.log(messageDeleted.id);
```

---

## List runs

**Method:** `GET`

**Endpoint:** `/threads/{thread_id}/runs`

### Description

Returns a list of runs belonging to a thread.

### Parameters

- **thread_id** (path, string) (required): The ID of the thread the run belongs to.
- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **order** (query, string): Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **before** (query, string): A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/thread_abc123/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.beta.threads.runs.list(
    thread_id="thread_id",
)
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
for await (const run of client.beta.threads.runs.list('thread_id')) {
  console.log(run.id);
}
```

---

## Create run

**Method:** `POST`

**Endpoint:** `/threads/{thread_id}/runs`

### Description

Create a run.

### Parameters

- **thread_id** (path, string) (required): The ID of the thread to run.
- **include[]** (query, array): A list of additional fields to include in the response. Currently the only supported value is `step_details.tool_calls[*].file_search.results[*].content` to fetch the file search result content.

See the [file search tool documentation](https://platform.openai.com/docs/assistants/tools/file-search#customizing-file-search-settings) for more information.


### Request Body

Reference: `CreateRunRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/thread_abc123/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "assistant_id": "asst_abc123"
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
run = client.beta.threads.runs.create(
    thread_id="thread_id",
    assistant_id="assistant_id",
)
print(run.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const run = await client.beta.threads.runs.create('thread_id', { assistant_id: 'assistant_id' });

console.log(run.id);
```

---

## Retrieve run

**Method:** `GET`

**Endpoint:** `/threads/{thread_id}/runs/{run_id}`

### Description

Retrieves a run.

### Parameters

- **thread_id** (path, string) (required): The ID of the [thread](https://platform.openai.com/docs/api-reference/threads) that was run.
- **run_id** (path, string) (required): The ID of the run to retrieve.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
run = client.beta.threads.runs.retrieve(
    run_id="run_id",
    thread_id="thread_id",
)
print(run.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const run = await client.beta.threads.runs.retrieve('run_id', { thread_id: 'thread_id' });

console.log(run.id);
```

---

## Modify run

**Method:** `POST`

**Endpoint:** `/threads/{thread_id}/runs/{run_id}`

### Description

Modifies a run.

### Parameters

- **thread_id** (path, string) (required): The ID of the [thread](https://platform.openai.com/docs/api-reference/threads) that was run.
- **run_id** (path, string) (required): The ID of the run to modify.

### Request Body

Reference: `ModifyRunRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "metadata": {
      "user_id": "user_abc123"
    }
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
run = client.beta.threads.runs.update(
    run_id="run_id",
    thread_id="thread_id",
)
print(run.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const run = await client.beta.threads.runs.update('run_id', { thread_id: 'thread_id' });

console.log(run.id);
```

---

## Cancel a run

**Method:** `POST`

**Endpoint:** `/threads/{thread_id}/runs/{run_id}/cancel`

### Description

Cancels a run that is `in_progress`.

### Parameters

- **thread_id** (path, string) (required): The ID of the thread to which this run belongs.
- **run_id** (path, string) (required): The ID of the run to cancel.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -X POST

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
run = client.beta.threads.runs.cancel(
    run_id="run_id",
    thread_id="thread_id",
)
print(run.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const run = await client.beta.threads.runs.cancel('run_id', { thread_id: 'thread_id' });

console.log(run.id);
```

---

## List run steps

**Method:** `GET`

**Endpoint:** `/threads/{thread_id}/runs/{run_id}/steps`

### Description

Returns a list of run steps belonging to a run.

### Parameters

- **thread_id** (path, string) (required): The ID of the thread the run and run steps belong to.
- **run_id** (path, string) (required): The ID of the run the run steps belong to.
- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **order** (query, string): Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **before** (query, string): A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.

- **include[]** (query, array): A list of additional fields to include in the response. Currently the only supported value is `step_details.tool_calls[*].file_search.results[*].content` to fetch the file search result content.

See the [file search tool documentation](https://platform.openai.com/docs/assistants/tools/file-search#customizing-file-search-settings) for more information.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123/steps \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.beta.threads.runs.steps.list(
    run_id="run_id",
    thread_id="thread_id",
)
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
for await (const runStep of client.beta.threads.runs.steps.list('run_id', { thread_id: 'thread_id' })) {
  console.log(runStep.id);
}
```

---

## Retrieve run step

**Method:** `GET`

**Endpoint:** `/threads/{thread_id}/runs/{run_id}/steps/{step_id}`

### Description

Retrieves a run step.

### Parameters

- **thread_id** (path, string) (required): The ID of the thread to which the run and run step belongs.
- **run_id** (path, string) (required): The ID of the run to which the run step belongs.
- **step_id** (path, string) (required): The ID of the run step to retrieve.
- **include[]** (query, array): A list of additional fields to include in the response. Currently the only supported value is `step_details.tool_calls[*].file_search.results[*].content` to fetch the file search result content.

See the [file search tool documentation](https://platform.openai.com/docs/assistants/tools/file-search#customizing-file-search-settings) for more information.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123/steps/step_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
run_step = client.beta.threads.runs.steps.retrieve(
    step_id="step_id",
    thread_id="thread_id",
    run_id="run_id",
)
print(run_step.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const runStep = await client.beta.threads.runs.steps.retrieve('step_id', {
  thread_id: 'thread_id',
  run_id: 'run_id',
});

console.log(runStep.id);
```

---

## Submit tool outputs to run

**Method:** `POST`

**Endpoint:** `/threads/{thread_id}/runs/{run_id}/submit_tool_outputs`

### Description

When a run has the `status: "requires_action"` and `required_action.type` is `submit_tool_outputs`, this endpoint can be used to submit the outputs from the tool calls once they're all completed. All outputs must be submitted in a single request.


### Parameters

- **thread_id** (path, string) (required): The ID of the [thread](https://platform.openai.com/docs/api-reference/threads) to which this run belongs.
- **run_id** (path, string) (required): The ID of the run that requires the tool output submission.

### Request Body

Reference: `SubmitToolOutputsRunRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/threads/thread_123/runs/run_123/submit_tool_outputs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "tool_outputs": [
      {
        "tool_call_id": "call_001",
        "output": "70 degrees and sunny."
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
run = client.beta.threads.runs.submit_tool_outputs(
    run_id="run_id",
    thread_id="thread_id",
    tool_outputs=[{}],
)
print(run.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const run = await client.beta.threads.runs.submitToolOutputs('run_id', {
  thread_id: 'thread_id',
  tool_outputs: [{}],
});

console.log(run.id);
```

---

