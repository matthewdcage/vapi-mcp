"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vapiClient = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const server_sdk_1 = require("@vapi-ai/server-sdk");
// Import routes
const calls_1 = __importDefault(require("./routes/calls"));
const assistants_1 = __importDefault(require("./routes/assistants"));
const conversations_1 = __importDefault(require("./routes/conversations"));
// Load environment variables
dotenv_1.default.config();
// Initialize the vapi client
exports.vapiClient = new server_sdk_1.VapiClient({
    token: () => process.env.VAPI_PRIVATE_KEY || ""
});
// Initialize Express app
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Routes
app.use('/api/calls', calls_1.default);
app.use('/api/assistants', assistants_1.default);
app.use('/api/conversations', conversations_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Root route
app.get('/', (req, res) => {
    res.json({
        name: 'Vapi MCP HTTP Server',
        version: '1.0.0',
        description: 'HTTP server for Vapi voice AI integration with MCP'
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'An unexpected error occurred'
    });
});
// Start the server
app.listen(port, () => {
    console.log(`Vapi MCP HTTP Server running on port ${port}`);
});
