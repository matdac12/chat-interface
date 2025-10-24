# Fine-tuning

## Table of Contents

- [Run grader](#run-grader)
- [Validate grader](#validate-grader)
- [List checkpoint permissions](#list-checkpoint-permissions)
- [Create checkpoint permissions](#create-checkpoint-permissions)
- [Delete checkpoint permission](#delete-checkpoint-permission)
- [Create fine-tuning job](#create-fine-tuning-job)
- [List fine-tuning jobs](#list-fine-tuning-jobs)
- [Retrieve fine-tuning job](#retrieve-fine-tuning-job)
- [Cancel fine-tuning](#cancel-fine-tuning)
- [List fine-tuning checkpoints](#list-fine-tuning-checkpoints)
- [List fine-tuning events](#list-fine-tuning-events)
- [Pause fine-tuning](#pause-fine-tuning)
- [Resume fine-tuning](#resume-fine-tuning)

---

## Run grader

**Method:** `POST`

**Endpoint:** `/fine_tuning/alpha/graders/run`

### Description

Run a grader.


### Request Body

Reference: `RunGraderRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/fine_tuning/alpha/graders/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "grader": {
      "type": "score_model",
      "name": "Example score model grader",
      "input": [
        {
          "role": "user",
          "content": "Score how close the reference answer is to the model
answer. Score 1.0 if they are the same and 0.0 if they are different. Return just a floating point score\n\nReference answer: {{item.reference_answer}}\n\nModel answer: {{sample.output_text}}"
        }
      ],
      "model": "gpt-4o-2024-08-06",
      "sampling_params": {
        "temperature": 1,
        "top_p": 1,
        "seed": 42
      }
    },
    "item": {
      "reference_answer": "fuzzy wuzzy was a bear"
    },
    "model_sample": "fuzzy wuzzy was a bear"
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
response = client.fine_tuning.alpha.graders.run(
    grader={
        "input": "input",
        "name": "name",
        "operation": "eq",
        "reference": "reference",
        "type": "string_check",
    },
    model_sample="model_sample",
)
print(response.metadata)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const response = await client.fineTuning.alpha.graders.run({
  grader: { input: 'input', name: 'name', operation: 'eq', reference: 'reference', type: 'string_check' },
  model_sample: 'model_sample',
});

console.log(response.metadata);
```

---

## Validate grader

**Method:** `POST`

**Endpoint:** `/fine_tuning/alpha/graders/validate`

### Description

Validate a grader.


### Request Body

Reference: `ValidateGraderRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/fine_tuning/alpha/graders/validate \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "grader": {
      "type": "string_check",
      "name": "Example string check grader",
      "input": "{{sample.output_text}}",
      "reference": "{{item.label}}",
      "operation": "eq"
    }
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
response = client.fine_tuning.alpha.graders.validate(
    grader={
        "input": "input",
        "name": "name",
        "operation": "eq",
        "reference": "reference",
        "type": "string_check",
    },
)
print(response.grader)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const response = await client.fineTuning.alpha.graders.validate({
  grader: { input: 'input', name: 'name', operation: 'eq', reference: 'reference', type: 'string_check' },
});

console.log(response.grader);
```

---

## List checkpoint permissions

**Method:** `GET`

**Endpoint:** `/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions`

### Description

**NOTE:** This endpoint requires an [admin API key](../admin-api-keys).

Organization owners can use this endpoint to view all permissions for a fine-tuned model checkpoint.


### Parameters

- **fine_tuned_model_checkpoint** (path, string) (required): The ID of the fine-tuned model checkpoint to get permissions for.

- **project_id** (query, string): The ID of the project to get permissions for.
- **after** (query, string): Identifier for the last permission ID from the previous pagination request.
- **limit** (query, integer): Number of permissions to retrieve.
- **order** (query, string): The order in which to retrieve permissions.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/fine_tuning/checkpoints/ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd/permissions \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
permission = client.fine_tuning.checkpoints.permissions.retrieve(
    fine_tuned_model_checkpoint="ft-AF1WoRqd3aJAHsqc9NY7iL8F",
)
print(permission.first_id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const permission = await client.fineTuning.checkpoints.permissions.retrieve('ft-AF1WoRqd3aJAHsqc9NY7iL8F');

console.log(permission.first_id);
```

---

## Create checkpoint permissions

**Method:** `POST`

**Endpoint:** `/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions`

### Description

**NOTE:** Calling this endpoint requires an [admin API key](../admin-api-keys).

This enables organization owners to share fine-tuned models with other projects in their organization.


### Parameters

- **fine_tuned_model_checkpoint** (path, string) (required): The ID of the fine-tuned model checkpoint to create a permission for.


### Request Body

Reference: `CreateFineTuningCheckpointPermissionRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/fine_tuning/checkpoints/ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd/permissions \
  -H "Authorization: Bearer $OPENAI_API_KEY"
  -d '{"project_ids": ["proj_abGMw1llN8IrBb6SvvY5A1iH"]}'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.fine_tuning.checkpoints.permissions.create(
    fine_tuned_model_checkpoint="ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd",
    project_ids=["string"],
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
for await (const permissionCreateResponse of client.fineTuning.checkpoints.permissions.create(
  'ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd',
  { project_ids: ['string'] },
)) {
  console.log(permissionCreateResponse.id);
}
```

---

## Delete checkpoint permission

**Method:** `DELETE`

**Endpoint:** `/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions/{permission_id}`

### Description

**NOTE:** This endpoint requires an [admin API key](../admin-api-keys).

Organization owners can use this endpoint to delete a permission for a fine-tuned model checkpoint.


### Parameters

- **fine_tuned_model_checkpoint** (path, string) (required): The ID of the fine-tuned model checkpoint to delete a permission for.

- **permission_id** (path, string) (required): The ID of the fine-tuned model checkpoint permission to delete.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/fine_tuning/checkpoints/ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd/permissions/cp_zc4Q7MP6XxulcVzj4MZdwsAB \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
permission = client.fine_tuning.checkpoints.permissions.delete(
    permission_id="cp_zc4Q7MP6XxulcVzj4MZdwsAB",
    fine_tuned_model_checkpoint="ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd",
)
print(permission.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const permission = await client.fineTuning.checkpoints.permissions.delete('cp_zc4Q7MP6XxulcVzj4MZdwsAB', {
  fine_tuned_model_checkpoint: 'ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd',
});

console.log(permission.id);
```

---

## Create fine-tuning job

**Method:** `POST`

**Endpoint:** `/fine_tuning/jobs`

### Description

Creates a fine-tuning job which begins the process of creating a new model from a given dataset.

Response includes details of the enqueued job including job status and the name of the fine-tuned models once complete.

[Learn more about fine-tuning](https://platform.openai.com/docs/guides/model-optimization)


### Request Body

Reference: `CreateFineTuningJobRequest`

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-BK7bzQj3FfZFXr7DbL6xJwfo",
    "model": "gpt-4o-mini"
  }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
fine_tuning_job = client.fine_tuning.jobs.create(
    model="gpt-4o-mini",
    training_file="file-abc123",
)
print(fine_tuning_job.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const fineTuningJob = await client.fineTuning.jobs.create({
  model: 'gpt-4o-mini',
  training_file: 'file-abc123',
});

console.log(fineTuningJob.id);
```

---

## List fine-tuning jobs

**Method:** `GET`

**Endpoint:** `/fine_tuning/jobs`

### Description

List your organization's fine-tuning jobs


### Parameters

- **after** (query, string): Identifier for the last job from the previous pagination request.
- **limit** (query, integer): Number of fine-tuning jobs to retrieve.
- **metadata** (query, object): Optional metadata filter. To filter, use the syntax `metadata[k]=v`. Alternatively, set `metadata=null` to indicate no metadata.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/fine_tuning/jobs?limit=2&metadata[key]=value \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.fine_tuning.jobs.list()
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
for await (const fineTuningJob of client.fineTuning.jobs.list()) {
  console.log(fineTuningJob.id);
}
```

---

## Retrieve fine-tuning job

**Method:** `GET`

**Endpoint:** `/fine_tuning/jobs/{fine_tuning_job_id}`

### Description

Get info about a fine-tuning job.

[Learn more about fine-tuning](https://platform.openai.com/docs/guides/model-optimization)


### Parameters

- **fine_tuning_job_id** (path, string) (required): The ID of the fine-tuning job.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/fine_tuning/jobs/ft-AF1WoRqd3aJAHsqc9NY7iL8F \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
fine_tuning_job = client.fine_tuning.jobs.retrieve(
    "ft-AF1WoRqd3aJAHsqc9NY7iL8F",
)
print(fine_tuning_job.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const fineTuningJob = await client.fineTuning.jobs.retrieve('ft-AF1WoRqd3aJAHsqc9NY7iL8F');

console.log(fineTuningJob.id);
```

---

## Cancel fine-tuning

**Method:** `POST`

**Endpoint:** `/fine_tuning/jobs/{fine_tuning_job_id}/cancel`

### Description

Immediately cancel a fine-tune job.


### Parameters

- **fine_tuning_job_id** (path, string) (required): The ID of the fine-tuning job to cancel.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
fine_tuning_job = client.fine_tuning.jobs.cancel(
    "ft-AF1WoRqd3aJAHsqc9NY7iL8F",
)
print(fine_tuning_job.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const fineTuningJob = await client.fineTuning.jobs.cancel('ft-AF1WoRqd3aJAHsqc9NY7iL8F');

console.log(fineTuningJob.id);
```

---

## List fine-tuning checkpoints

**Method:** `GET`

**Endpoint:** `/fine_tuning/jobs/{fine_tuning_job_id}/checkpoints`

### Description

List checkpoints for a fine-tuning job.


### Parameters

- **fine_tuning_job_id** (path, string) (required): The ID of the fine-tuning job to get checkpoints for.

- **after** (query, string): Identifier for the last checkpoint ID from the previous pagination request.
- **limit** (query, integer): Number of checkpoints to retrieve.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/checkpoints \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.fine_tuning.jobs.checkpoints.list(
    fine_tuning_job_id="ft-AF1WoRqd3aJAHsqc9NY7iL8F",
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
for await (const fineTuningJobCheckpoint of client.fineTuning.jobs.checkpoints.list(
  'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
)) {
  console.log(fineTuningJobCheckpoint.id);
}
```

---

## List fine-tuning events

**Method:** `GET`

**Endpoint:** `/fine_tuning/jobs/{fine_tuning_job_id}/events`

### Description

Get status updates for a fine-tuning job.


### Parameters

- **fine_tuning_job_id** (path, string) (required): The ID of the fine-tuning job to get events for.

- **after** (query, string): Identifier for the last event from the previous pagination request.
- **limit** (query, integer): Number of events to retrieve.

### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/events \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.fine_tuning.jobs.list_events(
    fine_tuning_job_id="ft-AF1WoRqd3aJAHsqc9NY7iL8F",
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
for await (const fineTuningJobEvent of client.fineTuning.jobs.listEvents('ft-AF1WoRqd3aJAHsqc9NY7iL8F')) {
  console.log(fineTuningJobEvent.id);
}
```

---

## Pause fine-tuning

**Method:** `POST`

**Endpoint:** `/fine_tuning/jobs/{fine_tuning_job_id}/pause`

### Description

Pause a fine-tune job.


### Parameters

- **fine_tuning_job_id** (path, string) (required): The ID of the fine-tuning job to pause.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/pause \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
fine_tuning_job = client.fine_tuning.jobs.pause(
    "ft-AF1WoRqd3aJAHsqc9NY7iL8F",
)
print(fine_tuning_job.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const fineTuningJob = await client.fineTuning.jobs.pause('ft-AF1WoRqd3aJAHsqc9NY7iL8F');

console.log(fineTuningJob.id);
```

---

## Resume fine-tuning

**Method:** `POST`

**Endpoint:** `/fine_tuning/jobs/{fine_tuning_job_id}/resume`

### Description

Resume a fine-tune job.


### Parameters

- **fine_tuning_job_id** (path, string) (required): The ID of the fine-tuning job to resume.


### Responses

- **200**: OK

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/resume \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
fine_tuning_job = client.fine_tuning.jobs.resume(
    "ft-AF1WoRqd3aJAHsqc9NY7iL8F",
)
print(fine_tuning_job.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const fineTuningJob = await client.fineTuning.jobs.resume('ft-AF1WoRqd3aJAHsqc9NY7iL8F');

console.log(fineTuningJob.id);
```

---

