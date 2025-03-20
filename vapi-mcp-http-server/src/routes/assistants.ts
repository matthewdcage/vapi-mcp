import express, { Request, Response, NextFunction } from 'express';
import { createAssistant, listAssistants, getAssistant, updateAssistant, deleteAssistant } from '../controllers/assistants';

const router = express.Router();

// POST /api/assistants - Create a new assistant
router.post('/', function(req: Request, res: Response, next: NextFunction) {
  createAssistant(req.body)
    .then(result => {
      res.status(201).json(result);
    })
    .catch(next);
});

// GET /api/assistants - List assistants
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  listAssistants(req.query)
    .then(result => {
      res.json(result);
    })
    .catch(next);
});

// GET /api/assistants/:id - Get an assistant by ID
router.get('/:id', function(req: Request, res: Response, next: NextFunction) {
  getAssistant(req.params.id)
    .then(result => {
      if (!result) {
        return res.status(404).json({ error: 'Assistant not found' });
      }
      res.json(result);
    })
    .catch(next);
});

// PUT /api/assistants/:id - Update an assistant
router.put('/:id', function(req: Request, res: Response, next: NextFunction) {
  updateAssistant(req.params.id, req.body)
    .then(result => {
      res.json(result);
    })
    .catch(next);
});

// DELETE /api/assistants/:id - Delete an assistant
router.delete('/:id', function(req: Request, res: Response, next: NextFunction) {
  deleteAssistant(req.params.id)
    .then(result => {
      res.json(result);
    })
    .catch(next);
});

export default router; 