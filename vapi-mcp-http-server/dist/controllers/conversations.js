"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversation = exports.listConversations = void 0;
const index_1 = require("../index");
// List conversations (via calls)
const listConversations = async (query) => {
    const { limit = 10, offset = 0 } = query;
    const filters = {
        limit: Number(limit),
        offset: Number(offset)
    };
    const calls = await index_1.vapiClient.calls.list(filters);
    const callsArray = Array.isArray(calls) ? calls : [];
    // Map calls to conversation summaries
    const conversations = callsArray.map(call => ({
        callId: call.id,
        assistantId: call.assistantId,
        phoneNumber: "unknown", // We don't have direct access to the phone number
        startTime: call.createdAt,
        endTime: call.updatedAt,
        status: call.status,
        messageCount: 0 // We don't have direct access to message count
    }));
    return {
        success: true,
        conversations,
        pagination: {
            total: conversations.length,
            limit: filters.limit,
            offset: filters.offset
        }
    };
};
exports.listConversations = listConversations;
// Get conversation details for a call
const getConversation = async (callId) => {
    // Get call details
    const call = await index_1.vapiClient.calls.get(callId);
    // Create a conversation object
    const conversation = {
        callId: call.id,
        assistantId: call.assistantId,
        phoneNumber: "unknown", // We don't have direct access to the phone number
        startTime: call.createdAt,
        endTime: call.updatedAt,
        status: call.status,
        messages: [] // SDK doesn't provide direct access to messages
    };
    return {
        success: true,
        conversation
    };
};
exports.getConversation = getConversation;
