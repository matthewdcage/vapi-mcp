import { z } from "zod";
export async function createCallTool() { return { name: "vapi_call", description: "Make an outbound call", inputSchema: z.object({}), outputSchema: z.object({}), execute: async () => ({ success: true }) }; }
