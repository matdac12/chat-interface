# Audio

## Table of Contents

- [Create speech](#create-speech)
- [Create transcription](#create-transcription)
- [Create translation](#create-translation)

---

## Create speech

**Method:** `POST`

**Endpoint:** `/audio/speech`

### Description

Generates audio from the input text.

### Request Body

Reference: `CreateSpeechRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini-tts",
    "input": "The quick brown fox jumped over the lazy dog.",
    "voice": "alloy"
  }' \
  --output speech.mp3

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
speech = client.audio.speech.create(
    input="input",
    model="string",
    voice="ash",
)
print(speech)
content = speech.read()
print(content)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const speech = await client.audio.speech.create({ input: 'input', model: 'string', voice: 'ash' });

console.log(speech);

const content = await speech.blob();
console.log(content);
```

---

## Create transcription

**Method:** `POST`

**Endpoint:** `/audio/transcriptions`

### Description

Transcribes audio into the input language.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F model="gpt-4o-transcribe"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
transcription = client.audio.transcriptions.create(
    file=b"raw file contents",
    model="gpt-4o-transcribe",
)
print(transcription)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const transcription = await client.audio.transcriptions.create({
  file: fs.createReadStream('speech.mp3'),
  model: 'gpt-4o-transcribe',
});

console.log(transcription);
```

---

## Create translation

**Method:** `POST`

**Endpoint:** `/audio/translations`

### Description

Translates audio into English.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/audio/translations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/german.m4a" \
  -F model="whisper-1"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
translation = client.audio.translations.create(
    file=b"raw file contents",
    model="whisper-1",
)
print(translation)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const translation = await client.audio.translations.create({
  file: fs.createReadStream('speech.mp3'),
  model: 'whisper-1',
});

console.log(translation);
```

---

