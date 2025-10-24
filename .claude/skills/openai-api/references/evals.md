# Evals

## Table of Contents

- [List evals](#list-evals)
- [Create eval](#create-eval)
- [Get an eval](#get-an-eval)
- [Update an eval](#update-an-eval)
- [Delete an eval](#delete-an-eval)
- [Get eval runs](#get-eval-runs)
- [Create eval run](#create-eval-run)
- [Get an eval run](#get-an-eval-run)
- [Cancel eval run](#cancel-eval-run)
- [Delete eval run](#delete-eval-run)
- [Get eval run output items](#get-eval-run-output-items)
- [Get an output item of an eval run](#get-an-output-item-of-an-eval-run)

---

## List evals

**Method:** `GET`

**Endpoint:** `/evals`

### Description

List evaluations for a project.


### Parameters

- **after** (query, string): Identifier for the last eval from the previous pagination request.
- **limit** (query, integer): Number of evals to retrieve.
- **order** (query, string): Sort order for evals by timestamp. Use `asc` for ascending order or `desc` for descending order.
- **order_by** (query, string): Evals can be ordered by creation time or last updated time. Use
`created_at` for creation time or `updated_at` for last updated time.


### Responses

- **200**: A list of evals

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/evals?limit=1 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.evals.list()
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
for await (const evalListResponse of client.evals.list()) {
  console.log(evalListResponse.id);
}
```

---

## Create eval

**Method:** `POST`

**Endpoint:** `/evals`

### Description

Create the structure of an evaluation that can be used to test a model's performance.
An evaluation is a set of testing criteria and the config for a data source, which dictates the schema of the data used in the evaluation. After creating an evaluation, you can run it on different models and model parameters. We support several types of graders and datasources.
For more information, see the [Evals guide](https://platform.openai.com/docs/guides/evals).


### Request Body

Reference: `CreateEvalRequest`

### Responses

- **201**: OK

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/evals \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Sentiment",
        "data_source_config": {
          "type": "stored_completions",
          "metadata": {
              "usecase": "chatbot"
          }
        },
        "testing_criteria": [
          {
            "type": "label_model",
            "model": "o3-mini",
            "input": [
              {
                "role": "developer",
                "content": "Classify the sentiment of the following statement as one of 'positive', 'neutral', or 'negative'"
              },
              {
                "role": "user",
                "content": "Statement: {{item.input}}"
              }
            ],
            "passing_labels": [
              "positive"
            ],
            "labels": [
              "positive",
              "neutral",
              "negative"
            ],
            "name": "Example label grader"
          }
        ]
      }'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
eval = client.evals.create(
    data_source_config={
        "item_schema": {
            "foo": "bar"
        },
        "type": "custom",
    },
    testing_criteria=[{
        "input": [{
            "content": "content",
            "role": "role",
        }],
        "labels": ["string"],
        "model": "model",
        "name": "name",
        "passing_labels": ["string"],
        "type": "label_model",
    }],
)
print(eval.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const _eval = await client.evals.create({
  data_source_config: { item_schema: { foo: 'bar' }, type: 'custom' },
  testing_criteria: [
    {
      input: [{ content: 'content', role: 'role' }],
      labels: ['string'],
      model: 'model',
      name: 'name',
      passing_labels: ['string'],
      type: 'label_model',
    },
  ],
});

console.log(_eval.id);
```

---

## Get an eval

**Method:** `GET`

**Endpoint:** `/evals/{eval_id}`

### Description

Get an evaluation by ID.


### Parameters

- **eval_id** (path, string) (required): The ID of the evaluation to retrieve.

### Responses

- **200**: The evaluation

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/evals/eval_67abd54d9b0081909a86353f6fb9317a \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
eval = client.evals.retrieve(
    "eval_id",
)
print(eval.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const _eval = await client.evals.retrieve('eval_id');

console.log(_eval.id);
```

---

## Update an eval

**Method:** `POST`

**Endpoint:** `/evals/{eval_id}`

### Description

Update certain properties of an evaluation.


### Parameters

- **eval_id** (path, string) (required): The ID of the evaluation to update.

### Responses

- **200**: The updated evaluation

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/evals/eval_67abd54d9b0081909a86353f6fb9317a \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Eval", "metadata": {"description": "Updated description"}}'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
eval = client.evals.update(
    eval_id="eval_id",
)
print(eval.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const _eval = await client.evals.update('eval_id');

console.log(_eval.id);
```

---

## Delete an eval

**Method:** `DELETE`

**Endpoint:** `/evals/{eval_id}`

### Description

Delete an evaluation.


### Parameters

- **eval_id** (path, string) (required): The ID of the evaluation to delete.

### Responses

- **200**: Successfully deleted the evaluation.
- **404**: Evaluation not found.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/evals/eval_abc123 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
eval = client.evals.delete(
    "eval_id",
)
print(eval.eval_id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const _eval = await client.evals.delete('eval_id');

console.log(_eval.eval_id);
```

---

## Get eval runs

**Method:** `GET`

**Endpoint:** `/evals/{eval_id}/runs`

### Description

Get a list of runs for an evaluation.


### Parameters

- **eval_id** (path, string) (required): The ID of the evaluation to retrieve runs for.
- **after** (query, string): Identifier for the last run from the previous pagination request.
- **limit** (query, integer): Number of runs to retrieve.
- **order** (query, string): Sort order for runs by timestamp. Use `asc` for ascending order or `desc` for descending order. Defaults to `asc`.
- **status** (query, string): Filter runs by status. One of `queued` | `in_progress` | `failed` | `completed` | `canceled`.

### Responses

- **200**: A list of runs for the evaluation

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/evals/egroup_67abd54d9b0081909a86353f6fb9317a/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.evals.runs.list(
    eval_id="eval_id",
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
for await (const runListResponse of client.evals.runs.list('eval_id')) {
  console.log(runListResponse.id);
}
```

---

## Create eval run

**Method:** `POST`

**Endpoint:** `/evals/{eval_id}/runs`

### Description

Kicks off a new run for a given evaluation, specifying the data source, and what model configuration to use to test. The datasource will be validated against the schema specified in the config of the evaluation.


### Parameters

- **eval_id** (path, string) (required): The ID of the evaluation to create a run for.

### Request Body

Reference: `CreateEvalRunRequest`

### Responses

- **201**: Successfully created a run for the evaluation
- **400**: Bad request (for example, missing eval object)

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/evals/eval_67e579652b548190aaa83ada4b125f47/runs \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"gpt-4o-mini","data_source":{"type":"completions","input_messages":{"type":"template","template":[{"role":"developer","content":"Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"} , {"role":"user","content":"{{item.input}}"}]} ,"sampling_params":{"temperature":1,"max_completions_tokens":2048,"top_p":1,"seed":42},"model":"gpt-4o-mini","source":{"type":"file_content","content":[{"item":{"input":"Tech Company Launches Advanced Artificial Intelligence Platform","ground_truth":"Technology"}}]}}'

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
run = client.evals.runs.create(
    eval_id="eval_id",
    data_source={
        "source": {
            "content": [{
                "item": {
                    "foo": "bar"
                }
            }],
            "type": "file_content",
        },
        "type": "jsonl",
    },
)
print(run.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const run = await client.evals.runs.create('eval_id', {
  data_source: { source: { content: [{ item: { foo: 'bar' } }], type: 'file_content' }, type: 'jsonl' },
});

console.log(run.id);
```

---

## Get an eval run

**Method:** `GET`

**Endpoint:** `/evals/{eval_id}/runs/{run_id}`

### Description

Get an evaluation run by ID.


### Parameters

- **eval_id** (path, string) (required): The ID of the evaluation to retrieve runs for.
- **run_id** (path, string) (required): The ID of the run to retrieve.

### Responses

- **200**: The evaluation run

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/evals/eval_67abd54d9b0081909a86353f6fb9317a/runs/evalrun_67abd54d60ec8190832b46859da808f7 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
run = client.evals.runs.retrieve(
    run_id="run_id",
    eval_id="eval_id",
)
print(run.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const run = await client.evals.runs.retrieve('run_id', { eval_id: 'eval_id' });

console.log(run.id);
```

---

## Cancel eval run

**Method:** `POST`

**Endpoint:** `/evals/{eval_id}/runs/{run_id}`

### Description

Cancel an ongoing evaluation run.


### Parameters

- **eval_id** (path, string) (required): The ID of the evaluation whose run you want to cancel.
- **run_id** (path, string) (required): The ID of the run to cancel.

### Responses

- **200**: The canceled eval run object

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/evals/eval_67abd54d9b0081909a86353f6fb9317a/runs/evalrun_67abd54d60ec8190832b46859da808f7/cancel \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
response = client.evals.runs.cancel(
    run_id="run_id",
    eval_id="eval_id",
)
print(response.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const response = await client.evals.runs.cancel('run_id', { eval_id: 'eval_id' });

console.log(response.id);
```

---

## Delete eval run

**Method:** `DELETE`

**Endpoint:** `/evals/{eval_id}/runs/{run_id}`

### Description

Delete an eval run.


### Parameters

- **eval_id** (path, string) (required): The ID of the evaluation to delete the run from.
- **run_id** (path, string) (required): The ID of the run to delete.

### Responses

- **200**: Successfully deleted the eval run
- **404**: Run not found

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/evals/eval_123abc/runs/evalrun_abc456 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
run = client.evals.runs.delete(
    run_id="run_id",
    eval_id="eval_id",
)
print(run.run_id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const run = await client.evals.runs.delete('run_id', { eval_id: 'eval_id' });

console.log(run.run_id);
```

---

## Get eval run output items

**Method:** `GET`

**Endpoint:** `/evals/{eval_id}/runs/{run_id}/output_items`

### Description

Get a list of output items for an evaluation run.


### Parameters

- **eval_id** (path, string) (required): The ID of the evaluation to retrieve runs for.
- **run_id** (path, string) (required): The ID of the run to retrieve output items for.
- **after** (query, string): Identifier for the last output item from the previous pagination request.
- **limit** (query, integer): Number of output items to retrieve.
- **status** (query, string): Filter output items by status. Use `failed` to filter by failed output
items or `pass` to filter by passed output items.

- **order** (query, string): Sort order for output items by timestamp. Use `asc` for ascending order or `desc` for descending order. Defaults to `asc`.

### Responses

- **200**: A list of output items for the evaluation run

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/evals/egroup_67abd54d9b0081909a86353f6fb9317a/runs/erun_67abd54d60ec8190832b46859da808f7/output_items \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
page = client.evals.runs.output_items.list(
    run_id="run_id",
    eval_id="eval_id",
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
for await (const outputItemListResponse of client.evals.runs.outputItems.list('run_id', {
  eval_id: 'eval_id',
})) {
  console.log(outputItemListResponse.id);
}
```

---

## Get an output item of an eval run

**Method:** `GET`

**Endpoint:** `/evals/{eval_id}/runs/{run_id}/output_items/{output_item_id}`

### Description

Get an evaluation run output item by ID.


### Parameters

- **eval_id** (path, string) (required): The ID of the evaluation to retrieve runs for.
- **run_id** (path, string) (required): The ID of the run to retrieve.
- **output_item_id** (path, string) (required): The ID of the output item to retrieve.

### Responses

- **200**: The evaluation run output item

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/evals/eval_67abd54d9b0081909a86353f6fb9317a/runs/evalrun_67abd54d60ec8190832b46859da808f7/output_items/outputitem_67abd55eb6548190bb580745d5644a33 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"

```

**Python:**

```python
from openai import OpenAI

client = OpenAI(
    api_key="My API Key",
)
output_item = client.evals.runs.output_items.retrieve(
    output_item_id="output_item_id",
    eval_id="eval_id",
    run_id="run_id",
)
print(output_item.id)
```

**Javascript:**

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'My API Key',
});

const outputItem = await client.evals.runs.outputItems.retrieve('output_item_id', {
  eval_id: 'eval_id',
  run_id: 'run_id',
});

console.log(outputItem.id);
```

---

