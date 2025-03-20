export declare const createCall: (data: any) => Promise<{
    success: boolean;
    callId: string;
    status: import("@vapi-ai/server-sdk/api").CallStatus | undefined;
}>;
export declare const listCalls: (query: any) => Promise<{
    success: boolean;
    calls: import("@vapi-ai/server-sdk/api").Call[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
    };
}>;
export declare const getCall: (id: string) => Promise<{
    success: boolean;
    call: import("@vapi-ai/server-sdk/api").Call;
}>;
