import { vapiClient } from '../index';

// Create a new assistant
export const createAssistant = async (data: any) => {
  const {
    name,
    model,
    voice,
    firstMessage,
    instructions,
    maxDuration
  } = data;
  
  // Validate required fields
  if (!name) {
    throw new Error('Name is required');
  }
  
  // Set up assistant parameters
  const createParams: any = {
    name: name,
    model: model === "gpt-4" ? "gpt_4" : "gpt_3_5_turbo",
    voice: {
      provider: "eleven_labs",
      voiceId: voice || "alloy"
    }
  };
  
  // Add optional parameters
  if (firstMessage) createParams.firstMessage = firstMessage;
  if (instructions) createParams.instructions = instructions;
  if (maxDuration) createParams.maxDuration = maxDuration;
  
  // Create the assistant
  const assistant = await vapiClient.assistants.create(createParams);
  
  return {
    success: true,
    assistant
  };
};

// List all assistants
export const listAssistants = async (query: any) => {
  const assistants = await vapiClient.assistants.list();
  
  return {
    success: true,
    assistants: Array.isArray(assistants) ? assistants : []
  };
};

// Get an assistant by ID
export const getAssistant = async (id: string) => {
  const assistant = await vapiClient.assistants.get(id);
  
  return {
    success: true,
    assistant
  };
};

// Update an assistant
export const updateAssistant = async (id: string, data: any) => {
  const {
    name,
    voice,
    firstMessage,
    instructions,
    maxDuration
  } = data;
  
  // Set up update parameters
  const updateParams: any = {};
  
  // Add parameters only if they're provided
  if (name) updateParams.name = name;
  if (voice) {
    updateParams.voice = {
      provider: "eleven_labs",
      voiceId: voice
    };
  }
  if (firstMessage) updateParams.firstMessage = firstMessage;
  if (instructions) updateParams.instructions = instructions;
  if (maxDuration) updateParams.maxDuration = maxDuration;
  
  // Update the assistant
  const assistant = await vapiClient.assistants.update(id, updateParams);
  
  return {
    success: true,
    assistant
  };
};

// Delete an assistant
export const deleteAssistant = async (id: string) => {
  await vapiClient.assistants.delete(id);
  
  return {
    success: true,
    message: `Assistant ${id} deleted successfully`
  };
}; 