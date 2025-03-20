# Vapi MCP HTTP Server

An HTTP API server for Vapi voice AI platform, providing REST endpoints that match the functionality of the Vapi MCP integration.

## Features

- RESTful API for Vapi voice AI platform
- Make outbound calls with AI assistants
- Manage voice assistants (create, list, get, update, delete)
- Access conversation details from calls
- Compatible with n8n, Postman, and other HTTP-based tools

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vapi-mcp-http-server.git
```

2. Install dependencies:
```bash
cd vapi-mcp-http-server
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

Create a `.env` file in the root directory with your Vapi API credentials:

```
# Vapi API Keys
VAPI_ORG_ID=your_vapi_org_id
VAPI_PRIVATE_KEY=your_vapi_private_key
VAPI_KNOWLEDGE_ID=your_vapi_knowledge_id
VAPI_JWT_PRIVATE=your_vapi_jwt_private

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Running the Server

To start the server:

```bash
npm start
```

For development with automatic reloading:

```bash
npm run dev
```

The server will start on port 3000 by default (or the port specified in your `.env` file).

## API Endpoints

### Calls

- `POST /api/calls` - Make an outbound call
- `GET /api/calls` - List all calls
- `GET /api/calls/:id` - Get details of a specific call

### Assistants

- `POST /api/assistants` - Create a new assistant
- `GET /api/assistants` - List all assistants
- `GET /api/assistants/:id` - Get details of a specific assistant
- `PUT /api/assistants/:id` - Update an assistant
- `DELETE /api/assistants/:id` - Delete an assistant

### Conversations

- `GET /api/conversations` - List all conversations (based on calls)
- `GET /api/conversations/:callId` - Get conversation details for a specific call

## Example Requests

### Making a Call

```bash
curl -X POST http://localhost:3000/api/calls \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "assistantId": "asst_123456"
  }'
```

Or with a custom assistant:

```bash
curl -X POST http://localhost:3000/api/calls \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "assistantConfig": {
      "name": "Sales Assistant",
      "model": "gpt-4",
      "voice": "alloy",
      "firstMessage": "Hello, I am calling from Example Company."
    }
  }'
```

### Creating an Assistant

```bash
curl -X POST http://localhost:3000/api/assistants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sales Assistant",
    "model": "gpt-4",
    "voice": "alloy",
    "firstMessage": "Hello, I am calling from Example Company.",
    "instructions": "You are a friendly sales representative."
  }'
```

## Using with n8n

To use this API with n8n:

1. Add an HTTP Request node
2. Set the method to the appropriate HTTP method (GET, POST, PUT, DELETE)
3. Set the URL to `http://your-server:3000/api/[endpoint]`
4. For POST/PUT requests, set the Body Content Type to JSON and provide the required parameters
5. Connect to subsequent nodes for processing the response

## Project Structure

```
vapi-mcp-http-server/
├── dist/               # Compiled JavaScript output
├── src/                # TypeScript source files
│   ├── index.ts        # Main server entry point
│   └── routes/         # API route handlers
│       ├── calls.ts    # Call-related endpoints
│       ├── assistants.ts # Assistant-related endpoints
│       └── conversations.ts # Conversation-related endpoints
├── .env                # Environment variables (create this file)
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Development

### Adding New Routes

To add a new API endpoint:

1. Add a new route handler in the appropriate file in the `src/routes` directory
2. Update the `src/index.ts` file to include the new route if necessary

## Troubleshooting

If you encounter issues:

1. Check that your Vapi API credentials are correct in the `.env` file
2. Ensure the build completed successfully with `npm run build`
3. Check the server logs for error messages
4. Verify that your requests include all required parameters

## License

MIT 