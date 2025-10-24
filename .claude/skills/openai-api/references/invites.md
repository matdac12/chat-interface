# Invites

## Table of Contents

- [List invites](#list-invites)
- [Create invite](#create-invite)
- [Retrieve invite](#retrieve-invite)
- [Delete invite](#delete-invite)

---

## List invites

**Method:** `GET`

**Endpoint:** `/organization/invites`

### Description

Returns a list of invites in the organization.

### Parameters

- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.


### Responses

- **200**: Invites listed successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/invites?after=invite-abc&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Create invite

**Method:** `POST`

**Endpoint:** `/organization/invites`

### Description

Create an invite for a user to the organization. The invite must be accepted by the user before they have access to the organization.

### Request Body

Reference: `InviteRequest`

### Responses

- **200**: User invited successfully.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/organization/invites \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "email": "anotheruser@example.com",
      "role": "reader",
      "projects": [
        {
          "id": "project-xyz",
          "role": "member"
        },
        {
          "id": "project-abc",
          "role": "owner"
        }
      ]
  }'

```

---

## Retrieve invite

**Method:** `GET`

**Endpoint:** `/organization/invites/{invite_id}`

### Description

Retrieves an invite.

### Parameters

- **invite_id** (path, string) (required): The ID of the invite to retrieve.

### Responses

- **200**: Invite retrieved successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/invites/invite-abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

## Delete invite

**Method:** `DELETE`

**Endpoint:** `/organization/invites/{invite_id}`

### Description

Delete an invite. If the invite has already been accepted, it cannot be deleted.

### Parameters

- **invite_id** (path, string) (required): The ID of the invite to delete.

### Responses

- **200**: Invite deleted successfully.

### Code Examples

**Curl:**

```curl
curl -X DELETE https://api.openai.com/v1/organization/invites/invite-abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

---

