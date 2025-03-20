import express, { Request, Response, NextFunction } from 'express';
import { createCall, listCalls, getCall } from '../controllers/calls';

const router = express.Router();

// POST /api/calls - Create a new call
router.post('/', function(req: Request, res: Response, next: NextFunction) {
  createCall(req.body)
    .then(result => {
      res.status(201).json(result);
    })
    .catch(next);
});

// GET /api/calls - List calls
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  listCalls(req.query)
    .then(result => {
      res.json(result);
    })
    .catch(next);
});

// GET /api/calls/:id - Get a call by ID
router.get('/:id', function(req: Request, res: Response, next: NextFunction) {
  getCall(req.params.id)
    .then(result => {
      if (!result) {
        return res.status(404).json({ error: 'Call not found' });
      }
      res.json(result);
    })
    .catch(next);
});

export default router; 