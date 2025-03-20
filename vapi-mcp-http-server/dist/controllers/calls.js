"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCall = exports.listCalls = exports.createCall = void 0;
const index_1 = require("../index");
// Create a new call
const createCall = async (data) => {
    const { phoneNumber, assistantId, assistantConfig, metadata } = data;
    // Validate required fields
    if (!phoneNumber) {
        throw new Error('Phone number is required');
    }
    // Initialize call parameters
    const callParams = {
        phoneNumber: phoneNumber
    };
    // Set assistant details
    if (assistantId) {
        callParams.assistantId = assistantId;
    }
    else if (assistantConfig) {
        callParams.assistant = {
            name: assistantConfig.name || "Default Assistant",
            model: assistantConfig.model === "gpt-4" ? "gpt_4" : "gpt_3_5_turbo",
            voice: {
                provider: "eleven_labs",
                voiceId: assistantConfig.voice || "alloy"
            },
            firstMessage: assistantConfig.firstMessage,
            maxDuration: assistantConfig.maxDuration
        };
    }
    else {
        throw new Error('Either assistantId or assistantConfig is required');
    }
    // Add metadata if provided
    if (metadata) {
        callParams.metadata = metadata;
    }
    // Make the call
    const result = await index_1.vapiClient.calls.create(callParams);
    return {
        success: true,
        callId: result.id,
        status: result.status
    };
};
exports.createCall = createCall;
// List all calls
const listCalls = async (query) => {
    const { limit = 10, offset = 0 } = query;
    const filters = {
        limit: Number(limit),
        offset: Number(offset)
    };
    const calls = await index_1.vapiClient.calls.list(filters);
    const callsArray = Array.isArray(calls) ? calls : [];
    return {
        success: true,
        calls: callsArray,
        pagination: {
            total: callsArray.length,
            limit: filters.limit,
            offset: filters.offset
        }
    };
};
exports.listCalls = listCalls;
// Get a call by ID
const getCall = async (id) => {
    const call = await index_1.vapiClient.calls.get(id);
    return {
        success: true,
        call
    };
};
exports.getCall = getCall;
