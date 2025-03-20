"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAssistant = exports.updateAssistant = exports.getAssistant = exports.listAssistants = exports.createAssistant = void 0;
const index_1 = require("../index");
// Create a new assistant
const createAssistant = async (data) => {
    const { name, model, voice, firstMessage, instructions, maxDuration } = data;
    // Validate required fields
    if (!name) {
        throw new Error('Name is required');
    }
    // Set up assistant parameters
    const createParams = {
        name: name,
        model: model === "gpt-4" ? "gpt_4" : "gpt_3_5_turbo",
        voice: {
            provider: "eleven_labs",
            voiceId: voice || "alloy"
        }
    };
    // Add optional parameters
    if (firstMessage)
        createParams.firstMessage = firstMessage;
    if (instructions)
        createParams.instructions = instructions;
    if (maxDuration)
        createParams.maxDuration = maxDuration;
    // Create the assistant
    const assistant = await index_1.vapiClient.assistants.create(createParams);
    return {
        success: true,
        assistant
    };
};
exports.createAssistant = createAssistant;
// List all assistants
const listAssistants = async (query) => {
    const assistants = await index_1.vapiClient.assistants.list();
    return {
        success: true,
        assistants: Array.isArray(assistants) ? assistants : []
    };
};
exports.listAssistants = listAssistants;
// Get an assistant by ID
const getAssistant = async (id) => {
    const assistant = await index_1.vapiClient.assistants.get(id);
    return {
        success: true,
        assistant
    };
};
exports.getAssistant = getAssistant;
// Update an assistant
const updateAssistant = async (id, data) => {
    const { name, voice, firstMessage, instructions, maxDuration } = data;
    // Set up update parameters
    const updateParams = {};
    // Add parameters only if they're provided
    if (name)
        updateParams.name = name;
    if (voice) {
        updateParams.voice = {
            provider: "eleven_labs",
            voiceId: voice
        };
    }
    if (firstMessage)
        updateParams.firstMessage = firstMessage;
    if (instructions)
        updateParams.instructions = instructions;
    if (maxDuration)
        updateParams.maxDuration = maxDuration;
    // Update the assistant
    const assistant = await index_1.vapiClient.assistants.update(id, updateParams);
    return {
        success: true,
        assistant
    };
};
exports.updateAssistant = updateAssistant;
// Delete an assistant
const deleteAssistant = async (id) => {
    await index_1.vapiClient.assistants.delete(id);
    return {
        success: true,
        message: `Assistant ${id} deleted successfully`
    };
};
exports.deleteAssistant = deleteAssistant;
