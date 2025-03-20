import { vapiClient } from '../index';

// Create a new call
export const createCall = async (data: any) => {
  const { phoneNumber, assistantId, assistantConfig, metadata } = data;
  
  // Validate required fields
  if (!phoneNumber) {
    throw new Error('Phone number is required');
  }
  
  // Initialize call parameters
  const callParams: any = {
    phoneNumber: phoneNumber
  };
  
  // Set assistant details
  if (assistantId) {
    callParams.assistantId = assistantId;
  } else if (assistantConfig) {
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
  } else {
    throw new Error('Either assistantId or assistantConfig is required');
  }
  
  // Add metadata if provided
  if (metadata) {
    callParams.metadata = metadata;
  }
  
  // Make the call
  const result = await vapiClient.calls.create(callParams);
  
  return {
    success: true,
    callId: result.id,
    status: result.status
  };
};

// List all calls
export const listCalls = async (query: any) => {
  const { limit = 10, offset = 0 } = query;
  
  const filters = {
    limit: Number(limit),
    offset: Number(offset)
  };
  
  const calls = await vapiClient.calls.list(filters);
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

// Get a call by ID
export const getCall = async (id: string) => {
  const call = await vapiClient.calls.get(id);
  
  return {
    success: true,
    call
  };
}; 