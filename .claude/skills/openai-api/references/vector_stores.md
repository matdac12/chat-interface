# Vector stores

## Table of Contents

- [List vector stores](#list-vector-stores)
- [Create vector store](#create-vector-store)
- [Retrieve vector store](#retrieve-vector-store)
- [Modify vector store](#modify-vector-store)
- [Delete vector store](#delete-vector-store)
- [Create vector store file batch](#create-vector-store-file-batch)
- [Retrieve vector store file batch](#retrieve-vector-store-file-batch)
- [Cancel vector store file batch](#cancel-vector-store-file-batch)
- [List vector store files in a batch](#list-vector-store-files-in-a-batch)
- [List vector store files](#list-vector-store-files)
- [Create vector store file](#create-vector-store-file)
- [Retrieve vector store file](#retrieve-vector-store-file)
- [Delete vector store file](#delete-vector-store-file)
- [Update vector store file attributes](#update-vector-store-file-attributes)
- [Retrieve vector store file content](#retrieve-vector-store-file-content)
- [Search vector store](#search-vector-store)

---

## List vector stores

**Method:** `GET`

**Endpoint:** `/vector_stores`

### Description

Returns a list of vector stores.

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
curl https://api.openai.com/v1/vector_stores \
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
page = client.vector_stores.list()
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
for await (const vectorStore of client.vectorStores.list()) {
  console.log(vectorStore.id);
}
```

---

## Create vector store

**Method:** `POST`

**Endpoint:** `/vector_stores`

### Description

Create a vector store.

### Request Body

Reference: `CreateVectorStoreRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/vector_stores \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "name": "Support FAQ"
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
vector_store = client.vector_stores.create()
print(vector_store.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const vectorStore = await client.vectorStores.create();

console.log(vectorStore.id);
```

---

## Retrieve vector store

**Method:** `GET`

**Endpoint:** `/vector_stores/{vector_store_id}`

### Description

Retrieves a vector store.

### Parameters

- **vector_store_id** (path, string) (required): The ID of the vector store to retrieve.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/vector_stores/vs_abc123 \
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
vector_store = client.vector_stores.retrieve(
    "vector_store_id",
)
print(vector_store.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const vectorStore = await client.vectorStores.retrieve('vector_store_id');

console.log(vectorStore.id);
```

---

## Modify vector store

**Method:** `POST`

**Endpoint:** `/vector_stores/{vector_store_id}`

### Description

Modifies a vector store.

### Parameters

- **vector_store_id** (path, string) (required): The ID of the vector store to modify.

### Request Body

Reference: `UpdateVectorStoreRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/vector_stores/vs_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
  -d '{
    "name": "Support FAQ"
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
vector_store = client.vector_stores.update(
    vector_store_id="vector_store_id",
)
print(vector_store.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const vectorStore = await client.vectorStores.update('vector_store_id');

console.log(vectorStore.id);
```

---

## Delete vector store

**Method:** `DELETE`

**Endpoint:** `/vector_stores/{vector_store_id}`

### Description

Delete a vector store.

### Parameters

- **vector_store_id** (path, string) (required): The ID of the vector store to delete.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/vector_stores/vs_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
vector_store_deleted = client.vector_stores.delete(
    "vector_store_id",
)
print(vector_store_deleted.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const vectorStoreDeleted = await client.vectorStores.delete('vector_store_id');

console.log(vectorStoreDeleted.id);
```

---

## Create vector store file batch

**Method:** `POST`

**Endpoint:** `/vector_stores/{vector_store_id}/file_batches`

### Description

Create a vector store file batch.

### Parameters

- **vector_store_id** (path, string) (required): The ID of the vector store for which to create a File Batch.


### Request Body

Reference: `CreateVectorStoreFileBatchRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/vector_stores/vs_abc123/file_batches \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json \
    -H "OpenAI-Beta: assistants=v2" \
    -d '{
      "file_ids": ["file-abc123", "file-abc456"]
    }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
vector_store_file_batch = client.vector_stores.file_batches.create(
    vector_store_id="vs_abc123",
    file_ids=["string"],
)
print(vector_store_file_batch.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const vectorStoreFileBatch = await client.vectorStores.fileBatches.create('vs_abc123', {
  file_ids: ['string'],
});

console.log(vectorStoreFileBatch.id);
```

---

## Retrieve vector store file batch

**Method:** `GET`

**Endpoint:** `/vector_stores/{vector_store_id}/file_batches/{batch_id}`

### Description

Retrieves a vector store file batch.

### Parameters

- **vector_store_id** (path, string) (required): The ID of the vector store that the file batch belongs to.
- **batch_id** (path, string) (required): The ID of the file batch being retrieved.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/vector_stores/vs_abc123/files_batches/vsfb_abc123 \
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
vector_store_file_batch = client.vector_stores.file_batches.retrieve(
    batch_id="vsfb_abc123",
    vector_store_id="vs_abc123",
)
print(vector_store_file_batch.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const vectorStoreFileBatch = await client.vectorStores.fileBatches.retrieve('vsfb_abc123', {
  vector_store_id: 'vs_abc123',
});

console.log(vectorStoreFileBatch.id);
```

---

## Cancel vector store file batch

**Method:** `POST`

**Endpoint:** `/vector_stores/{vector_store_id}/file_batches/{batch_id}/cancel`

### Description

Cancel a vector store file batch. This attempts to cancel the processing of files in this batch as soon as possible.

### Parameters

- **vector_store_id** (path, string) (required): The ID of the vector store that the file batch belongs to.
- **batch_id** (path, string) (required): The ID of the file batch to cancel.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/vector_stores/vs_abc123/files_batches/vsfb_abc123/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -X POST

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
vector_store_file_batch = client.vector_stores.file_batches.cancel(
    batch_id="batch_id",
    vector_store_id="vector_store_id",
)
print(vector_store_file_batch.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const vectorStoreFileBatch = await client.vectorStores.fileBatches.cancel('batch_id', {
  vector_store_id: 'vector_store_id',
});

console.log(vectorStoreFileBatch.id);
```

---

## List vector store files in a batch

**Method:** `GET`

**Endpoint:** `/vector_stores/{vector_store_id}/file_batches/{batch_id}/files`

### Description

Returns a list of vector store files in a batch.

### Parameters

- **vector_store_id** (path, string) (required): The ID of the vector store that the files belong to.
- **batch_id** (path, string) (required): The ID of the file batch that the files belong to.
- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **order** (query, string): Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **before** (query, string): A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.

- **filter** (query, string): Filter by file status. One of `in_progress`, `completed`, `failed`, `cancelled`.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/vector_stores/vs_abc123/files_batches/vsfb_abc123/files \
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
page = client.vector_stores.file_batches.list_files(
    batch_id="batch_id",
    vector_store_id="vector_store_id",
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
for await (const vectorStoreFile of client.vectorStores.fileBatches.listFiles('batch_id', {
  vector_store_id: 'vector_store_id',
})) {
  console.log(vectorStoreFile.id);
}
```

---

## List vector store files

**Method:** `GET`

**Endpoint:** `/vector_stores/{vector_store_id}/files`

### Description

Returns a list of vector store files.

### Parameters

- **vector_store_id** (path, string) (required): The ID of the vector store that the files belong to.
- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **order** (query, string): Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **before** (query, string): A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.

- **filter** (query, string): Filter by file status. One of `in_progress`, `completed`, `failed`, `cancelled`.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/vector_stores/vs_abc123/files \
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
page = client.vector_stores.files.list(
    vector_store_id="vector_store_id",
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
for await (const vectorStoreFile of client.vectorStores.files.list('vector_store_id')) {
  console.log(vectorStoreFile.id);
}
```

---

## Create vector store file

**Method:** `POST`

**Endpoint:** `/vector_stores/{vector_store_id}/files`

### Description

Create a vector store file by attaching a [File](https://platform.openai.com/docs/api-reference/files) to a [vector store](https://platform.openai.com/docs/api-reference/vector-stores/object).

### Parameters

- **vector_store_id** (path, string) (required): The ID of the vector store for which to create a File.


### Request Body

Reference: `CreateVectorStoreFileRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/vector_stores/vs_abc123/files \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -H "OpenAI-Beta: assistants=v2" \
    -d '{
      "file_id": "file-abc123"
    }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
vector_store_file = client.vector_stores.files.create(
    vector_store_id="vs_abc123",
    file_id="file_id",
)
print(vector_store_file.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const vectorStoreFile = await client.vectorStores.files.create('vs_abc123', { file_id: 'file_id' });

console.log(vectorStoreFile.id);
```

---

## Retrieve vector store file

**Method:** `GET`

**Endpoint:** `/vector_stores/{vector_store_id}/files/{file_id}`

### Description

Retrieves a vector store file.

### Parameters

- **vector_store_id** (path, string) (required): The ID of the vector store that the file belongs to.
- **file_id** (path, string) (required): The ID of the file being retrieved.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/vector_stores/vs_abc123/files/file-abc123 \
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
vector_store_file = client.vector_stores.files.retrieve(
    file_id="file-abc123",
    vector_store_id="vs_abc123",
)
print(vector_store_file.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const vectorStoreFile = await client.vectorStores.files.retrieve('file-abc123', {
  vector_store_id: 'vs_abc123',
});

console.log(vectorStoreFile.id);
```

---

## Delete vector store file

**Method:** `DELETE`

**Endpoint:** `/vector_stores/{vector_store_id}/files/{file_id}`

### Description

Delete a vector store file. This will remove the file from the vector store but the file itself will not be deleted. To delete the file, use the [delete file](https://platform.openai.com/docs/api-reference/files/delete) endpoint.

### Parameters

- **vector_store_id** (path, string) (required): The ID of the vector store that the file belongs to.
- **file_id** (path, string) (required): The ID of the file to delete.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/vector_stores/vs_abc123/files/file-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
vector_store_file_deleted = client.vector_stores.files.delete(
    file_id="file_id",
    vector_store_id="vector_store_id",
)
print(vector_store_file_deleted.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const vectorStoreFileDeleted = await client.vectorStores.files.delete('file_id', {
  vector_store_id: 'vector_store_id',
});

console.log(vectorStoreFileDeleted.id);
```

---

## Update vector store file attributes

**Method:** `POST`

**Endpoint:** `/vector_stores/{vector_store_id}/files/{file_id}`

### Description

Update attributes on a vector store file.

### Parameters

- **vector_store_id** (path, string) (required): The ID of the vector store the file belongs to.
- **file_id** (path, string) (required): The ID of the file to update attributes.

### Request Body

Reference: `UpdateVectorStoreFileAttributesRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/vector_stores/{vector_store_id}/files/{file_id} \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"attributes": {"key1": "value1", "key2": 2}}'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
vector_store_file = client.vector_stores.files.update(
    file_id="file-abc123",
    vector_store_id="vs_abc123",
    attributes={
        "foo": "string"
    },
)
print(vector_store_file.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const vectorStoreFile = await client.vectorStores.files.update('file-abc123', {
  vector_store_id: 'vs_abc123',
  attributes: { foo: 'string' },
});

console.log(vectorStoreFile.id);
```

---

## Retrieve vector store file content

**Method:** `GET`

**Endpoint:** `/vector_stores/{vector_store_id}/files/{file_id}/content`

### Description

Retrieve the parsed contents of a vector store file.

### Parameters

- **vector_store_id** (path, string) (required): The ID of the vector store.
- **file_id** (path, string) (required): The ID of the file within the vector store.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl \
https://api.openai.com/v1/vector_stores/vs_abc123/files/file-abc123/content \
-H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.vector_stores.files.content(
    file_id="file-abc123",
    vector_store_id="vs_abc123",
)
page = page.data[0]
print(page.text)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

// Automatically fetches more pages as needed.
for await (const fileContentResponse of client.vectorStores.files.content('file-abc123', {
  vector_store_id: 'vs_abc123',
})) {
  console.log(fileContentResponse.text);
}
```

---

## Search vector store

**Method:** `POST`

**Endpoint:** `/vector_stores/{vector_store_id}/search`

### Description

Search a vector store for relevant chunks based on a query and file attributes filter.

### Parameters

- **vector_store_id** (path, string) (required): The ID of the vector store to search.

### Request Body

Reference: `VectorStoreSearchRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl -X POST \
https://api.openai.com/v1/vector_stores/vs_abc123/search \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-H "Content-Type: application/json" \
-d '{"query": "What is the return policy?", "filters": {...}}'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.vector_stores.search(
    vector_store_id="vs_abc123",
    query="string",
)
page = page.data[0]
print(page.file_id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

// Automatically fetches more pages as needed.
for await (const vectorStoreSearchResponse of client.vectorStores.search('vs_abc123', { query: 'string' })) {
  console.log(vectorStoreSearchResponse.file_id);
}
```

---

