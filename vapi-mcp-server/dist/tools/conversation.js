import { z } from "zod";
export async function createConversationTool() { return { name: "vapi_conversation", description: "Retrieve conversation details", inputSchema: z.object({}), outputSchema: z.object({}), execute: async () => ({ success: true }) }; }
