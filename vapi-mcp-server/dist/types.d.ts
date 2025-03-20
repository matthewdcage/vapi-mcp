export interface VapiVoice {
    provider: string;
    voiceId: string;
}
export interface VapiAssistant {
    id: string;
    name: string;
    model: string;
    voice: VapiVoice;
    firstMessage?: string;
    instructions?: string;
    maxDuration?: number;
    createdAt: string;
    updatedAt: string;
}
export interface VapiMessage {
    id: string;
    role: "assistant" | "user";
    content: string;
    timestamp: string;
}
export interface VapiCall {
    id: string;
    assistantId: string;
    to: string;
    from: string;
    status: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
    messageCount?: number;
    metadata?: Record<string, string>;
}
export interface VapiListResponse<T> {
    data: T[];
    total: number;
    limit: number;
    offset: number;
}
export interface CreateCallRequest {
    phoneNumber: string;
    assistantId?: string;
    assistant?: {
        name?: string;
        model?: string;
        voice?: VapiVoice;
        firstMessage?: string;
        maxDuration?: number;
    };
    metadata?: Record<string, string>;
}
export interface CreateAssistantRequest {
    name: string;
    model: string;
    voice: VapiVoice;
    firstMessage?: string;
    instructions?: string;
    maxDuration?: number;
}
export interface UpdateAssistantRequest {
    name?: string;
    voice?: VapiVoice;
    firstMessage?: string;
    instructions?: string;
    maxDuration?: number;
}
export interface ListCallsParams {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
}
export interface CallToolResponse {
    callId: string;
    status: string;
}
export interface AssistantToolResponse {
    success: boolean;
    assistant?: any;
    assistants?: any[];
    message?: string;
    error?: string;
}
export interface ConversationGetResponse {
    success: boolean;
    conversation?: {
        callId: string;
        assistantId: string;
        phoneNumber: string;
        startTime?: string;
        endTime?: string;
        duration?: number;
        status: string;
        messages: any[];
    };
    error?: string;
}
export interface ConversationListResponse {
    success: boolean;
    conversations?: Array<{
        callId: string;
        assistantId: string;
        phoneNumber: string;
        startTime?: string;
        endTime?: string;
        duration?: number;
        status: string;
        messageCount: number;
    }>;
    pagination?: {
        total: number;
        limit: number;
        offset: number;
    };
    error?: string;
}
