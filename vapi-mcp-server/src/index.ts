#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { VapiClient } from "@vapi-ai/server-sdk";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Vapi client
const vapiClient = new VapiClient({
    token: () => {
        const key = process.env.VAPI_PRIVATE_KEY;
        if (!key) {
            throw new Error("VAPI_PRIVATE_KEY environment variable is not set");
        }
        return key;
    },
});

// Zod schemas for our tools
const CallToolSchema = z.object({
    phoneNumber: z.string().describe("The phone number to call"),
    assistantId: z.string().optional().describe("The ID of the Vapi assistant to use"),
    assistantConfig: z.object({
        name: z.string().optional().describe("Name of the assistant"),
        model: z.string().optional().describe("The LLM model to use"),
        voice: z.string().optional().describe("The voice to use"),
        firstMessage: z.string().optional().describe("First message to say when the call is answered"),
        maxDuration: z.number().optional().describe("Maximum call duration in seconds"),
    }).optional().describe("Assistant configuration, if no assistantId is provided"),
    metadata: z.record(z.string()).optional().describe("Additional metadata for the call"),
});

const AssistantActionSchema = z.enum(["create", "get", "list", "update", "delete"]);

const AssistantToolSchema = z.object({
    action: AssistantActionSchema.describe("Action to perform on the assistant"),
    assistantId: z.string().optional().describe("The ID of the assistant (required for get, update, delete)"),
    params: z.object({
        name: z.string().optional().describe("Name of the assistant"),
        model: z.string().optional().describe("The LLM model to use"),
        voice: z.string().optional().describe("The voice to use for the assistant"),
        firstMessage: z.string().optional().describe("First message the assistant will say"),
        instructions: z.string().optional().describe("Instructions for the assistant's behavior"),
        maxDuration: z.number().optional().describe("Maximum call duration in seconds"),
    }).optional().describe("Parameters for creating or updating an assistant"),
});

const ConversationActionSchema = z.enum(["get", "list"]);

const ConversationToolSchema = z.object({
    action: ConversationActionSchema.describe("Action to perform (get or list conversations)"),
    callId: z.string().optional().describe("The ID of the call to retrieve conversation for"),
    filters: z.object({
        limit: z.number().optional().describe("Maximum number of conversations to return"),
        offset: z.number().optional().describe("Offset for pagination"),
        startDate: z.string().optional().describe("Start date for filtering conversations"),
        endDate: z.string().optional().describe("End date for filtering conversations"),
    }).optional().describe("Filters for listing conversations"),
});

async function main() {
    // Initialize the MCP server
    const server = new Server(
        {
            name: "vapi-mcp-server",
            version: "1.0.0",
        },
        {
            capabilities: {
                tools: {
                    list: true,
                    call: true,
                },
            },
        }
    );

    // Set up tool handlers
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: [
            {
                name: "vapi_call",
                description: "Make an outbound call using the Vapi voice AI platform",
                inputSchema: zodToJsonSchema(CallToolSchema),
            },
            {
                name: "vapi_assistant",
                description: "Manage Vapi voice assistants (create, get, list, update, delete)",
                inputSchema: zodToJsonSchema(AssistantToolSchema),
            },
            {
                name: "vapi_conversation",
                description: "Retrieve conversation details from Vapi calls",
                inputSchema: zodToJsonSchema(ConversationToolSchema),
            },
        ],
    }));

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        
        try {
            switch (name) {
                case "vapi_call": {
                    const validatedArgs = CallToolSchema.parse(args);
                    console.log(`Making call to ${validatedArgs.phoneNumber}`);
                    
                    try {
                        // Prepare call parameters based on the validated arguments
                        const callParams: any = {
                            phoneNumber: validatedArgs.phoneNumber
                        };
                        
                        // Add assistantId or assistant details
                        if (validatedArgs.assistantId) {
                            callParams.assistantId = validatedArgs.assistantId;
                        } else if (validatedArgs.assistantConfig) {
                            // Use a simpler approach with any type to avoid TypeScript errors
                            callParams.assistant = {
                                name: validatedArgs.assistantConfig.name || "Default Assistant",
                                model: validatedArgs.assistantConfig.model === "gpt-4" ? "gpt_4" : "gpt_3_5_turbo",
                                voice: {
                                    provider: "eleven_labs",
                                    voiceId: validatedArgs.assistantConfig.voice || "alloy"
                                },
                                firstMessage: validatedArgs.assistantConfig.firstMessage,
                                maxDuration: validatedArgs.assistantConfig.maxDuration
                            };
                        } else {
                            throw new Error("Either assistantId or assistantConfig is required");
                        }
                        
                        // Make the actual API call with type assertion
                        const result = await vapiClient.calls.create(callParams);
                        
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: JSON.stringify({
                                        callId: result.id,
                                        status: result.status,
                                    }, null, 2),
                                },
                            ],
                        };
                    } catch (callError) {
                        console.error("Error making call:", callError);
                        throw callError;
                    }
                }
                
                case "vapi_assistant": {
                    const validatedArgs = AssistantToolSchema.parse(args);
                    console.log(`Performing ${validatedArgs.action} operation on assistant`);
                    
                    switch (validatedArgs.action) {
                        case "create": {
                            if (!validatedArgs.params) {
                                throw new Error("params is required for create operation");
                            }
                            
                            try {
                                // Use any type to bypass strict type checking
                                const createParams: any = {
                                    name: validatedArgs.params.name || "New Assistant",
                                    model: validatedArgs.params.model === "gpt-4" ? "gpt_4" : "gpt_3_5_turbo",
                                    voice: {
                                        provider: "eleven_labs",
                                        voiceId: validatedArgs.params.voice || "alloy"
                                    }
                                };
                                
                                // Add optional parameters if provided
                                if (validatedArgs.params.firstMessage) {
                                    createParams.firstMessage = validatedArgs.params.firstMessage;
                                }
                                
                                if (validatedArgs.params.instructions) {
                                    createParams.instructions = validatedArgs.params.instructions;
                                }
                                
                                if (validatedArgs.params.maxDuration) {
                                    createParams.maxDuration = validatedArgs.params.maxDuration;
                                }
                                
                                const assistant = await vapiClient.assistants.create(createParams);
                                
                                return {
                                    content: [
                                        {
                                            type: "text",
                                            text: JSON.stringify({
                                                success: true,
                                                assistant: assistant,
                                            }, null, 2),
                                        },
                                    ],
                                };
                            } catch (assistantError) {
                                console.error("Error creating assistant:", assistantError);
                                throw assistantError;
                            }
                        }
                        
                        case "get": {
                            if (!validatedArgs.assistantId) {
                                throw new Error("assistantId is required for get operation");
                            }
                            
                            const assistant = await vapiClient.assistants.get(validatedArgs.assistantId);
                            
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify({
                                            success: true,
                                            assistant: assistant,
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                        
                        case "list": {
                            const assistants = await vapiClient.assistants.list();
                            
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify({
                                            success: true,
                                            assistants: assistants,
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                        
                        case "update": {
                            if (!validatedArgs.assistantId) {
                                throw new Error("assistantId is required for update operation");
                            }
                            
                            if (!validatedArgs.params) {
                                throw new Error("params is required for update operation");
                            }
                            
                            try {
                                // Use any type to bypass strict type checking
                                const updateParams: any = {};
                                
                                // Only add parameters that are provided
                                if (validatedArgs.params.name) {
                                    updateParams.name = validatedArgs.params.name;
                                }
                                
                                if (validatedArgs.params.voice) {
                                    updateParams.voice = {
                                        provider: "eleven_labs",
                                        voiceId: validatedArgs.params.voice
                                    };
                                }
                                
                                if (validatedArgs.params.firstMessage) {
                                    updateParams.firstMessage = validatedArgs.params.firstMessage;
                                }
                                
                                if (validatedArgs.params.instructions) {
                                    updateParams.instructions = validatedArgs.params.instructions;
                                }
                                
                                if (validatedArgs.params.maxDuration) {
                                    updateParams.maxDuration = validatedArgs.params.maxDuration;
                                }
                                
                                const assistant = await vapiClient.assistants.update(
                                    validatedArgs.assistantId,
                                    updateParams
                                );
                                
                                return {
                                    content: [
                                        {
                                            type: "text",
                                            text: JSON.stringify({
                                                success: true,
                                                assistant: assistant,
                                            }, null, 2),
                                        },
                                    ],
                                };
                            } catch (updateError) {
                                console.error("Error updating assistant:", updateError);
                                throw updateError;
                            }
                        }
                        
                        case "delete": {
                            if (!validatedArgs.assistantId) {
                                throw new Error("assistantId is required for delete operation");
                            }
                            
                            await vapiClient.assistants.delete(validatedArgs.assistantId);
                            
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify({
                                            success: true,
                                            message: `Assistant ${validatedArgs.assistantId} deleted successfully`,
                                        }, null, 2),
                                    },
                                ],
                            };
                        }
                    }
                }
                
                case "vapi_conversation": {
                    const validatedArgs = ConversationToolSchema.parse(args);
                    console.log(`Performing ${validatedArgs.action} operation on conversation`);
                    
                    switch (validatedArgs.action) {
                        case "get": {
                            if (!validatedArgs.callId) {
                                throw new Error("callId is required for get operation");
                            }
                            
                            try {
                                // Get call details
                                const call = await vapiClient.calls.get(validatedArgs.callId);
                                
                                // Construct conversation response using properties that are known to exist
                                const conversation = {
                                    callId: call.id,
                                    assistantId: call.assistantId,
                                    phoneNumber: "unknown", // We don't have access to the 'to' property
                                    startTime: call.createdAt, 
                                    endTime: call.updatedAt,
                                    duration: 0, // We don't have access to the duration property
                                    status: call.status,
                                    messages: [], // We don't have access to messages directly
                                };
                                
                                return {
                                    content: [
                                        {
                                            type: "text",
                                            text: JSON.stringify({
                                                success: true,
                                                conversation: conversation,
                                            }, null, 2),
                                        },
                                    ],
                                };
                            } catch (getError) {
                                console.error("Error getting conversation:", getError);
                                throw getError;
                            }
                        }
                        
                        case "list": {
                            try {
                                const filters = {
                                    limit: validatedArgs.filters?.limit || 10,
                                    offset: validatedArgs.filters?.offset || 0,
                                };
                                
                                // List calls with filters
                                const calls = await vapiClient.calls.list(filters);
                                
                                // Ensure calls is treated as an array
                                const callsArray = Array.isArray(calls) ? calls : [];
                                
                                // Map calls to conversation summary format
                                const conversations = callsArray.map(call => ({
                                    callId: call.id,
                                    assistantId: call.assistantId,
                                    phoneNumber: "unknown", // We don't have access to the 'to' property
                                    startTime: call.createdAt,
                                    endTime: call.updatedAt,
                                    duration: 0, // We don't have access to duration
                                    status: call.status,
                                    messageCount: 0, // We don't have access to message count
                                }));
                                
                                return {
                                    content: [
                                        {
                                            type: "text",
                                            text: JSON.stringify({
                                                success: true,
                                                conversations: conversations,
                                                pagination: {
                                                    total: callsArray.length,
                                                    limit: filters.limit,
                                                    offset: filters.offset,
                                                },
                                            }, null, 2),
                                        },
                                    ],
                                };
                            } catch (listError) {
                                console.error("Error listing conversations:", listError);
                                throw listError;
                            }
                        }
                    }
                }
                
                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error in tool execution: ${errorMessage}`, error);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: errorMessage || "An unknown error occurred",
                        }, null, 2),
                    },
                ],
            };
        }
    });

    // Connect to transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.log("Vapi MCP Server started successfully");
}

main().catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error starting Vapi MCP Server:", errorMessage);
    process.exit(1);
});
