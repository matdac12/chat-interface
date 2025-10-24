# Projects

## Table of Contents

- [List projects](#list-projects)
- [Create project](#create-project)
- [Retrieve project](#retrieve-project)
- [Modify project](#modify-project)
- [List project API keys](#list-project-api-keys)
- [Retrieve project API key](#retrieve-project-api-key)
- [Delete project API key](#delete-project-api-key)
- [Archive project](#archive-project)
- [List project rate limits](#list-project-rate-limits)
- [Modify project rate limit](#modify-project-rate-limit)
- [List project service accounts](#list-project-service-accounts)
- [Create project service account](#create-project-service-account)
- [Retrieve project service account](#retrieve-project-service-account)
- [Delete project service account](#delete-project-service-account)
- [List project users](#list-project-users)
- [Create project user](#create-project-user)
- [Retrieve project user](#retrieve-project-user)
- [Modify project user](#modify-project-user)
- [Delete project user](#delete-project-user)

---

## List projects

**Method:** `GET`

**Endpoint:** `/organization/projects`

### Description

Returns a list of projects.

### Parameters

- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **include_archived** (query, boolean): If `true` returns all projects including those that have been `archived`. Archived projects are not included by default.

### Responses

- **200**: Projects listed successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/projects?after=proj_abc&limit=20&include_archived=false \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Create project

**Method:** `POST`

**Endpoint:** `/organization/projects`

### Description

Create a new project in the organization. Projects can be created and archived, but cannot be deleted.

### Request Body

Reference: `ProjectCreateRequest`

### Responses

- **200**: Project created successfully.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/organization/projects \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "name": "Project ABC"
  }'

```

---

## Retrieve project

**Method:** `GET`

**Endpoint:** `/organization/projects/{project_id}`

### Description

Retrieves a project.

### Parameters

- **project_id** (path, string) (required): The ID of the project.

### Responses

- **200**: Project retrieved successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/projects/proj_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Modify project

**Method:** `POST`

**Endpoint:** `/organization/projects/{project_id}`

### Description

Modifies a project in the organization.

### Parameters

- **project_id** (path, string) (required): The ID of the project.

### Request Body

Reference: `ProjectUpdateRequest`

### Responses

- **200**: Project updated successfully.
- **400**: Error response when updating the default project.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "name": "Project DEF"
  }'

```

---

## List project API keys

**Method:** `GET`

**Endpoint:** `/organization/projects/{project_id}/api_keys`

### Description

Returns a list of API keys in the project.

### Parameters

- **project_id** (path, string) (required): The ID of the project.
- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.


### Responses

- **200**: Project API keys listed successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/projects/proj_abc/api_keys?after=key_abc&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Retrieve project API key

**Method:** `GET`

**Endpoint:** `/organization/projects/{project_id}/api_keys/{key_id}`

### Description

Retrieves an API key in the project.

### Parameters

- **project_id** (path, string) (required): The ID of the project.
- **key_id** (path, string) (required): The ID of the API key.

### Responses

- **200**: Project API key retrieved successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/projects/proj_abc/api_keys/key_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Delete project API key

**Method:** `DELETE`

**Endpoint:** `/organization/projects/{project_id}/api_keys/{key_id}`

### Description

Deletes an API key from the project.

### Parameters

- **project_id** (path, string) (required): The ID of the project.
- **key_id** (path, string) (required): The ID of the API key.

### Responses

- **200**: Project API key deleted successfully.
- **400**: Error response for various conditions.

### Code Examples

**Curl:**

```curl
curl -X DELETE https://api.openai.com/v1/organization/projects/proj_abc/api_keys/key_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Archive project

**Method:** `POST`

**Endpoint:** `/organization/projects/{project_id}/archive`

### Description

Archives a project in the organization. Archived projects cannot be used or updated.

### Parameters

- **project_id** (path, string) (required): The ID of the project.

### Responses

- **200**: Project archived successfully.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc/archive \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## List project rate limits

**Method:** `GET`

**Endpoint:** `/organization/projects/{project_id}/rate_limits`

### Description

Returns the rate limits per model for a project.

### Parameters

- **project_id** (path, string) (required): The ID of the project.
- **limit** (query, integer): A limit on the number of objects to be returned. The default is 100.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **before** (query, string): A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, beginning with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.


### Responses

- **200**: Project rate limits listed successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/projects/proj_abc/rate_limits?after=rl_xxx&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Modify project rate limit

**Method:** `POST`

**Endpoint:** `/organization/projects/{project_id}/rate_limits/{rate_limit_id}`

### Description

Updates a project rate limit.

### Parameters

- **project_id** (path, string) (required): The ID of the project.
- **rate_limit_id** (path, string) (required): The ID of the rate limit.

### Request Body

Reference: `ProjectRateLimitUpdateRequest`

### Responses

- **200**: Project rate limit updated successfully.
- **400**: Error response for various conditions.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc/rate_limits/rl_xxx \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "max_requests_per_1_minute": 500
  }'

```

---

## List project service accounts

**Method:** `GET`

**Endpoint:** `/organization/projects/{project_id}/service_accounts`

### Description

Returns a list of service accounts in the project.

### Parameters

- **project_id** (path, string) (required): The ID of the project.
- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.


### Responses

- **200**: Project service accounts listed successfully.
- **400**: Error response when project is archived.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/projects/proj_abc/service_accounts?after=custom_id&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Create project service account

**Method:** `POST`

**Endpoint:** `/organization/projects/{project_id}/service_accounts`

### Description

Creates a new service account in the project. This also returns an unredacted API key for the service account.

### Parameters

- **project_id** (path, string) (required): The ID of the project.

### Request Body

Reference: `ProjectServiceAccountCreateRequest`

### Responses

- **200**: Project service account created successfully.
- **400**: Error response when project is archived.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc/service_accounts \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "name": "Production App"
  }'

```

---

## Retrieve project service account

**Method:** `GET`

**Endpoint:** `/organization/projects/{project_id}/service_accounts/{service_account_id}`

### Description

Retrieves a service account in the project.

### Parameters

- **project_id** (path, string) (required): The ID of the project.
- **service_account_id** (path, string) (required): The ID of the service account.

### Responses

- **200**: Project service account retrieved successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/projects/proj_abc/service_accounts/svc_acct_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Delete project service account

**Method:** `DELETE`

**Endpoint:** `/organization/projects/{project_id}/service_accounts/{service_account_id}`

### Description

Deletes a service account from the project.

### Parameters

- **project_id** (path, string) (required): The ID of the project.
- **service_account_id** (path, string) (required): The ID of the service account.

### Responses

- **200**: Project service account deleted successfully.

### Code Examples

**Curl:**

```curl
curl -X DELETE https://api.openai.com/v1/organization/projects/proj_abc/service_accounts/svc_acct_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## List project users

**Method:** `GET`

**Endpoint:** `/organization/projects/{project_id}/users`

### Description

Returns a list of users in the project.

### Parameters

- **project_id** (path, string) (required): The ID of the project.
- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.


### Responses

- **200**: Project users listed successfully.
- **400**: Error response when project is archived.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/projects/proj_abc/users?after=user_abc&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Create project user

**Method:** `POST`

**Endpoint:** `/organization/projects/{project_id}/users`

### Description

Adds a user to the project. Users must already be members of the organization to be added to a project.

### Parameters

- **project_id** (path, string) (required): The ID of the project.

### Request Body

Reference: `ProjectUserCreateRequest`

### Responses

- **200**: User added to project successfully.
- **400**: Error response for various conditions.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc/users \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "user_id": "user_abc",
      "role": "member"
  }'

```

---

## Retrieve project user

**Method:** `GET`

**Endpoint:** `/organization/projects/{project_id}/users/{user_id}`

### Description

Retrieves a user in the project.

### Parameters

- **project_id** (path, string) (required): The ID of the project.
- **user_id** (path, string) (required): The ID of the user.

### Responses

- **200**: Project user retrieved successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/projects/proj_abc/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Modify project user

**Method:** `POST`

**Endpoint:** `/organization/projects/{project_id}/users/{user_id}`

### Description

Modifies a user's role in the project.

### Parameters

- **project_id** (path, string) (required): The ID of the project.
- **user_id** (path, string) (required): The ID of the user.

### Request Body

Reference: `ProjectUserUpdateRequest`

### Responses

- **200**: Project user's role updated successfully.
- **400**: Error response for various conditions.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "role": "owner"
  }'

```

---

## Delete project user

**Method:** `DELETE`

**Endpoint:** `/organization/projects/{project_id}/users/{user_id}`

### Description

Deletes a user from the project.

### Parameters

- **project_id** (path, string) (required): The ID of the project.
- **user_id** (path, string) (required): The ID of the user.

### Responses

- **200**: Project user deleted successfully.
- **400**: Error response for various conditions.

### Code Examples

**Curl:**

```curl
curl -X DELETE https://api.openai.com/v1/organization/projects/proj_abc/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

