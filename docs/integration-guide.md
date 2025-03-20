# Vapi MCP Integration - Service Connection Guide

This guide explains how other services in the docker-compose stack can connect to the Vapi MCP service.

## Connection Methods

The Vapi MCP service is available through the following endpoints:

1. **HTTP API**: `http://vapi-mcp:3000`
2. **External URL**: `https://staging-n8n.ai-advantage.au/vapi/`

## N8N Integration

### Using HTTP Request Node

1. Create a new HTTP Request node in your n8n workflow
2. Use the environment variable for dynamic configuration:
   ```
   {{$env.VAPI_API_URL}}/api/calls
   ```
3. Example configuration:
   - **Method**: POST
   - **URL**: `{{$env.VAPI_API_URL}}/api/calls`
   - **Headers**: `Content-Type: application/json`
   - **Body**:
     ```json
     {
       "phoneNumber": "+61412345678",
       "assistantId": "your-assistant-id",
       "metadata": {
         "campaign": "welcome_call"
       }
     }
     ```

### Available Endpoints

- **Assistants**: `{{$env.VAPI_API_URL}}/api/assistants`
- **Calls**: `{{$env.VAPI_API_URL}}/api/calls`
- **Conversations**: `{{$env.VAPI_API_URL}}/api/conversations`

## Other Docker Services

Other containers can reach the Vapi MCP service using the service name:

```
http://vapi-mcp:3000
```

## Connection Examples

### Python Example

```python
import requests

# Base URL for internal docker network
base_url = "http://vapi-mcp:3000"

# Create a new assistant
response = requests.post(
    f"{base_url}/api/assistants",
    json={
        "name": "Customer Support",
        "model": "gpt-4",
        "voice": "alloy",
        "firstMessage": "Hello, this is customer support. How can I help you today?"
    }
)

print(response.json())
```

### JavaScript Example

```javascript
const axios = require('axios');

// Base URL for internal docker network
const baseUrl = 'http://vapi-mcp:3000';

// Make a call
async function makeCall() {
  try {
    const response = await axios.post(`${baseUrl}/api/calls`, {
      phoneNumber: '+61412345678',
      assistantId: 'assistant_abc123',
      metadata: {
        campaign: 'support_followup'
      }
    });
    
    console.log('Call initiated:', response.data);
  } catch (error) {
    console.error('Error making call:', error.response?.data || error.message);
  }
}

makeCall();
```

## Health Check

All services can verify the Vapi MCP service health using:

```
http://vapi-mcp:3000/health
```

Expected response:
```json
{"status":"ok"}
```

## Environment Variables

The following environment variables are available for service configuration:

| Variable | Purpose | Where Set |
|----------|---------|-----------|
| `VAPI_API_URL` | Base URL for Vapi API | In n8n container as `http://vapi-mcp:3000` |
| `VAPI_ORG_ID` | Vapi organization identifier | `.env` file |
| `VAPI_PRIVATE_KEY` | Authentication key | `.env` file |
| `VAPI_KNOWLEDGE_ID` | Knowledge base identifier | `.env` file |
| `VAPI_JWT_PRIVATE` | JWT authentication key | `.env` file |

## Troubleshooting

If services cannot connect to Vapi MCP:

1. Verify the container is running:
   ```bash
   sudo docker ps | grep vapi-mcp
   ```

2. Check the service is healthy:
   ```bash
   sudo docker exec -it vapi-mcp wget -q -O - http://localhost:3000/health
   ```

3. Verify network connectivity (from another container):
   ```bash
   sudo docker exec -it n8n wget -q -O - http://vapi-mcp:3000/health
   ```

4. Review logs for errors:
   ```bash
   sudo docker logs vapi-mcp
   ```

## Notes for N8N Custom Nodes

When creating custom n8n nodes that connect to Vapi MCP:

1. Use the environment variable for flexibility:
   ```javascript
   const baseUrl = process.env.VAPI_API_URL || 'http://vapi-mcp:3000';
   ```

2. Include proper error handling and timeouts
3. Consider implementing retry logic for critical calls

## Additional Resources

For detailed API documentation and examples, refer to the original vapi-mcp project documentation or view the service API info at `https://staging-n8n.ai-advantage.au/vapi/`. 