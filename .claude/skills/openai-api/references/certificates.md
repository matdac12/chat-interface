# Certificates

## Table of Contents

- [List organization certificates](#list-organization-certificates)
- [Upload certificate](#upload-certificate)
- [Activate certificates for organization](#activate-certificates-for-organization)
- [Deactivate certificates for organization](#deactivate-certificates-for-organization)
- [Get certificate](#get-certificate)
- [Modify certificate](#modify-certificate)
- [Delete certificate](#delete-certificate)
- [List project certificates](#list-project-certificates)
- [Activate certificates for project](#activate-certificates-for-project)
- [Deactivate certificates for project](#deactivate-certificates-for-project)

---

## List organization certificates

**Method:** `GET`

**Endpoint:** `/organization/certificates`

### Description

List uploaded certificates for this organization.

### Parameters

- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **order** (query, string): Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.


### Responses

- **200**: Certificates listed successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/certificates \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY"

```

---

## Upload certificate

**Method:** `POST`

**Endpoint:** `/organization/certificates`

### Description

Upload a certificate to the organization. This does **not** automatically activate the certificate.

Organizations can upload up to 50 certificates.


### Request Body

Reference: `UploadCertificateRequest`

### Responses

- **200**: Certificate uploaded successfully.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/organization/certificates \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json" \
-d '{
  "name": "My Example Certificate",
  "certificate": "-----BEGIN CERTIFICATE-----\\nMIIDeT...\\n-----END CERTIFICATE-----"
}'

```

---

## Activate certificates for organization

**Method:** `POST`

**Endpoint:** `/organization/certificates/activate`

### Description

Activate certificates at the organization level.

You can atomically and idempotently activate up to 10 certificates at a time.


### Request Body

Reference: `ToggleCertificatesRequest`

### Responses

- **200**: Certificates activated successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/certificates/activate \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json" \
-d '{
  "data": ["cert_abc", "cert_def"]
}'

```

---

## Deactivate certificates for organization

**Method:** `POST`

**Endpoint:** `/organization/certificates/deactivate`

### Description

Deactivate certificates at the organization level.

You can atomically and idempotently deactivate up to 10 certificates at a time.


### Request Body

Reference: `ToggleCertificatesRequest`

### Responses

- **200**: Certificates deactivated successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/certificates/deactivate \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json" \
-d '{
  "data": ["cert_abc", "cert_def"]
}'

```

---

## Get certificate

**Method:** `GET`

**Endpoint:** `/organization/certificates/{certificate_id}`

### Description

Get a certificate that has been uploaded to the organization.

You can get a certificate regardless of whether it is active or not.


### Parameters

- **certificate_id** (path, string) (required): Unique ID of the certificate to retrieve.
- **include** (query, array): A list of additional fields to include in the response. Currently the only supported value is `content` to fetch the PEM content of the certificate.

### Responses

- **200**: Certificate retrieved successfully.

### Code Examples

**Curl:**

```curl
curl "https://api.openai.com/v1/organization/certificates/cert_abc?include[]=content" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY"

```

---

## Modify certificate

**Method:** `POST`

**Endpoint:** `/organization/certificates/{certificate_id}`

### Description

Modify a certificate. Note that only the name can be modified.


### Request Body

Reference: `ModifyCertificateRequest`

### Responses

- **200**: Certificate modified successfully.

### Code Examples

**Curl:**

```curl
curl -X POST https://api.openai.com/v1/organization/certificates/cert_abc \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json" \
-d '{
  "name": "Renamed Certificate"
}'

```

---

## Delete certificate

**Method:** `DELETE`

**Endpoint:** `/organization/certificates/{certificate_id}`

### Description

Delete a certificate from the organization.

The certificate must be inactive for the organization and all projects.


### Responses

- **200**: Certificate deleted successfully.

### Code Examples

**Curl:**

```curl
curl -X DELETE https://api.openai.com/v1/organization/certificates/cert_abc \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY"

```

---

## List project certificates

**Method:** `GET`

**Endpoint:** `/organization/projects/{project_id}/certificates`

### Description

List certificates for this project.

### Parameters

- **project_id** (path, string) (required): The ID of the project.
- **limit** (query, integer): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (query, string): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **order** (query, string): Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.


### Responses

- **200**: Certificates listed successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/projects/proj_abc/certificates \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY"

```

---

## Activate certificates for project

**Method:** `POST`

**Endpoint:** `/organization/projects/{project_id}/certificates/activate`

### Description

Activate certificates at the project level.

You can atomically and idempotently activate up to 10 certificates at a time.


### Parameters

- **project_id** (path, string) (required): The ID of the project.

### Request Body

Reference: `ToggleCertificatesRequest`

### Responses

- **200**: Certificates activated successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/projects/proj_abc/certificates/activate \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json" \
-d '{
  "data": ["cert_abc", "cert_def"]
}'

```

---

## Deactivate certificates for project

**Method:** `POST`

**Endpoint:** `/organization/projects/{project_id}/certificates/deactivate`

### Description

Deactivate certificates at the project level. You can atomically and 
idempotently deactivate up to 10 certificates at a time.


### Parameters

- **project_id** (path, string) (required): The ID of the project.

### Request Body

Reference: `ToggleCertificatesRequest`

### Responses

- **200**: Certificates deactivated successfully.

### Code Examples

**Curl:**

```curl
curl https://api.openai.com/v1/organization/projects/proj_abc/certificates/deactivate \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json" \
-d '{
  "data": ["cert_abc", "cert_def"]
}'

```

---

