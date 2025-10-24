# Uploads

## Table of Contents

- [Create upload](#create-upload)
- [Cancel upload](#cancel-upload)
- [Complete upload](#complete-upload)
- [Add upload part](#add-upload-part)

---

## Create upload

**Method:** `POST`

**Endpoint:** `/uploads`

### Description

Creates an intermediate [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object
that you can add [Parts](https://platform.openai.com/docs/api-reference/uploads/part-object) to.
Currently, an Upload can accept at most 8 GB in total and expires after an
hour after you create it.

Once you complete the Upload, we will create a
[File](https://platform.openai.com/docs/api-reference/files/object) object that contains all the parts
you uploaded. This File is usable in the rest of our platform as a regular
File object.

For certain `purpose` values, the correct `mime_type` must be specified. 
Please refer to documentation for the 
[supported MIME types for your use case](https://platform.openai.com/docs/assistants/tools/file-search#supported-files).

For guidance on the proper filename extensions for each purpose, please
follow the documentation on [creating a
File](https://platform.openai.com/docs/api-reference/files/create).


### Request Body

Reference: `CreateUploadRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/uploads \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "purpose": "fine-tune",
    "filename": "training_examples.jsonl",
    "bytes": 2147483648,
    "mime_type": "text/jsonl",
    "expires_after": {
      "anchor": "created_at",
      "seconds": 3600
    }
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
upload = client.uploads.create(
    bytes=0,
    filename="filename",
    mime_type="mime_type",
    purpose="assistants",
)
print(upload.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const upload = await client.uploads.create({
  bytes: 0,
  filename: 'filename',
  mime_type: 'mime_type',
  purpose: 'assistants',
});

console.log(upload.id);
```

---

## Cancel upload

**Method:** `POST`

**Endpoint:** `/uploads/{upload_id}/cancel`

### Description

Cancels the Upload. No Parts may be added after an Upload is cancelled.


### Parameters

- **upload_id** (path, string) (required): The ID of the Upload.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/uploads/upload_abc123/cancel

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
upload = client.uploads.cancel(
    "upload_abc123",
)
print(upload.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const upload = await client.uploads.cancel('upload_abc123');

console.log(upload.id);
```

---

## Complete upload

**Method:** `POST`

**Endpoint:** `/uploads/{upload_id}/complete`

### Description

Completes the [Upload](https://platform.openai.com/docs/api-reference/uploads/object). 

Within the returned Upload object, there is a nested [File](https://platform.openai.com/docs/api-reference/files/object) object that is ready to use in the rest of the platform.

You can specify the order of the Parts by passing in an ordered list of the Part IDs.

The number of bytes uploaded upon completion must match the number of bytes initially specified when creating the Upload object. No Parts may be added after an Upload is completed.


### Parameters

- **upload_id** (path, string) (required): The ID of the Upload.


### Request Body

Reference: `CompleteUploadRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/uploads/upload_abc123/complete
  -d '{
    "part_ids": ["part_def456", "part_ghi789"]
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
upload = client.uploads.complete(
    upload_id="upload_abc123",
    part_ids=["string"],
)
print(upload.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const upload = await client.uploads.complete('upload_abc123', { part_ids: ['string'] });

console.log(upload.id);
```

---

## Add upload part

**Method:** `POST`

**Endpoint:** `/uploads/{upload_id}/parts`

### Description

Adds a [Part](https://platform.openai.com/docs/api-reference/uploads/part-object) to an [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object. A Part represents a chunk of bytes from the file you are trying to upload. 

Each Part can be at most 64 MB, and you can add Parts until you hit the Upload maximum of 8 GB.

It is possible to add multiple Parts in parallel. You can decide the intended order of the Parts when you [complete the Upload](https://platform.openai.com/docs/api-reference/uploads/complete).


### Parameters

- **upload_id** (path, string) (required): The ID of the Upload.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/uploads/upload_abc123/parts
  -F data="aHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MS91cGxvYWRz..."

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
upload_part = client.uploads.parts.create(
    upload_id="upload_abc123",
    data=b"raw file contents",
)
print(upload_part.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const uploadPart = await client.uploads.parts.create('upload_abc123', {
  data: fs.createReadStream('path/to/file'),
});

console.log(uploadPart.id);
```

---

