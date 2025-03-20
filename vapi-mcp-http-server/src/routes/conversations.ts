import express, { Request, Response, NextFunction } from 'express';
import { listConversations, getConversation } from '../controllers/conversations';

const router = express.Router();

// GET /api/conversations - List conversations
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  listConversations(req.query)
    .then(result => {
      res.json(result);
    })
    .catch(next);
});

// GET /api/conversations/:callId - Get conversation by call ID
router.get('/:callId', function(req: Request, res: Response, next: NextFunction) {
  getConversation(req.params.callId)
    .then(result => {
      if (!result) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      res.json(result);
    })
    .catch(next);
});

export default router; 