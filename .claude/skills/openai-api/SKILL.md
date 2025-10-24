---
name: openai-api
description: The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.
---

# Openai Api Skill

Comprehensive assistance with the OpenAI API, generated from the official OpenAPI specification.

## When to Use This Skill

This skill should be triggered when:
- Working with OpenAI API endpoints
- Implementing OpenAI API integrations
- Debugging OpenAI API calls
- Understanding OpenAI API authentication and permissions
- Building applications that use OpenAI services
- Managing OpenAI resources like assistants, threads, files, etc.

## Quick Reference

### Authentication
All OpenAI API requests require authentication using an API key in the Authorization header.

```bash
Authorization: Bearer $OPENAI_API_KEY
```

### Base URL
```https://api.openai.com/v1```

### Common Headers
```http
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
OpenAI-Beta: assistants=v2  # For beta endpoints
```

### Example: List Models
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Example: Create Chat Completion
```python
from openai import OpenAI

client = OpenAI(api_key="your-api-key")
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## Reference Files

This skill includes comprehensive API documentation organized by functionality:

- **assistants.md** - Assistants
- **audio.md** - Audio
- **audit_logs.md** - Audit Logs
- **batch.md** - Batch
- **certificates.md** - Certificates
- **chat.md** - Chat
- **completions.md** - Completions
- **conversations.md** - Conversations
- **embeddings.md** - Embeddings
- **evals.md** - Evals
- **files.md** - Files
- **fine_tuning.md** - Fine-tuning
- **general.md** - General
- **images.md** - Images
- **invites.md** - Invites
- **models.md** - Models
- **moderations.md** - Moderations
- **projects.md** - Projects
- **realtime.md** - Realtime
- **responses.md** - Responses
- **uploads.md** - Uploads
- **usage.md** - Usage
- **users.md** - Users
- **vector_stores.md** - Vector stores
- **videos.md** - Videos

Use `view` to read specific reference files when detailed information is needed.

## Working with This Skill

### For Beginners
Start with basic endpoints like listing models or creating simple chat completions. Review authentication requirements first.

### For Specific Features
Use the appropriate category reference file (Chat, Assistants, Audio, etc.) for detailed endpoint information.

### For Integration Development
Reference files contain complete endpoint details including:
- Request/response formats
- Required permissions
- Query parameters
- Code examples in Python, curl, and Node.js

## API Best Practices

1. **Rate Limiting:** OpenAI enforces rate limits. Implement exponential backoff for retries.
2. **Error Handling:** Handle 400, 401, 429, and 500 status codes appropriately.
3. **API Versions:** Use the latest stable API version when possible.
4. **Security:** Never expose API keys in client-side code or public repositories.
5. **Cost Management:** Monitor token usage and set appropriate limits.

## Resources

### references/
Organized API documentation by functional area. Each file contains:
- Complete endpoint specifications
- Request/response examples
- Authentication requirements
- Parameter documentation
- Code examples

### scripts/
Add helper scripts here for common automation tasks.

### assets/
Add templates, example requests, or integration boilerplates here.

## Notes

- This skill was generated from the official OpenAI API OpenAPI specification
- Examples include Python, curl, and Node.js implementations
- API keys should be stored securely, never committed to code

## Links

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [OpenAI Platform](https://platform.openai.com/)
- [API Keys Management](https://platform.openai.com/api-keys)
