import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { VapiClient } from '@vapi-ai/server-sdk';

// Import routes
import callsRouter from './routes/calls';
import assistantsRouter from './routes/assistants';
import conversationsRouter from './routes/conversations';

// Load environment variables
dotenv.config();

// Initialize the vapi client
export const vapiClient = new VapiClient({
  token: () => process.env.VAPI_PRIVATE_KEY || ""
});

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/calls', callsRouter);
app.use('/api/assistants', assistantsRouter);
app.use('/api/conversations', conversationsRouter);

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
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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