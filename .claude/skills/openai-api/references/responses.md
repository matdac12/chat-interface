# Responses

## Table of Contents

- [Create a model response](#create-a-model-response)
- [Get a model response](#get-a-model-response)
- [Delete a model response](#delete-a-model-response)
- [Cancel a response](#cancel-a-response)
- [List input items](#list-input-items)

---

## Create a model response

**Method:** `POST`

**Endpoint:** `/responses`

### Description

Creates a model response. Provide [text](https://platform.openai.com/docs/guides/text) or
[image](https://platform.openai.com/docs/guides/images) inputs to generate [text](https://platform.openai.com/docs/guides/text)
or [JSON](https://platform.openai.com/docs/guides/structured-outputs) outputs. Have the model call
your own [custom code](https://platform.openai.com/docs/guides/function-calling) or use built-in
[tools](https://platform.openai.com/docs/guides/tools) like [web search](https://platform.openai.com/docs/guides/tools-web-search)
or [file search](https://platform.openai.com/docs/guides/tools-file-search) to use your own data
as input for the model's response.


### Request Body

Reference: `CreateResponse`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4.1",
    "input": "Tell me a three sentence bedtime story about a unicorn."
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
response = client.responses.create()
print(response.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const response = await client.responses.create();

console.log(response.id);
```

---

## Get a model response

**Method:** `GET`

**Endpoint:** `/responses/{response_id}`

### Description

Retrieves a model response with the given ID.


### Parameters

- **response_id** (path, string) (required): The ID of the response to retrieve.
- **include** (query, array): Additional fields to include in the response. See the `include`
parameter for Response creation above for more information.

- **stream** (query, boolean): If set to true, the model response data will be streamed to the client
as it is generated using [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format).
See the [Streaming section below](https://platform.openai.com/docs/api-reference/responses-streaming)
for more information.

- **starting_after** (query, integer): The sequence number of the event after which to start streaming.

- **include_obfuscation** (query, boolean): When true, stream obfuscation will be enabled. Stream obfuscation adds
random characters to an `obfuscation` field on streaming delta events
to normalize payload sizes as a mitigation to certain side-channel
attacks. These obfuscation fields are included by default, but add a
small amount of overhead to the data stream. You can set
`include_obfuscation` to false to optimize for bandwidth if you trust
the network links between your application and the OpenAI API.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/responses/resp_123 \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
response = client.responses.retrieve(
    response_id="resp_677efb5139a88190b512bc3fef8e535d",
)
print(response.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const response = await client.responses.retrieve('resp_677efb5139a88190b512bc3fef8e535d');

console.log(response.id);
```

---

## Delete a model response

**Method:** `DELETE`

**Endpoint:** `/responses/{response_id}`

### Description

Deletes a model response with the given ID.


### Parameters

- **response_id** (path, string) (required): The ID of the response to delete.

### Responses

- **200**: OK
- **404**: Not Found

### Code Examples

**Curl:**

```curl
curl -X DELETE https://api.openai.com/v1/responses/resp_123 \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
client.responses.delete(
    "resp_677efb5139a88190b512bc3fef8e535d",
)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

await client.responses.delete('resp_677efb5139a88190b512bc3fef8e535d');
```

---

## Cancel a response

**Method:** `POST`

**Endpoint:** `/responses/{response_id}/cancel`

### Description

Cancels a model response with the given ID. Only responses created with
the `background` parameter set to `true` can be cancelled. 
[Learn more](https://platform.openai.com/docs/guides/background).


### Parameters

- **response_id** (path, string) (required): The ID of the response to cancel.

### Responses

- **200**: OK
- **404**: Not Found

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/responses/resp_123/cancel \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
response = client.responses.cancel(
    "resp_677efb5139a88190b512bc3fef8e535d",
)
print(response.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const response = await client.responses.cancel('resp_677efb5139a88190b512bc3fef8e535d');

console.log(response.id);
```

---

## List input items

**Method:** `GET`

**Endpoint:** `/responses/{response_id}/input_items`

### Description

Returns a list of input items for a given response.

### Parameters

- **response_id** (path, string) (required): The ID of the response to retrieve input items for.
- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between
1 and 100, and the default is 20.

- **order** (query, string): The order to return the input items in. Default is `desc`.
- `asc`: Return the input items in ascending order.
- `desc`: Return the input items in descending order.

- **after** (query, string): An item ID to list items after, used in pagination.

- **include** (query, array): Additional fields to include in the response. See the `include`
parameter for Response creation above for more information.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/responses/resp_abc123/input_items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.responses.input_items.list(
    response_id="response_id",
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
for await (const responseItem of client.responses.inputItems.list('response_id')) {
  console.log(responseItem);
}
```

---

