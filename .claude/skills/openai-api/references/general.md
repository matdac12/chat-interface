# General

## Table of Contents

- [List containers](#list-containers)
- [Create container](#create-container)
- [Retrieve container](#retrieve-container)
- [Delete a container](#delete-a-container)
- [Create container file](#create-container-file)
- [List container files](#list-container-files)
- [Retrieve container file](#retrieve-container-file)
- [Delete a container file](#delete-a-container-file)
- [Retrieve container file content](#retrieve-container-file-content)
- [List all organization and project API keys.](#list-all-organization-and-project-api-keys)
- [Create admin API key](#create-admin-api-key)
- [Retrieve admin API key](#retrieve-admin-api-key)
- [Delete admin API key](#delete-admin-api-key)
- [Cancel chat session](#cancel-chat-session)
- [Create ChatKit session](#create-chatkit-session)
- [List ChatKit thread items](#list-chatkit-thread-items)
- [Retrieve ChatKit thread](#retrieve-chatkit-thread)
- [Delete ChatKit thread](#delete-chatkit-thread)
- [List ChatKit threads](#list-chatkit-threads)

---

## List containers

**Method:** `GET`

**Endpoint:** `/containers`

### Description

List Containers

### Parameters

- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **order** (query, string): Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.


### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/containers \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.containers.list()
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
for await (const containerListResponse of client.containers.list()) {
  console.log(containerListResponse.id);
}
```

---

## Create container

**Method:** `POST`

**Endpoint:** `/containers`

### Description

Create Container

### Request Body

Reference: `CreateContainerBody`

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/containers \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "My Container"
      }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
container = client.containers.create(
    name="name",
)
print(container.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const container = await client.containers.create({ name: 'name' });

console.log(container.id);
```

---

## Retrieve container

**Method:** `GET`

**Endpoint:** `/containers/{container_id}`

### Description

Retrieve Container

### Parameters

- **container_id** (path, string) (required): 

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/containers/cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863 \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
container = client.containers.retrieve(
    "container_id",
)
print(container.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const container = await client.containers.retrieve('container_id');

console.log(container.id);
```

---

## Delete a container

**Method:** `DELETE`

**Endpoint:** `/containers/{container_id}`

### Description

Delete Container

### Parameters

- **container_id** (path, string) (required): The ID of the container to delete.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl -X DELETE https://api.openai.com/v1/containers/cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863 \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
client.containers.delete(
    "container_id",
)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

await client.containers.delete('container_id');
```

---

## Create container file

**Method:** `POST`

**Endpoint:** `/containers/{container_id}/files`

### Description

Create a Container File

You can send either a multipart/form-data request with the raw file content, or a JSON request with a file ID.


### Parameters

- **container_id** (path, string) (required): 

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/containers/cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F file="@example.txt"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
file = client.containers.files.create(
    container_id="container_id",
)
print(file.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const file = await client.containers.files.create('container_id');

console.log(file.id);
```

---

## List container files

**Method:** `GET`

**Endpoint:** `/containers/{container_id}/files`

### Description

List Container files

### Parameters

- **container_id** (path, string) (required): 
- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **order** (query, string): Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.


### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/containers/cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04/files \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.containers.files.list(
    container_id="container_id",
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
for await (const fileListResponse of client.containers.files.list('container_id')) {
  console.log(fileListResponse.id);
}
```

---

## Retrieve container file

**Method:** `GET`

**Endpoint:** `/containers/{container_id}/files/{file_id}`

### Description

Retrieve Container File

### Parameters

- **container_id** (path, string) (required): 
- **file_id** (path, string) (required): 

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/containers/container_123/files/file_456 \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
file = client.containers.files.retrieve(
    file_id="file_id",
    container_id="container_id",
)
print(file.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const file = await client.containers.files.retrieve('file_id', { container_id: 'container_id' });

console.log(file.id);
```

---

## Delete a container file

**Method:** `DELETE`

**Endpoint:** `/containers/{container_id}/files/{file_id}`

### Description

Delete Container File

### Parameters

- **container_id** (path, string) (required): 
- **file_id** (path, string) (required): 

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl -X DELETE https://api.openai.com/v1/containers/cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863/files/cfile_682e0e8a43c88191a7978f477a09bdf5 \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
client.containers.files.delete(
    file_id="file_id",
    container_id="container_id",
)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

await client.containers.files.delete('file_id', { container_id: 'container_id' });
```

---

## Retrieve container file content

**Method:** `GET`

**Endpoint:** `/containers/{container_id}/files/{file_id}/content`

### Description

Retrieve Container File Content

### Parameters

- **container_id** (path, string) (required): 
- **file_id** (path, string) (required): 

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/containers/container_123/files/cfile_456/content \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
content = client.containers.files.content.retrieve(
    file_id="file_id",
    container_id="container_id",
)
print(content)
data = content.read()
print(data)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const content = await client.containers.files.content.retrieve('file_id', { container_id: 'container_id' });

console.log(content);

const data = await content.blob();
console.log(data);
```

---

## List all organization and project API keys.

**Method:** `GET`

**Endpoint:** `/organization/admin_api_keys`

### Description

List organization API keys

### Parameters

- **after** (query, string): 
- **order** (query, string): 
- **limit** (query, integer): 

### Responses

- **200**: A list of organization API keys.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/admin_api_keys?after=key_abc&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Create admin API key

**Method:** `POST`

**Endpoint:** `/organization/admin_api_keys`

### Description

Create an organization admin API key

### Responses

- **200**: The newly created admin API key.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/organization/admin_api_keys \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "name": "New Admin Key"
  }'

```

---

## Retrieve admin API key

**Method:** `GET`

**Endpoint:** `/organization/admin_api_keys/{key_id}`

### Description

Retrieve a single organization API key

### Parameters

- **key_id** (path, string) (required): 

### Responses

- **200**: Details of the requested API key.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/admin_api_keys/key_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Delete admin API key

**Method:** `DELETE`

**Endpoint:** `/organization/admin_api_keys/{key_id}`

### Description

Delete an organization admin API key

### Parameters

- **key_id** (path, string) (required): 

### Responses

- **200**: Confirmation that the API key was deleted.

### Code Examples

**Curl:**

```curl
curl -X DELETE https://api.openai.com/v1/organization/admin_api_keys/key_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Cancel chat session

**Method:** `POST`

**Endpoint:** `/chatkit/sessions/{session_id}/cancel`

### Description

Cancel a ChatKit session

### Parameters

- **session_id** (path, string) (required): Unique identifier for the ChatKit session to cancel.

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl -X POST \
  https://api.openai.com/v1/chatkit/sessions/cksess_123/cancel \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
chat_session = client.beta.chatkit.sessions.cancel(
    "cksess_123",
)
print(chat_session.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const chatSession = await client.beta.chatkit.sessions.cancel('cksess_123');

console.log(chatSession.id);
```

---

## Create ChatKit session

**Method:** `POST`

**Endpoint:** `/chatkit/sessions`

### Description

Create a ChatKit session

### Request Body

Reference: `CreateChatSessionBody`

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/chatkit/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -d '{
    "workflow": {
      "id": "workflow_alpha",
      "version": "2024-10-01"
    },
    "scope": {
      "project": "alpha",
      "environment": "staging"
    },
    "expires_after": 1800,
    "max_requests_per_1_minute": 60,
    "max_requests_per_session": 500
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
chat_session = client.beta.chatkit.sessions.create(
    user="x",
    workflow={
        "id": "id"
    },
)
print(chat_session.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const chatSession = await client.beta.chatkit.sessions.create({ user: 'x', workflow: { id: 'id' } });

console.log(chatSession.id);
```

---

## List ChatKit thread items

**Method:** `GET`

**Endpoint:** `/chatkit/threads/{thread_id}/items`

### Description

List ChatKit thread items

### Parameters

- **thread_id** (path, string) (required): Identifier of the ChatKit thread whose items are requested.
- **limit** (query, integer): Maximum number of thread items to return. Defaults to 20.
- **order** (query, ): Sort order for results by creation time. Defaults to `desc`.
- **after** (query, string): List items created after this thread item ID. Defaults to null for the first page.
- **before** (query, string): List items created before this thread item ID. Defaults to null for the newest results.

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl "https://api.openai.com/v1/chatkit/threads/cthr_abc123/items?limit=3" \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.beta.chatkit.threads.list_items(
    thread_id="cthr_123",
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
for await (const thread of client.beta.chatkit.threads.listItems('cthr_123')) {
  console.log(thread);
}
```

---

## Retrieve ChatKit thread

**Method:** `GET`

**Endpoint:** `/chatkit/threads/{thread_id}`

### Description

Retrieve a ChatKit thread

### Parameters

- **thread_id** (path, string) (required): Identifier of the ChatKit thread to retrieve.

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/chatkit/threads/cthr_abc123 \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
chatkit_thread = client.beta.chatkit.threads.retrieve(
    "cthr_123",
)
print(chatkit_thread.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const chatkitThread = await client.beta.chatkit.threads.retrieve('cthr_123');

console.log(chatkitThread.id);
```

---

## Delete ChatKit thread

**Method:** `DELETE`

**Endpoint:** `/chatkit/threads/{thread_id}`

### Description

Delete a ChatKit thread

### Parameters

- **thread_id** (path, string) (required): Identifier of the ChatKit thread to delete.

### Responses

- **200**: Success

### Code Examples

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
thread = client.beta.chatkit.threads.delete(
    "cthr_123",
)
print(thread.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const thread = await client.beta.chatkit.threads.delete('cthr_123');

console.log(thread.id);
```

---

## List ChatKit threads

**Method:** `GET`

**Endpoint:** `/chatkit/threads`

### Description

List ChatKit threads

### Parameters

- **limit** (query, integer): Maximum number of thread items to return. Defaults to 20.
- **order** (query, ): Sort order for results by creation time. Defaults to `desc`.
- **after** (query, string): List items created after this thread item ID. Defaults to null for the first page.
- **before** (query, string): List items created before this thread item ID. Defaults to null for the newest results.
- **user** (query, string): Filter threads that belong to this user identifier. Defaults to null to return all users.

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl "https://api.openai.com/v1/chatkit/threads?limit=2&order=desc" \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.beta.chatkit.threads.list()
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
for await (const chatkitThread of client.beta.chatkit.threads.list()) {
  console.log(chatkitThread.id);
}
```

---

