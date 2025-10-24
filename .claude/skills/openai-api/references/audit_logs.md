# Audit Logs

## Table of Contents

- [List audit logs](#list-audit-logs)

---

## List audit logs

**Method:** `GET`

**Endpoint:** `/organization/audit_logs`

### Description

List user actions and configuration changes within this organization.

### Parameters

- **effective_at** (query, object): Return only events whose `effective_at` (Unix seconds) is in this range.
- **project_ids[]** (query, array): Return only events for these projects.
- **event_types[]** (query, array): Return only events with a `type` in one of these values. For example, `project.created`. For all options, see the documentation for the [audit log object](https://platform.openai.com/docs/api-reference/audit-logs/object).
- **actor_ids[]** (query, array): Return only events performed by these actors. Can be a user ID, a service account ID, or an api key tracking ID.
- **actor_emails[]** (query, array): Return only events performed by users with these emails.
- **resource_ids[]** (query, array): Return only events performed on these targets. For example, a project ID updated.
- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **before** (query, string): A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.


### Responses

- **200**: Audit logs listed successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/audit_logs \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"

```

---

