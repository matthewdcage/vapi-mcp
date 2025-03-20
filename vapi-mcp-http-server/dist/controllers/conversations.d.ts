export declare const listConversations: (query: any) => Promise<{
    success: boolean;
    conversations: {
        callId: string;
        assistantId: string | undefined;
        phoneNumber: string;
        startTime: string;
        endTime: string;
        status: import("@vapi-ai/server-sdk/api").CallStatus | undefined;
        messageCount: number;
    }[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
    };
}>;
export declare const getConversation: (callId: string) => Promise<{
    success: boolean;
    conversation: {
        callId: string;
        assistantId: string | undefined;
        phoneNumber: string;
        startTime: string;
        endTime: string;
        status: import("@vapi-ai/server-sdk/api").CallStatus | undefined;
        messages: never[];
    };
}>;
