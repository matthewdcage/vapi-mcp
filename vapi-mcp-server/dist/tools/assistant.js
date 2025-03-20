import { z } from "zod";
export async function createAssistantTool() { return { name: "vapi_assistant", description: "Manage voice assistants", inputSchema: z.object({}), outputSchema: z.object({}), execute: async () => ({ success: true }) }; }
