# Realtime

## Table of Contents

- [Create call](#create-call)
- [Accept call](#accept-call)
- [Hang up call](#hang-up-call)
- [Refer call](#refer-call)
- [Reject call](#reject-call)
- [Create client secret](#create-client-secret)
- [Create session](#create-session)
- [Create transcription session](#create-transcription-session)

---

## Create call

**Method:** `POST`

**Endpoint:** `/realtime/calls`

### Description

Create a new Realtime API call over WebRTC and receive the SDP answer needed
to complete the peer connection.

### Responses

- **201**: Realtime call created successfully.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/realtime/calls \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "sdp=<offer.sdp;type=application/sdp" \
  -F 'session={"type":"realtime","model":"gpt-realtime"};type=application/json'
```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
call = client.realtime.calls.create(
    sdp="sdp",
)
print(call)
content = call.read()
print(content)
```

---

## Accept call

**Method:** `POST`

**Endpoint:** `/realtime/calls/{call_id}/accept`

### Description

Accept an incoming SIP call and configure the realtime session that will
handle it.

### Parameters

- **call_id** (path, string) (required): The identifier for the call provided in the
[`realtime.call.incoming`](https://platform.openai.com/docs/api-reference/webhook_events/realtime/call/incoming)
webhook.

### Request Body

Reference: `RealtimeSessionCreateRequestGA`

### Responses

- **200**: Call accepted successfully.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/realtime/calls/$CALL_ID/accept \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "type": "realtime",
        "model": "gpt-realtime",
        "instructions": "You are Alex, a friendly concierge for Example Corp.",
      }'
```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
client.realtime.calls.accept(
    call_id="call_id",
    type="realtime",
)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

await client.realtime.calls.accept('call_id', { type: 'realtime' });
```

---

## Hang up call

**Method:** `POST`

**Endpoint:** `/realtime/calls/{call_id}/hangup`

### Description

End an active Realtime API call, whether it was initiated over SIP or
WebRTC.

### Parameters

- **call_id** (path, string) (required): The identifier for the call. For SIP calls, use the value provided in the
[`realtime.call.incoming`](https://platform.openai.com/docs/api-reference/webhook_events/realtime/call/incoming)
webhook. For WebRTC sessions, reuse the call ID returned in the `Location`
header when creating the call with
[`POST /v1/realtime/calls`](https://platform.openai.com/docs/api-reference/realtime/create-call).

### Responses

- **200**: Call hangup initiated successfully.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/realtime/calls/$CALL_ID/hangup \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
client.realtime.calls.hangup(
    "call_id",
)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

await client.realtime.calls.hangup('call_id');
```

---

## Refer call

**Method:** `POST`

**Endpoint:** `/realtime/calls/{call_id}/refer`

### Description

Transfer an active SIP call to a new destination using the SIP REFER verb.

### Parameters

- **call_id** (path, string) (required): The identifier for the call provided in the
[`realtime.call.incoming`](https://platform.openai.com/docs/api-reference/webhook_events/realtime/call/incoming)
webhook.

### Request Body

Reference: `RealtimeCallReferRequest`

### Responses

- **200**: Call referred successfully.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/realtime/calls/$CALL_ID/refer \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"target_uri": "tel:+14155550123"}'
```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
client.realtime.calls.refer(
    call_id="call_id",
    target_uri="tel:+14155550123",
)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

await client.realtime.calls.refer('call_id', { target_uri: 'tel:+14155550123' });
```

---

## Reject call

**Method:** `POST`

**Endpoint:** `/realtime/calls/{call_id}/reject`

### Description

Decline an incoming SIP call by returning a SIP status code to the caller.

### Parameters

- **call_id** (path, string) (required): The identifier for the call provided in the
[`realtime.call.incoming`](https://platform.openai.com/docs/api-reference/webhook_events/realtime/call/incoming)
webhook.

### Request Body

Reference: `RealtimeCallRejectRequest`

### Responses

- **200**: Call rejected successfully.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/realtime/calls/$CALL_ID/reject \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status_code": 486}'
```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
client.realtime.calls.reject(
    call_id="call_id",
)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

await client.realtime.calls.reject('call_id');
```

---

## Create client secret

**Method:** `POST`

**Endpoint:** `/realtime/client_secrets`

### Description

Create a Realtime client secret with an associated session configuration.


### Request Body

Reference: `RealtimeCreateClientSecretRequest`

### Responses

- **200**: Client secret created successfully.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/realtime/client_secrets \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "expires_after": {
      "anchor": "created_at",
      "seconds": 600
    },
    "session": {
      "type": "realtime",
      "model": "gpt-realtime",
      "instructions": "You are a friendly assistant."
    }
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
client_secret = client.realtime.client_secrets.create()
print(client_secret.expires_at)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const clientSecret = await client.realtime.clientSecrets.create();

console.log(clientSecret.expires_at);
```

---

## Create session

**Method:** `POST`

**Endpoint:** `/realtime/sessions`

### Description

Create an ephemeral API token for use in client-side applications with the
Realtime API. Can be configured with the same session parameters as the
`session.update` client event.

It responds with a session object, plus a `client_secret` key which contains
a usable ephemeral API token that can be used to authenticate browser clients
for the Realtime API.


### Request Body

Reference: `RealtimeSessionCreateRequest`

### Responses

- **200**: Session created successfully.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/realtime/sessions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-realtime",
    "modalities": ["audio", "text"],
    "instructions": "You are a friendly assistant."
  }'

```

---

## Create transcription session

**Method:** `POST`

**Endpoint:** `/realtime/transcription_sessions`

### Description

Create an ephemeral API token for use in client-side applications with the
Realtime API specifically for realtime transcriptions. 
Can be configured with the same session parameters as the `transcription_session.update` client event.

It responds with a session object, plus a `client_secret` key which contains
a usable ephemeral API token that can be used to authenticate browser clients
for the Realtime API.


### Request Body

Reference: `RealtimeTranscriptionSessionCreateRequest`

### Responses

- **200**: Session created successfully.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/realtime/transcription_sessions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'

```

---

