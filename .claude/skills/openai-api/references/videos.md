# Videos

## Table of Contents

- [Create video](#create-video)
- [List videos](#list-videos)
- [Retrieve video](#retrieve-video)
- [Delete video](#delete-video)
- [Retrieve video content](#retrieve-video-content)
- [Remix video](#remix-video)

---

## Create video

**Method:** `POST`

**Endpoint:** `/videos`

### Description

Create a video

### Request Body

Reference: `CreateVideoBody`

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/videos \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "model=sora-2" \
  -F "prompt=A calico cat playing a piano on stage"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
video = client.videos.create(
    prompt="x",
)
print(video.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const video = await client.videos.create({ prompt: 'x' });

console.log(video.id);
```

---

## List videos

**Method:** `GET`

**Endpoint:** `/videos`

### Description

List videos

### Parameters

- **limit** (query, integer): Number of items to retrieve
- **order** (query, ): Sort order of results by timestamp. Use `asc` for ascending order or `desc` for descending order.
- **after** (query, string): Identifier for the last item from the previous pagination request

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/videos \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.videos.list()
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
for await (const video of client.videos.list()) {
  console.log(video.id);
}
```

---

## Retrieve video

**Method:** `GET`

**Endpoint:** `/videos/{video_id}`

### Description

Retrieve a video

### Parameters

- **video_id** (path, string) (required): The identifier of the video to retrieve.

### Responses

- **200**: Success

### Code Examples

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
video = client.videos.retrieve(
    "video_123",
)
print(video.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const video = await client.videos.retrieve('video_123');

console.log(video.id);
```

---

## Delete video

**Method:** `DELETE`

**Endpoint:** `/videos/{video_id}`

### Description

Delete a video

### Parameters

- **video_id** (path, string) (required): The identifier of the video to delete.

### Responses

- **200**: Success

### Code Examples

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
video = client.videos.delete(
    "video_123",
)
print(video.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const video = await client.videos.delete('video_123');

console.log(video.id);
```

---

## Retrieve video content

**Method:** `GET`

**Endpoint:** `/videos/{video_id}/content`

### Description

Download video content

### Parameters

- **video_id** (path, string) (required): The identifier of the video whose media to download.
- **variant** (query, ): Which downloadable asset to return. Defaults to the MP4 video.

### Responses

- **200**: The video bytes or preview asset that matches the requested variant.

### Code Examples

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
response = client.videos.download_content(
    video_id="video_123",
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

const response = await client.videos.downloadContent('video_123');

console.log(response);

const content = await response.blob();
console.log(content);
```

---

## Remix video

**Method:** `POST`

**Endpoint:** `/videos/{video_id}/remix`

### Description

Create a video remix

### Parameters

- **video_id** (path, string) (required): The identifier of the completed video to remix.

### Request Body

Reference: `CreateVideoRemixBody`

### Responses

- **200**: Success

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/videos/video_123/remix \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Extend the scene with the cat taking a bow to the cheering audience"
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
video = client.videos.remix(
    video_id="video_123",
    prompt="x",
)
print(video.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const video = await client.videos.remix('video_123', { prompt: 'x' });

console.log(video.id);
```

---

