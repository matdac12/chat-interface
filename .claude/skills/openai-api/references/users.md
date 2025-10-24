# Users

## Table of Contents

- [List users](#list-users)
- [Retrieve user](#retrieve-user)
- [Modify user](#modify-user)
- [Delete user](#delete-user)

---

## List users

**Method:** `GET`

**Endpoint:** `/organization/users`

### Description

Lists all of the users in the organization.

### Parameters

- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **emails** (query, array): Filter by the email address of users.

### Responses

- **200**: Users listed successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/users?after=user_abc&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Retrieve user

**Method:** `GET`

**Endpoint:** `/organization/users/{user_id}`

### Description

Retrieves a user by their identifier.

### Parameters

- **user_id** (path, string) (required): The ID of the user.

### Responses

- **200**: User retrieved successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Modify user

**Method:** `POST`

**Endpoint:** `/organization/users/{user_id}`

### Description

Modifies a user's role in the organization.

### Parameters

- **user_id** (path, string) (required): The ID of the user.

### Request Body

Reference: `UserRoleUpdateRequest`

### Responses

- **200**: User role updated successfully.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/organization/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "role": "owner"
  }'

```

---

## Delete user

**Method:** `DELETE`

**Endpoint:** `/organization/users/{user_id}`

### Description

Deletes a user from the organization.

### Parameters

- **user_id** (path, string) (required): The ID of the user.

### Responses

- **200**: User deleted successfully.

### Code Examples

**Curl:**

```curl
curl -X DELETE https://api.openai.com/v1/organization/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

