# Vapi MCP Server

A Model Context Protocol (MCP) server for integrating Vapi's voice AI platform with Cursor and other MCP-compatible applications.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vapi-mcp-server.git
```

2. Install dependencies:
```bash
cd vapi-mcp-server
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
VAPI_PRIVATE_KEY=your_vapi_private_key
VAPI_ORG_ID=your_vapi_org_id
VAPI_KNOWLEDGE_ID=your_vapi_knowledge_id
VAPI_JWT_PRIVATE=your_vapi_jwt_private

# Environment
NODE_ENV=development
```

## Project Structure

```
vapi-mcp-server/
├── dist/               # Compiled JavaScript output
├── src/                # TypeScript source files
│   ├── index.ts        # Main server entry point
│   └── types.ts        # TypeScript interfaces
├── .env                # Environment variables (create this file)
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
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

## Connecting to Cursor

1. Configure Cursor to use this MCP server by adding the following to your Cursor settings:

```json
{
  "mcp.config.servers": [
    {
      "name": "Vapi MCP Server",
      "command": "node /path/to/vapi-mcp-server/dist/index.js"
    }
  ]
}
```

**Important**: Use the full absolute path to the `dist/index.js` file.

2. Restart Cursor after adding the configuration.

## Available Tools

The server provides the following tools:

### 1. Vapi Call Tool

Make outbound phone calls using Vapi's voice AI platform.

**Tool Name**: `vapi_call`

Example input:
```json
{
  "phoneNumber": "+1234567890",
  "assistantId": "asst_123456"
}
```

Or with a custom assistant configuration:

```json
{
  "phoneNumber": "+1234567890",
  "assistantConfig": {
    "name": "Sales Assistant",
    "model": "gpt-4",
    "voice": "alloy",
    "firstMessage": "Hello, I'm calling from Example Company. How are you today?",
    "maxDuration": 300
  }
}
```

### 2. Vapi Assistant Tool

Manage voice assistants on the Vapi platform.

**Tool Name**: `vapi_assistant`

Example input for creating an assistant:
```json
{
  "action": "create",
  "params": {
    "name": "Sales Assistant",
    "model": "gpt-4",
    "voice": "alloy",
    "firstMessage": "Hello, I'm calling from Example Company. How are you today?",
    "instructions": "You are a friendly sales representative trying to understand the customer's needs.",
    "maxDuration": 300
  }
}
```

Example input for getting, updating, or deleting an assistant:
```json
{
  "action": "get",
  "assistantId": "asst_123456"
}
```

### 3. Vapi Conversation Tool

Retrieve conversation details and transcripts from Vapi calls.

**Tool Name**: `vapi_conversation`

Example input for getting a conversation transcript:
```json
{
  "action": "get",
  "callId": "call_123456"
}
```

Example input for listing recent conversations:
```json
{
  "action": "list",
  "filters": {
    "limit": 10,
    "offset": 0
  }
}
```

## Development

### Adding New Tools

To add a new tool:

1. Define the Zod schema for the tool's input in `index.ts`
2. Add the tool to the list returned by the `ListToolsRequestSchema` handler
3. Add a case for the tool in the `CallToolRequestSchema` handler

### API Documentation

For more details on the Vapi API:
- [Vapi Documentation](https://docs.vapi.ai/)
- [Server SDK](https://github.com/vapi-ai/server-sdk)

## Troubleshooting

If you encounter issues:

1. Check that your Vapi API credentials are correct in the `.env` file
2. Ensure the build completed successfully with `npm run build`
3. Check the server logs for error messages
4. Make sure the path in your Cursor configuration points to the correct `dist/index.js` file

## License

MIT 