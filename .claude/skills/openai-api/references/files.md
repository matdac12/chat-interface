# Files

## Table of Contents

- [List files](#list-files)
- [Upload file](#upload-file)
- [Delete file](#delete-file)
- [Retrieve file](#retrieve-file)
- [Retrieve file content](#retrieve-file-content)

---

## List files

**Method:** `GET`

**Endpoint:** `/files`

### Description

Returns a list of files.

### Parameters

- **purpose** (query, string): Only return files with the given purpose.
- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 10,000, and the default is 10,000.

- **order** (query, string): Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.files.list()
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
for await (const fileObject of client.files.list()) {
  console.log(fileObject);
}
```

---

## Upload file

**Method:** `POST`

**Endpoint:** `/files`

### Description

Upload a file that can be used across various endpoints. Individual files can be up to 512 MB, and the size of all files uploaded by one organization can be up to 1 TB.

The Assistants API supports files up to 2 million tokens and of specific file types. See the [Assistants Tools guide](https://platform.openai.com/docs/assistants/tools) for details.

The Fine-tuning API only supports `.jsonl` files. The input also has certain required formats for fine-tuning [chat](https://platform.openai.com/docs/api-reference/fine-tuning/chat-input) or [completions](https://platform.openai.com/docs/api-reference/fine-tuning/completions-input) models.

The Batch API only supports `.jsonl` files up to 200 MB in size. The input also has a specific required [format](https://platform.openai.com/docs/api-reference/batch/request-input).

Please [contact us](https://help.openai.com/) if you need to increase these storage limits.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="fine-tune" \
  -F file="@mydata.jsonl"
  -F expires_after[anchor]="created_at"
  -F expires_after[seconds]=2592000

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
file_object = client.files.create(
    file=b"raw file contents",
    purpose="assistants",
)
print(file_object.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const fileObject = await client.files.create({
  file: fs.createReadStream('fine-tune.jsonl'),
  purpose: 'assistants',
});

console.log(fileObject.id);
```

---

## Delete file

**Method:** `DELETE`

**Endpoint:** `/files/{file_id}`

### Description

Delete a file and remove it from all vector stores.

### Parameters

- **file_id** (path, string) (required): The ID of the file to use for this request.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/files/file-abc123 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
file_deleted = client.files.delete(
    "file_id",
)
print(file_deleted.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const fileDeleted = await client.files.delete('file_id');

console.log(fileDeleted.id);
```

---

## Retrieve file

**Method:** `GET`

**Endpoint:** `/files/{file_id}`

### Description

Returns information about a specific file.

### Parameters

- **file_id** (path, string) (required): The ID of the file to use for this request.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/files/file-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
file_object = client.files.retrieve(
    "file_id",
)
print(file_object.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const fileObject = await client.files.retrieve('file_id');

console.log(fileObject.id);
```

---

## Retrieve file content

**Method:** `GET`

**Endpoint:** `/files/{file_id}/content`

### Description

Returns the contents of the specified file.

### Parameters

- **file_id** (path, string) (required): The ID of the file to use for this request.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/files/file-abc123/content \
  -H "Authorization: Bearer $OPENAI_API_KEY" > file.jsonl

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
response = client.files.content(
    "file_id",
)
print(response)
content = response.read()
print(content)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const response = await client.files.content('file_id');

console.log(response);

const content = await response.blob();
console.log(content);
```

---

