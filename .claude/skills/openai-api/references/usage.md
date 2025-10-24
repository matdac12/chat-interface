# Usage

## Table of Contents

- [Costs](#costs)
- [Audio speeches](#audio-speeches)
- [Audio transcriptions](#audio-transcriptions)
- [Code interpreter sessions](#code-interpreter-sessions)
- [Completions](#completions)
- [Embeddings](#embeddings)
- [Images](#images)
- [Moderations](#moderations)
- [Vector stores](#vector-stores)

---

## Costs

**Method:** `GET`

**Endpoint:** `/organization/costs`

### Description

Get costs details for the organization.

### Parameters

- **start_time** (query, integer) (required): Start time (Unix seconds) of the query time range, inclusive.
- **end_time** (query, integer): End time (Unix seconds) of the query time range, exclusive.
- **bucket_width** (query, string): Width of each time bucket in response. Currently only `1d` is supported, default to `1d`.
- **project_ids** (query, array): Return only costs for these projects.
- **group_by** (query, array): Group the costs by the specified fields. Support fields include `project_id`, `line_item` and any combination of them.
- **limit** (query, integer): A limit on the number of buckets to be returned. Limit can range between 1 and 180, and the default is 7.

- **page** (query, string): A cursor for use in pagination. Corresponding to the `next_page` field from the previous response.

### Responses

- **200**: Costs data retrieved successfully.

### Code Examples

**Curl:**

```curl
curl "https://api.openai.com/v1/organization/costs?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"

```

---

## Audio speeches

**Method:** `GET`

**Endpoint:** `/organization/usage/audio_speeches`

### Description

Get audio speeches usage details for the organization.

### Parameters

- **start_time** (query, integer) (required): Start time (Unix seconds) of the query time range, inclusive.
- **end_time** (query, integer): End time (Unix seconds) of the query time range, exclusive.
- **bucket_width** (query, string): Width of each time bucket in response. Currently `1m`, `1h` and `1d` are supported, default to `1d`.
- **project_ids** (query, array): Return only usage for these projects.
- **user_ids** (query, array): Return only usage for these users.
- **api_key_ids** (query, array): Return only usage for these API keys.
- **models** (query, array): Return only usage for these models.
- **group_by** (query, array): Group the usage data by the specified fields. Support fields include `project_id`, `user_id`, `api_key_id`, `model` or any combination of them.
- **limit** (query, integer): Specifies the number of buckets to return.
- `bucket_width=1d`: default: 7, max: 31
- `bucket_width=1h`: default: 24, max: 168
- `bucket_width=1m`: default: 60, max: 1440

- **page** (query, string): A cursor for use in pagination. Corresponding to the `next_page` field from the previous response.

### Responses

- **200**: Usage data retrieved successfully.

### Code Examples

**Curl:**

```curl
curl "https://api.openai.com/v1/organization/usage/audio_speeches?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"

```

---

## Audio transcriptions

**Method:** `GET`

**Endpoint:** `/organization/usage/audio_transcriptions`

### Description

Get audio transcriptions usage details for the organization.

### Parameters

- **start_time** (query, integer) (required): Start time (Unix seconds) of the query time range, inclusive.
- **end_time** (query, integer): End time (Unix seconds) of the query time range, exclusive.
- **bucket_width** (query, string): Width of each time bucket in response. Currently `1m`, `1h` and `1d` are supported, default to `1d`.
- **project_ids** (query, array): Return only usage for these projects.
- **user_ids** (query, array): Return only usage for these users.
- **api_key_ids** (query, array): Return only usage for these API keys.
- **models** (query, array): Return only usage for these models.
- **group_by** (query, array): Group the usage data by the specified fields. Support fields include `project_id`, `user_id`, `api_key_id`, `model` or any combination of them.
- **limit** (query, integer): Specifies the number of buckets to return.
- `bucket_width=1d`: default: 7, max: 31
- `bucket_width=1h`: default: 24, max: 168
- `bucket_width=1m`: default: 60, max: 1440

- **page** (query, string): A cursor for use in pagination. Corresponding to the `next_page` field from the previous response.

### Responses

- **200**: Usage data retrieved successfully.

### Code Examples

**Curl:**

```curl
curl "https://api.openai.com/v1/organization/usage/audio_transcriptions?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"

```

---

## Code interpreter sessions

**Method:** `GET`

**Endpoint:** `/organization/usage/code_interpreter_sessions`

### Description

Get code interpreter sessions usage details for the organization.

### Parameters

- **start_time** (query, integer) (required): Start time (Unix seconds) of the query time range, inclusive.
- **end_time** (query, integer): End time (Unix seconds) of the query time range, exclusive.
- **bucket_width** (query, string): Width of each time bucket in response. Currently `1m`, `1h` and `1d` are supported, default to `1d`.
- **project_ids** (query, array): Return only usage for these projects.
- **group_by** (query, array): Group the usage data by the specified fields. Support fields include `project_id`.
- **limit** (query, integer): Specifies the number of buckets to return.
- `bucket_width=1d`: default: 7, max: 31
- `bucket_width=1h`: default: 24, max: 168
- `bucket_width=1m`: default: 60, max: 1440

- **page** (query, string): A cursor for use in pagination. Corresponding to the `next_page` field from the previous response.

### Responses

- **200**: Usage data retrieved successfully.

### Code Examples

**Curl:**

```curl
curl "https://api.openai.com/v1/organization/usage/code_interpreter_sessions?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"

```

---

## Completions

**Method:** `GET`

**Endpoint:** `/organization/usage/completions`

### Description

Get completions usage details for the organization.

### Parameters

- **start_time** (query, integer) (required): Start time (Unix seconds) of the query time range, inclusive.
- **end_time** (query, integer): End time (Unix seconds) of the query time range, exclusive.
- **bucket_width** (query, string): Width of each time bucket in response. Currently `1m`, `1h` and `1d` are supported, default to `1d`.
- **project_ids** (query, array): Return only usage for these projects.
- **user_ids** (query, array): Return only usage for these users.
- **api_key_ids** (query, array): Return only usage for these API keys.
- **models** (query, array): Return only usage for these models.
- **batch** (query, boolean): If `true`, return batch jobs only. If `false`, return non-batch jobs only. By default, return both.

- **group_by** (query, array): Group the usage data by the specified fields. Support fields include `project_id`, `user_id`, `api_key_id`, `model`, `batch`, `service_tier` or any combination of them.
- **limit** (query, integer): Specifies the number of buckets to return.
- `bucket_width=1d`: default: 7, max: 31
- `bucket_width=1h`: default: 24, max: 168
- `bucket_width=1m`: default: 60, max: 1440

- **page** (query, string): A cursor for use in pagination. Corresponding to the `next_page` field from the previous response.

### Responses

- **200**: Usage data retrieved successfully.

### Code Examples

**Curl:**

```curl
curl "https://api.openai.com/v1/organization/usage/completions?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"

```

---

## Embeddings

**Method:** `GET`

**Endpoint:** `/organization/usage/embeddings`

### Description

Get embeddings usage details for the organization.

### Parameters

- **start_time** (query, integer) (required): Start time (Unix seconds) of the query time range, inclusive.
- **end_time** (query, integer): End time (Unix seconds) of the query time range, exclusive.
- **bucket_width** (query, string): Width of each time bucket in response. Currently `1m`, `1h` and `1d` are supported, default to `1d`.
- **project_ids** (query, array): Return only usage for these projects.
- **user_ids** (query, array): Return only usage for these users.
- **api_key_ids** (query, array): Return only usage for these API keys.
- **models** (query, array): Return only usage for these models.
- **group_by** (query, array): Group the usage data by the specified fields. Support fields include `project_id`, `user_id`, `api_key_id`, `model` or any combination of them.
- **limit** (query, integer): Specifies the number of buckets to return.
- `bucket_width=1d`: default: 7, max: 31
- `bucket_width=1h`: default: 24, max: 168
- `bucket_width=1m`: default: 60, max: 1440

- **page** (query, string): A cursor for use in pagination. Corresponding to the `next_page` field from the previous response.

### Responses

- **200**: Usage data retrieved successfully.

### Code Examples

**Curl:**

```curl
curl "https://api.openai.com/v1/organization/usage/embeddings?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"

```

---

## Images

**Method:** `GET`

**Endpoint:** `/organization/usage/images`

### Description

Get images usage details for the organization.

### Parameters

- **start_time** (query, integer) (required): Start time (Unix seconds) of the query time range, inclusive.
- **end_time** (query, integer): End time (Unix seconds) of the query time range, exclusive.
- **bucket_width** (query, string): Width of each time bucket in response. Currently `1m`, `1h` and `1d` are supported, default to `1d`.
- **sources** (query, array): Return only usages for these sources. Possible values are `image.generation`, `image.edit`, `image.variation` or any combination of them.
- **sizes** (query, array): Return only usages for these image sizes. Possible values are `256x256`, `512x512`, `1024x1024`, `1792x1792`, `1024x1792` or any combination of them.
- **project_ids** (query, array): Return only usage for these projects.
- **user_ids** (query, array): Return only usage for these users.
- **api_key_ids** (query, array): Return only usage for these API keys.
- **models** (query, array): Return only usage for these models.
- **group_by** (query, array): Group the usage data by the specified fields. Support fields include `project_id`, `user_id`, `api_key_id`, `model`, `size`, `source` or any combination of them.
- **limit** (query, integer): Specifies the number of buckets to return.
- `bucket_width=1d`: default: 7, max: 31
- `bucket_width=1h`: default: 24, max: 168
- `bucket_width=1m`: default: 60, max: 1440

- **page** (query, string): A cursor for use in pagination. Corresponding to the `next_page` field from the previous response.

### Responses

- **200**: Usage data retrieved successfully.

### Code Examples

**Curl:**

```curl
curl "https://api.openai.com/v1/organization/usage/images?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"

```

---

## Moderations

**Method:** `GET`

**Endpoint:** `/organization/usage/moderations`

### Description

Get moderations usage details for the organization.

### Parameters

- **start_time** (query, integer) (required): Start time (Unix seconds) of the query time range, inclusive.
- **end_time** (query, integer): End time (Unix seconds) of the query time range, exclusive.
- **bucket_width** (query, string): Width of each time bucket in response. Currently `1m`, `1h` and `1d` are supported, default to `1d`.
- **project_ids** (query, array): Return only usage for these projects.
- **user_ids** (query, array): Return only usage for these users.
- **api_key_ids** (query, array): Return only usage for these API keys.
- **models** (query, array): Return only usage for these models.
- **group_by** (query, array): Group the usage data by the specified fields. Support fields include `project_id`, `user_id`, `api_key_id`, `model` or any combination of them.
- **limit** (query, integer): Specifies the number of buckets to return.
- `bucket_width=1d`: default: 7, max: 31
- `bucket_width=1h`: default: 24, max: 168
- `bucket_width=1m`: default: 60, max: 1440

- **page** (query, string): A cursor for use in pagination. Corresponding to the `next_page` field from the previous response.

### Responses

- **200**: Usage data retrieved successfully.

### Code Examples

**Curl:**

```curl
curl "https://api.openai.com/v1/organization/usage/moderations?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"

```

---

## Vector stores

**Method:** `GET`

**Endpoint:** `/organization/usage/vector_stores`

### Description

Get vector stores usage details for the organization.

### Parameters

- **start_time** (query, integer) (required): Start time (Unix seconds) of the query time range, inclusive.
- **end_time** (query, integer): End time (Unix seconds) of the query time range, exclusive.
- **bucket_width** (query, string): Width of each time bucket in response. Currently `1m`, `1h` and `1d` are supported, default to `1d`.
- **project_ids** (query, array): Return only usage for these projects.
- **group_by** (query, array): Group the usage data by the specified fields. Support fields include `project_id`.
- **limit** (query, integer): Specifies the number of buckets to return.
- `bucket_width=1d`: default: 7, max: 31
- `bucket_width=1h`: default: 24, max: 168
- `bucket_width=1m`: default: 60, max: 1440

- **page** (query, string): A cursor for use in pagination. Corresponding to the `next_page` field from the previous response.

### Responses

- **200**: Usage data retrieved successfully.

### Code Examples

**Curl:**

```curl
curl "https://api.openai.com/v1/organization/usage/vector_stores?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"

```

---

