# Vapi MCP Server

This is the server component for the Vapi Voice AI Tools integration with Cursor via the Model Context Protocol (MCP).

## Setup Guide

### 1. Environment Configuration

Create a `.env` file in this directory with your Vapi API credentials:

```
# Vapi API Keys
VAPI_ORG_ID=your-org-id
VAPI_PRIVATE_KEY=your-private-key
VAPI_KNOWLEDGE_ID=your-knowledge-id
VAPI_JWT_PRIVATE=your-jwt-private

# Environment
NODE_ENV=development
```

### 2. Installation

Install the dependencies:

```bash
npm install
```

### 3. Build

Build the TypeScript code:

```bash
npm run build
```

### 4. Run

Start the server:

```bash
npm start
```

## Cursor MCP Integration

### Proper Configuration (Important!)

To avoid the "Client Closed" error in Cursor, ensure your `.cursor/mcp.json` configuration includes:

1. **The correct working directory (`cwd`)** 
2. **All environment variables**
3. **Correct file path to the server**

Example configuration:

```json
"Vapi Voice AI Tools": {
  "command": "node",
  "type": "stdio",
  "args": [
    "/Users/matthewcage/Documents/AA-GitHub/MCP/vapi-mcp/vapi-mcp-server/dist/index.js"
  ],
  "cwd": "/Users/matthewcage/Documents/AA-GitHub/MCP/vapi-mcp/vapi-mcp-server",
  "env": {
    "VAPI_ORG_ID": "000c3516-6c06-4462-bd9d-2f15d109478e",
    "VAPI_PRIVATE_KEY": "8300521f-7421-4088-8a13-d0df6ea29962",
    "VAPI_KNOWLEDGE_ID": "f2a554b0-fe9a-456e-a7ab-3294d3689534",
    "VAPI_JWT_PRIVATE": "da163ef8-ac5b-43d1-9117-a002aaba0926",
    "NODE_ENV": "development"
  }
}
```

## Critical Configuration Files

### 1. package.json

Ensure your `package.json` has the following settings:

```json
{
  "name": "vapi-mcp-server",
  "version": "1.0.0",
  "description": "MCP Server for Vapi API integration",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc -w & node --watch dist/index.js"
  }
}
```

The **"type": "module"** line is critical for ES modules to work correctly.

### 2. tsconfig.json

Ensure your `tsconfig.json` has the correct module settings:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

## Common Issues and Solutions

### 1. "Client Closed" Error in Cursor

**Problem**: The tools panel in Cursor shows "Client Closed" even though the server appears to be properly configured.

**Solutions**:
- Ensure the `cwd` parameter is set in your mcp.json configuration
- Make sure all environment variables are explicitly passed in the configuration
- Verify the server can run standalone with `node dist/index.js`
- Check for any errors in the console when starting the server
- Make sure the `package.json` has `"type": "module"` set

### 2. ES Module Errors

**Problem**: Errors about imports not being recognized or "Cannot use import outside a module".

**Solutions**:
- Add `"type": "module"` to your `package.json`
- Update `tsconfig.json` to use `"module": "NodeNext"` and `"moduleResolution": "NodeNext"`
- Use `.js` extensions in your imports even in TypeScript files
- Rebuild the project with `npm run build`

### 3. "Cannot find module" Error

**Problem**: Node.js cannot find a module or the main server file.

**Solutions**:
- Ensure you're running from the correct working directory
- Check that all dependencies are installed with `npm install`
- Rebuild the project with `npm run build`
- Verify the file paths in your mcp.json configuration are absolute and correct
- Use `node --trace-warnings dist/index.js` to see detailed error messages

## Debugging

To run the server with additional debugging information:

```bash
node --trace-warnings dist/index.js
```

Or with Node.js inspector:

```bash
node --inspect dist/index.js
```

## MCP Server Structure

The server implements three main Vapi tools:

1. **vapi_call** - Make outbound calls
2. **vapi_assistant** - Manage voice assistants
3. **vapi_conversation** - Retrieve conversation details

Refer to the source code documentation for details on how each tool works. 