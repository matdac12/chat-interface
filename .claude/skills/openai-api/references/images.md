# Images

## Table of Contents

- [Create image edit](#create-image-edit)
- [Create image](#create-image)
- [Create image variation](#create-image-variation)

---

## Create image edit

**Method:** `POST`

**Endpoint:** `/images/edits`

### Description

Creates an edited or extended image given one or more source images and a prompt. This endpoint only supports `gpt-image-1` and `dall-e-2`.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl -s -D >(grep -i x-request-id >&2) \
  -o >(jq -r '.data[0].b64_json' | base64 --decode > gift-basket.png) \
  -X POST "https://api.openai.com/v1/images/edits" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "model=gpt-image-1" \
  -F "image[]=@body-lotion.png" \
  -F "image[]=@bath-bomb.png" \
  -F "image[]=@incense-kit.png" \
  -F "image[]=@soap.png" \
  -F 'prompt=Create a lovely gift basket with these four items in it'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
images_response = client.images.edit(
    image=b"raw file contents",
    prompt="A cute baby sea otter wearing a beret",
)
print(images_response)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const imagesResponse = await client.images.edit({
  image: fs.createReadStream('path/to/file'),
  prompt: 'A cute baby sea otter wearing a beret',
});

console.log(imagesResponse);
```

---

## Create image

**Method:** `POST`

**Endpoint:** `/images/generations`

### Description

Creates an image given a prompt. [Learn more](https://platform.openai.com/docs/guides/images).


### Request Body

Reference: `CreateImageRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-image-1",
    "prompt": "A cute baby sea otter",
    "n": 1,
    "size": "1024x1024"
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
images_response = client.images.generate(
    prompt="A cute baby sea otter",
)
print(images_response)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const imagesResponse = await client.images.generate({ prompt: 'A cute baby sea otter' });

console.log(imagesResponse);
```

---

## Create image variation

**Method:** `POST`

**Endpoint:** `/images/variations`

### Description

Creates a variation of a given image. This endpoint only supports `dall-e-2`.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/images/variations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F image="@otter.png" \
  -F n=2 \
  -F size="1024x1024"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
images_response = client.images.create_variation(
    image=b"raw file contents",
)
print(images_response.created)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const imagesResponse = await client.images.createVariation({ image: fs.createReadStream('otter.png') });

console.log(imagesResponse.created);
```

---

