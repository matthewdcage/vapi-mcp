import { z } from "zod";
export interface Tool {
    name: string;
    description: string;
    inputSchema: z.ZodType<any>;
    outputSchema: z.ZodType<any>;
    execute: (input: any) => Promise<any>;
}
