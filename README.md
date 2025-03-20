# Vapi MCP: Voice AI Tools for Cursor

This repository contains an integration between [Vapi](https://vapi.ai) (Voice API platform) and Cursor IDE through the Model Context Protocol (MCP).

## Overview

Vapi MCP allows you to create, manage, and interact with voice assistants directly from Cursor IDE. With these tools, you can:

- Make outbound voice calls using AI assistants
- Create and manage voice assistants with different voices and behaviors
- Retrieve and analyze conversation transcripts

## Documentation

- [Integration Guide](./docs/integration-guide.md) - How to connect to Vapi MCP from other services
- [Deployment Guide](./docs/deployment-guide.md) - How to deploy Vapi MCP in a Docker environment

## Installation

### Prerequisites

- Node.js 18+ 
- Cursor IDE
- [Optional] Vapi API key (for production use)

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/vapi-mcp.git
cd vapi-mcp
```

2. **Install dependencies and build**

```bash
cd vapi-mcp-server
npm install
npm run build
```

3. **Configure Cursor**

Add the following entry to your Cursor MCP configuration file (`~/.cursor/mcp.json`):

```json
"Vapi Voice AI Tools": {
  "command": "node",
  "type": "stdio",
  "args": [
    "/path/to/vapi-mcp/vapi-mcp-server/dist/index.js"
  ]
}
```

Replace `/path/to/vapi-mcp` with the actual path to your cloned repository.

4. **[Optional] Configure API key**

For production use with actual Vapi API calls, create a `.env` file in the `vapi-mcp-server` directory:

```
VAPI_API_KEY=your_api_key_here
```

## Available Tools

### 1. Voice Call Tool (`vapi_call`)

Make outbound calls with AI voice assistants.

**Example:**
```json
{
  "phoneNumber": "+1234567890",
  "assistantId": "assistant_abc123",
  "metadata": {
    "campaign": "welcome_call"
  }
}
```

### 2. Assistant Management Tool (`vapi_assistant`)

Create, retrieve, list, update, and delete voice assistants.

**Example (Create):**
```json
{
  "action": "create",
  "params": {
    "name": "Sales Assistant",
    "model": "gpt-4",
    "voice": "alloy",
    "firstMessage": "Hello, thank you for taking my call. I'm calling about our new product..."
  }
}
```

**Example (List):**
```json
{
  "action": "list"
}
```

### 3. Conversation Tool (`vapi_conversation`)

Retrieve conversation details and transcripts.

**Example (Get):**
```json
{
  "action": "get",
  "callId": "call_abc123"
}
```

**Example (List):**
```json
{
  "action": "list",
  "filters": {
    "limit": 10,
    "startDate": "2023-01-01T00:00:00Z"
  }
}
```

## Usage in Cursor

Once configured, the Vapi tools will be available to the AI assistant in Cursor. You can instruct the AI to:

1. **Make a call:**
   "Can you please call +1234567890 using the Sales Assistant?"

2. **Create a new assistant:**
   "Create a new assistant for customer support with a friendly greeting."

3. **Retrieve conversation details:**
   "Show me the transcript of my last sales call."

## Practical Use Cases in Development

Vapi MCP offers several valuable capabilities when integrated with your development environment:

1. **Voice-enabled AI calls from Cursor:**
   - Make outbound calls directly from your IDE while coding
   - Connect with customers or clients without switching applications
   - Test voice interactions for applications you're building

2. **Assistant management in context:**
   - Create and customize voice agents based on specific project needs
   - Adjust assistant parameters like voice, model, and prompts while developing
   - Test different voice personas for your applications

3. **Workflow automation:**
   - Automate customer outreach from your development environment
   - Schedule voice follow-ups based on project milestones
   - Create voice notifications for CI/CD processes or deployment status

4. **Conversation tracking:**
   - Retrieve and analyze transcripts of previous calls
   - Extract requirements or feedback directly from conversation history
   - Keep call records linked to relevant code sections

5. **Development-specific use cases:**
   - Get spoken explanations of complex code sections
   - Voice-dictate code comments or documentation while working
   - Conduct code reviews with voice assistance

6. **Team collaboration:**
   - Send voice briefings to team members
   - Create voice-based task assignments
   - Conduct quick voice standups through Cursor

The Vapi MCP integration serves as a bridge between your coding environment and voice AI capabilities, allowing for seamless voice interactions without disrupting your development workflow.

## Development

### Project Structure

```
vapi-mcp/
├── vapi-mcp-server/       # MCP server implementation
│   ├── src/               # Source code
│   │   └── index.ts       # Main implementation
│   ├── dist/              # Compiled code
│   └── package.json       # Dependencies
├── examples/              # Example usage and scripts
└── README.md              # This file
```

### Extending the server

To add new functionality:

1. Define new schemas in `src/index.ts`
2. Add new tool entries to the `ListToolsRequestSchema` handler
3. Implement the logic in the `CallToolRequestSchema` handler
4. Build and restart the server

### Switching to production API

The current implementation uses mock data. To connect to the actual Vapi API:

1. Install the Vapi SDK: `npm install --save @vapi-ai/sdk`
2. Import the SDK in `src/index.ts`
3. Initialize with your API key
4. Replace the mock responses with actual API calls

## Troubleshooting

### Server won't start

- Ensure Node.js is installed and up to date
- Check that all dependencies are installed (`npm install`)
- Verify the build completed successfully (`npm run build`)
- Make sure you're running the command from the correct directory

### Tools not appearing in Cursor

- Verify the path in your `mcp.json` is correct
- Restart Cursor to reload the MCP configuration
- Check the server is running properly

### Connection issues

- Ensure the server is running
- Check for error messages in the server console
- Verify the Cursor MCP configuration is correct

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgements

- [Vapi](https://vapi.ai) for the voice AI platform
- [Cursor](https://cursor.sh) for the AI-powered IDE
- [Model Context Protocol](https://github.com/anthropics/anthropic-model-context-protocol) for enabling tool integrations 