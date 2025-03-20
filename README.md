# Vapi MCP for Cursor

This project implements a Model Context Protocol (MCP) server for integrating Vapi's voice AI capabilities with Cursor.

## Setup Instructions

### 1. Project Structure

The Vapi MCP server is structured as follows:
- `vapi-mcp-server/` - Main server code
  - `src/` - TypeScript source files
  - `dist/` - Compiled JavaScript output
  - `.env` - Environment variables for API keys

### 2. Environment Configuration

Create a `.env` file in the `vapi-mcp-server` directory with the following variables:

```
# Vapi API Keys
VAPI_ORG_ID=your-org-id
VAPI_PRIVATE_KEY=your-private-key
VAPI_KNOWLEDGE_ID=your-knowledge-id
VAPI_JWT_PRIVATE=your-jwt-private

# Environment
NODE_ENV=development
```

### 3. Building the Server

To build the server:

```bash
cd vapi-mcp/vapi-mcp-server
npm install
npm run build
```

### 4. Configuration in Cursor

#### Important: Avoiding "Client Closed" Errors

When configuring the Vapi MCP server in Cursor's MCP settings, pay attention to the following crucial details:

1. **Working Directory**: The `cwd` parameter is required to ensure the server runs in the correct directory and can access the `.env` file properly.

2. **Environment Variables**: Must be explicitly provided in the configuration, even if they exist in the `.env` file.

3. **Module Type**: The server uses ES modules, so the `package.json` must include `"type": "module"`.

Here's the correct configuration for `.cursor/mcp.json`:

```json
"Vapi Voice AI Tools": {
  "command": "node",
  "type": "stdio",
  "args": [
    "/Users/matthewcage/Documents/AA-GitHub/MCP/vapi-mcp/vapi-mcp-server/dist/index.js"
  ],
  "cwd": "/Users/matthewcage/Documents/AA-GitHub/MCP/vapi-mcp/vapi-mcp-server",
  "env": {
    "VAPI_ORG_ID": "your-org-id",
    "VAPI_PRIVATE_KEY": "your-private-key",
    "VAPI_KNOWLEDGE_ID": "your-knowledge-id",
    "VAPI_JWT_PRIVATE": "your-jwt-private",
    "NODE_ENV": "development"
  }
}
```

## Troubleshooting

### "Client Closed" Error in Cursor

If you see "Client Closed" in the Cursor MCP Tools panel:

1. **Check Working Directory**: Ensure the `cwd` parameter is set correctly in your mcp.json
2. **Verify Environment Variables**: Make sure all required environment variables are passed in the configuration
3. **Check Module Type**: Ensure `package.json` has `"type": "module"`
4. **Inspect Permissions**: Make sure the dist/index.js file is executable (`chmod +x dist/index.js`)
5. **Test Server Directly**: Run the server manually to check for errors:
   ```bash
   cd vapi-mcp/vapi-mcp-server
   node --trace-warnings dist/index.js
   ```

### Module Not Found Errors

If you get "Error: Cannot find module" when running:

1. **Check Working Directory**: Are you running from the correct directory?
2. **Rebuild**: Try rebuilding the project with `npm run build`
3. **Dependencies**: Ensure all dependencies are installed with `npm install`

## Available Tools

The Vapi MCP server provides the following tools:

1. **vapi_call** - Make outbound calls using Vapi's voice AI
2. **vapi_assistant** - Manage voice assistants (create, get, list, update, delete)
3. **vapi_conversation** - Retrieve conversation details from calls

## Lessons Learned

1. When integrating with Cursor's MCP:
   - Always specify the `cwd` parameter to ensure the server runs in the correct directory
   - Pass all required environment variables directly in the MCP configuration
   - For ES modules, ensure package.json has `"type": "module"` and tsconfig.json uses appropriate module settings
   - Test the server directly before configuring in Cursor

2. The server command path must be absolute and correctly formed in the Cursor MCP config

3. Using stdio transport type is required for proper integration with Cursor 