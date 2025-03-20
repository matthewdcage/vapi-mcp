# Vapi MCP Integration

This document explains how the Vapi MCP (Model Context Protocol) service is integrated with the n8n platform.

## Overview

The Vapi MCP service provides Voice AI capabilities for the n8n platform. It enables:
- Making outbound voice calls with AI assistants
- Creating and managing voice assistants with different voices
- Retrieving and analyzing conversation transcripts

## Architecture

The Vapi MCP integration consists of:

1. **Docker Container**: A containerized version of the Vapi MCP HTTP server
2. **Caddy Routing**: Reverse proxy setup to route `/vapi/*` URLs to the Vapi service
3. **Environment Variables**: Configuration for connecting to the Vapi API
4. **n8n Custom Node**: A custom node in n8n that connects to the Vapi service

## Access

The service is accessible via:

- **External URL**: https://staging-n8n.ai-advantage.au/vapi/
- **Internal URL (from other containers)**: http://vapi-mcp:3000
- **Local URL (from n8n container)**: http://vapi-mcp:3000

## API Endpoints

The service exposes the following API endpoints:

- `GET /api/assistants` - List voice assistants
- `POST /api/assistants` - Create a new voice assistant
- `GET /api/assistants/:id` - Get a specific voice assistant
- `POST /api/calls` - Make an outbound call
- `GET /api/calls` - List calls
- `GET /api/calls/:id` - Get details about a specific call
- `GET /api/conversations` - List conversations
- `GET /api/conversations/:id` - Get a specific conversation transcript

## Configuration

The service uses the following environment variables:

- `VAPI_ORG_ID` - Vapi organization ID
- `VAPI_PRIVATE_KEY` - Vapi private API key
- `VAPI_KNOWLEDGE_ID` - Vapi knowledge base ID
- `VAPI_JWT_PRIVATE` - JWT private key for Vapi authentication

## Usage in n8n

To use the Vapi service in n8n:

1. Access via the custom n8n node
2. API requests can be made to `{{$env.VAPI_API_URL}}/api/...` using the HTTP Request node

## Maintenance

### Updating the Service

1. Pull the latest code:
   ```bash
   cd /home/mcage/vapi-mcp
   git pull
   ```

2. Rebuild and restart the container:
   ```bash
   cd /home/mcage/.n8n-setup
   sudo docker compose up -d --build vapi-mcp
   ```

### Monitoring

Check the service status:
```bash
sudo docker logs vapi-mcp
```

Check the health endpoint:
```bash
curl http://localhost:3000/health
```

## Troubleshooting

If the service is not responding:

1. Check container status:
   ```bash
   sudo docker ps | grep vapi-mcp
   ```

2. Check logs:
   ```bash
   sudo docker logs vapi-mcp
   ```

3. Verify Caddy configuration:
   ```bash
   sudo docker logs n8n-setup-caddy-1
   ```

4. Restart the service:
   ```bash
   sudo docker restart vapi-mcp
   ``` 