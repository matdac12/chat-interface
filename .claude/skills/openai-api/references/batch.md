# Batch

## Table of Contents

- [Create batch](#create-batch)
- [List batch](#list-batch)
- [Retrieve batch](#retrieve-batch)
- [Cancel batch](#cancel-batch)

---

## Create batch

**Method:** `POST`

**Endpoint:** `/batches`

### Description

Creates and executes a batch from an uploaded file of requests

### Responses

- **200**: Batch created successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/batches \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input_file_id": "file-abc123",
    "endpoint": "/v1/chat/completions",
    "completion_window": "24h"
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
batch = client.batches.create(
    completion_window="24h",
    endpoint="/v1/responses",
    input_file_id="input_file_id",
)
print(batch.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const batch = await client.batches.create({
  completion_window: '24h',
  endpoint: '/v1/responses',
  input_file_id: 'input_file_id',
});

console.log(batch.id);
```

---

## List batch

**Method:** `GET`

**Endpoint:** `/batches`

### Description

List your organization's batches.

### Parameters

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.


### Responses

- **200**: Batch listed successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/batches?limit=2 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.batches.list()
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
for await (const batch of client.batches.list()) {
  console.log(batch.id);
}
```

---

## Retrieve batch

**Method:** `GET`

**Endpoint:** `/batches/{batch_id}`

### Description

Retrieves a batch.

### Parameters

- **batch_id** (path, string) (required): The ID of the batch to retrieve.

### Responses

- **200**: Batch retrieved successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/batches/batch_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
batch = client.batches.retrieve(
    "batch_id",
)
print(batch.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const batch = await client.batches.retrieve('batch_id');

console.log(batch.id);
```

---

## Cancel batch

**Method:** `POST`

**Endpoint:** `/batches/{batch_id}/cancel`

### Description

Cancels an in-progress batch. The batch will be in status `cancelling` for up to 10 minutes, before changing to `cancelled`, where it will have partial results (if any) available in the output file.

### Parameters

- **batch_id** (path, string) (required): The ID of the batch to cancel.

### Responses

- **200**: Batch is cancelling. Returns the cancelling batch's details.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/batches/batch_abc123/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -X POST

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
batch = client.batches.cancel(
    "batch_id",
)
print(batch.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const batch = await client.batches.cancel('batch_id');

console.log(batch.id);
```

---

