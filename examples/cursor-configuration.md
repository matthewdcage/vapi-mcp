# Cursor Configuration for Vapi MCP

This guide shows how to configure Cursor to use the Vapi MCP server.

## Add the Server to Cursor Settings

1. Open Cursor
2. Go to Settings (⌘+, on Mac or Ctrl+, on Windows)
3. Click on "Edit Settings (JSON)"
4. Add the following configuration:

```json
{
  "mcp.config.servers": [
    {
      "name": "Vapi MCP Server",
      "command": "node /Users/yourusername/path/to/vapi-mcp-server/dist/index.js"
    }
  ]
}
```

Replace `/Users/yourusername/path/to/` with the absolute path to your vapi-mcp-server directory.

## Example Complete Path

On macOS, your configuration might look like:

```json
{
  "mcp.config.servers": [
    {
      "name": "Vapi MCP Server",
      "command": "node /Users/matthewcage/Documents/AA-GitHub/MCP/vapi-mcp/vapi-mcp-server/dist/index.js"
    }
  ]
}
```

## Testing the Configuration

1. Save the settings
2. Restart Cursor
3. Open a new file
4. Try using one of the Vapi tools:

```
You can now make calls using the Vapi voice AI platform by using the vapi_call tool.
Try listing available assistants with the vapi_assistant tool, action "list".
```

## Troubleshooting

If the tools don't appear:

1. Make sure the server is running (start it with `npm start` in the vapi-mcp-server directory)
2. Check that the path to the server is correct in your Cursor settings
3. Restart Cursor after making changes
4. Check the Cursor console for any errors (Help > Toggle Developer Tools) 