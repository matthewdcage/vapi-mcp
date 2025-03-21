import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { VapiClient } from '@vapi-ai/server-sdk';

// Import routes
import callsRouter from './routes/calls';
import assistantsRouter from './routes/assistants';
import conversationsRouter from './routes/conversations';

// Load environment variables
dotenv.config();

// Initialize the vapi client
export const vapiClient = new VapiClient({
  token: () => process.env.VAPI_PRIVATE_KEY || ""
});

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MCP Server-Sent Events endpoint
app.get('/sse', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send the initial endpoint event as required by MCP protocol
  res.write(`event: endpoint\ndata: /mcp-messages\n\n`);
  
  // Keep the connection alive
  const keepAliveInterval = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 30000);
  
  // Handle client disconnect
  req.on('close', () => {
    clearInterval(keepAliveInterval);
    console.log('SSE connection closed');
  });
});

// MCP messages endpoint for client to post messages
app.post('/mcp-messages', express.json(), async (req: express.Request, res: express.Response) => {
  try {
    const message = req.body;
    console.log('Received MCP message:', message);
    
    // Check if it's a valid JSON-RPC 2.0 message
    if (message.jsonrpc !== '2.0') {
      return res.status(400).json({
        jsonrpc: '2.0',
        id: message.id,
        error: {
          code: -32600,
          message: 'Invalid Request: Not a valid JSON-RPC 2.0 message'
        }
      });
    }
    
    // Handle different MCP protocol methods
    if (message.method === 'mcp/list_capabilities') {
      // Return MCP capabilities
      return res.json({
        jsonrpc: '2.0',
        id: message.id,
        result: {
          capabilities: {
            tools: true,
            resources: true,
            prompts: true,
            roots: false
          },
          schema_version: '2024-11-05'
        }
      });
    } else if (message.method === 'tools/list') {
      // Return available tools that map to our API endpoints
      return res.json({
        jsonrpc: '2.0',
        id: message.id,
        result: {
          tools: [
            {
              name: 'createAssistant',
              description: 'Create a new voice assistant',
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name of the assistant'
                  },
                  model: {
                    type: 'string',
                    description: 'LLM model to use'
                  },
                  voice: {
                    type: 'string',
                    description: 'Voice to use'
                  },
                  firstMessage: {
                    type: 'string',
                    description: 'First message to say'
                  }
                },
                required: ['name', 'model', 'voice']
              }
            },
            {
              name: 'makeCall',
              description: 'Make an outbound call',
              schema: {
                type: 'object',
                properties: {
                  phoneNumber: {
                    type: 'string',
                    description: 'Phone number to call'
                  },
                  assistantId: {
                    type: 'string',
                    description: 'ID of the assistant to use'
                  },
                  metadata: {
                    type: 'object',
                    description: 'Additional metadata for the call'
                  }
                },
                required: ['phoneNumber', 'assistantId']
              }
            },
            {
              name: 'getAssistants',
              description: 'List all assistants',
              schema: {
                type: 'object',
                properties: {}
              }
            },
            {
              name: 'getAssistant',
              description: 'Get a specific assistant',
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'ID of the assistant'
                  }
                },
                required: ['id']
              }
            },
            {
              name: 'getCalls',
              description: 'List all calls',
              schema: {
                type: 'object',
                properties: {}
              }
            },
            {
              name: 'getCall',
              description: 'Get a specific call',
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'ID of the call'
                  }
                },
                required: ['id']
              }
            }
          ]
        }
      });
    } else if (message.method === 'prompts/list') {
      // Return available prompts
      return res.json({
        jsonrpc: '2.0',
        id: message.id,
        result: {
          prompts: [
            {
              id: "vapi-assistant-prompt",
              name: "Vapi Assistant Prompt",
              description: "A prompt for creating a Vapi voice assistant"
            }
          ]
        }
      });
    } else if (message.method === 'prompts/get') {
      // Return a specific prompt
      const promptId = message.params.id;
      if (promptId === "vapi-assistant-prompt") {
        return res.json({
          jsonrpc: '2.0',
          id: message.id,
          result: {
            prompt: {
              id: "vapi-assistant-prompt",
              name: "Vapi Assistant Prompt",
              description: "A prompt for creating a Vapi voice assistant",
              content: "You are a helpful voice assistant powered by Vapi."
            }
          }
        });
      } else {
        return res.json({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            code: -32602,
            message: `Prompt not found: ${promptId}`
          }
        });
      }
    } else if (message.method === 'resources/list') {
      // Return available resources
      return res.json({
        jsonrpc: '2.0',
        id: message.id,
        result: {
          resources: [
            {
              uri: "vapi-docs",
              name: "Vapi Documentation",
              description: "Documentation for the Vapi API"
            }
          ]
        }
      });
    } else if (message.method === 'resources/get') {
      // Return a specific resource
      const resourceUri = message.params.uri;
      if (resourceUri === "vapi-docs") {
        return res.json({
          jsonrpc: '2.0',
          id: message.id,
          result: {
            content: "# Vapi Documentation\n\nThis is the documentation for the Vapi voice assistant API."
          }
        });
      } else {
        return res.json({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            code: -32602,
            message: `Resource not found: ${resourceUri}`
          }
        });
      }
    } else if (message.method === 'tools/call') {
      // Handle tool calls by mapping to our API
      const { name, arguments: args } = message.params;
      
      let result;
      try {
        if (name === 'createAssistant') {
          // Map to POST /api/assistants
          const response = await fetch(`http://localhost:${port}/api/assistants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(args)
          });
          result = await response.json();
        } else if (name === 'makeCall') {
          // Map to POST /api/calls
          const response = await fetch(`http://localhost:${port}/api/calls`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(args)
          });
          result = await response.json();
        } else if (name === 'getAssistants') {
          // Map to GET /api/assistants
          const response = await fetch(`http://localhost:${port}/api/assistants`);
          result = await response.json();
        } else if (name === 'getAssistant') {
          // Map to GET /api/assistants/:id
          const response = await fetch(`http://localhost:${port}/api/assistants/${args.id}`);
          result = await response.json();
        } else if (name === 'getCalls') {
          // Map to GET /api/calls
          const response = await fetch(`http://localhost:${port}/api/calls`);
          result = await response.json();
        } else if (name === 'getCall') {
          // Map to GET /api/calls/:id
          const response = await fetch(`http://localhost:${port}/api/calls/${args.id}`);
          result = await response.json();
        } else {
          throw new Error(`Unknown tool: ${name}`);
        }
        
        return res.json({
          jsonrpc: '2.0',
          id: message.id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result)
              }
            ]
          }
        });
      } catch (error: any) {
        console.error('Error handling tool call:', error);
        return res.json({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            code: -32603,
            message: `Internal error: ${error.message}`
          }
        });
      }
    } else {
      // Unsupported method
      return res.json({
        jsonrpc: '2.0',
        id: message.id,
        error: {
          code: -32601,
          message: `Method not found: ${message.method}`
        }
      });
    }
  } catch (error: any) {
    console.error('Error processing MCP message:', error);
    return res.status(500).json({
      jsonrpc: '2.0',
      id: req.body?.id || null,
      error: {
        code: -32603,
        message: `Internal error: ${error.message}`
      }
    });
  }
});

// Original API routes
app.use('/api/calls', callsRouter);
app.use('/api/assistants', assistantsRouter);
app.use('/api/conversations', conversationsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Vapi MCP HTTP Server',
    version: '1.0.0',
    description: 'HTTP server for Vapi voice AI integration with MCP'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'An unexpected error occurred'
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Vapi MCP HTTP Server running on port ${port}`);
}); 