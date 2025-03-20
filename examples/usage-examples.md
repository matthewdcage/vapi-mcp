# Vapi MCP Usage Examples

This document provides examples of how to use the Vapi MCP tools from Cursor.

## Outbound Calls

### Basic Call

```
Use the Vapi Voice AI platform to call my colleague at +1234567890.
```

Cursor will use the `vapi_call` tool with:

```json
{
  "phoneNumber": "+1234567890"
}
```

### Call with Existing Assistant

```
Call +1234567890 using the Sales Assistant with ID assistant_abc123.
```

Cursor will use the `vapi_call` tool with:

```json
{
  "phoneNumber": "+1234567890",
  "assistantId": "assistant_abc123"
}
```

### Call with Custom Assistant Configuration

```
Call +1234567890 with a new assistant using the Alloy voice that introduces itself as a support agent.
```

Cursor will use the `vapi_call` tool with:

```json
{
  "phoneNumber": "+1234567890",
  "assistantConfig": {
    "voice": "alloy",
    "firstMessage": "Hello, this is the support team calling. How may I help you today?"
  }
}
```

## Assistant Management

### Creating an Assistant

```
Create a new voice assistant for sales calls with the Nova voice that introduces itself as Sarah from the sales team.
```

Cursor will use the `vapi_assistant` tool with:

```json
{
  "action": "create",
  "params": {
    "name": "Sales Assistant",
    "voice": "nova",
    "firstMessage": "Hello, this is Sarah from the sales team. Do you have a moment to talk about our new offerings?",
    "model": "gpt-4"
  }
}
```

### Listing All Assistants

```
Show me a list of all my voice assistants.
```

Cursor will use the `vapi_assistant` tool with:

```json
{
  "action": "list"
}
```

### Getting Assistant Details

```
Show me the details of assistant_abc123.
```

Cursor will use the `vapi_assistant` tool with:

```json
{
  "action": "get",
  "assistantId": "assistant_abc123"
}
```

### Updating an Assistant

```
Update the Sales Assistant with ID assistant_abc123 to use the Echo voice instead.
```

Cursor will use the `vapi_assistant` tool with:

```json
{
  "action": "update",
  "assistantId": "assistant_abc123",
  "params": {
    "voice": "echo"
  }
}
```

### Deleting an Assistant

```
Delete the assistant with ID assistant_abc123.
```

Cursor will use the `vapi_assistant` tool with:

```json
{
  "action": "delete",
  "assistantId": "assistant_abc123"
}
```

## Conversation Management

### Retrieving a Conversation

```
Show me the transcript of call call_xyz789.
```

Cursor will use the `vapi_conversation` tool with:

```json
{
  "action": "get",
  "callId": "call_xyz789"
}
```

### Listing Recent Conversations

```
Show me a list of my 5 most recent calls.
```

Cursor will use the `vapi_conversation` tool with:

```json
{
  "action": "list",
  "filters": {
    "limit": 5
  }
}
```

### Filtering Conversations by Date

```
Show me calls made between January 1st and January 15th, 2023.
```

Cursor will use the `vapi_conversation` tool with:

```json
{
  "action": "list",
  "filters": {
    "startDate": "2023-01-01T00:00:00Z",
    "endDate": "2023-01-15T23:59:59Z"
  }
}
```

## Common Workflows

### Complete Sales Workflow

```
1. Create a new assistant for product demos with the Alloy voice
2. Use this assistant to call +1234567890
3. After the call finishes, retrieve the conversation transcript
```

This will involve three sequential tool calls:

1. `vapi_assistant` with action "create"
2. `vapi_call` with the newly created assistant ID
3. `vapi_conversation` with action "get" and the call ID returned from step 2

### Customer Support Workflow

```
1. List my existing assistants
2. Use the Support Assistant to call customer +1234567890
3. Retrieve the conversation transcript
```

This will involve:

1. `vapi_assistant` with action "list"
2. `vapi_call` with the Support Assistant ID
3. `vapi_conversation` with action "get" and the resulting call ID 