export declare const createAssistant: (data: any) => Promise<{
    success: boolean;
    assistant: import("@vapi-ai/server-sdk/api").Assistant;
}>;
export declare const listAssistants: (query: any) => Promise<{
    success: boolean;
    assistants: import("@vapi-ai/server-sdk/api").Assistant[];
}>;
export declare const getAssistant: (id: string) => Promise<{
    success: boolean;
    assistant: import("@vapi-ai/server-sdk/api").Assistant;
}>;
export declare const updateAssistant: (id: string, data: any) => Promise<{
    success: boolean;
    assistant: import("@vapi-ai/server-sdk/api").Assistant;
}>;
export declare const deleteAssistant: (id: string) => Promise<{
    success: boolean;
    message: string;
}>;
