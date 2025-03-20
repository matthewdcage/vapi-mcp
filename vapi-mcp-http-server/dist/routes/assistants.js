"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assistants_1 = require("../controllers/assistants");
const router = express_1.default.Router();
// POST /api/assistants - Create a new assistant
router.post('/', function (req, res, next) {
    (0, assistants_1.createAssistant)(req.body)
        .then(result => {
        res.status(201).json(result);
    })
        .catch(next);
});
// GET /api/assistants - List assistants
router.get('/', function (req, res, next) {
    (0, assistants_1.listAssistants)(req.query)
        .then(result => {
        res.json(result);
    })
        .catch(next);
});
// GET /api/assistants/:id - Get an assistant by ID
router.get('/:id', function (req, res, next) {
    (0, assistants_1.getAssistant)(req.params.id)
        .then(result => {
        if (!result) {
            return res.status(404).json({ error: 'Assistant not found' });
        }
        res.json(result);
    })
        .catch(next);
});
// PUT /api/assistants/:id - Update an assistant
router.put('/:id', function (req, res, next) {
    (0, assistants_1.updateAssistant)(req.params.id, req.body)
        .then(result => {
        res.json(result);
    })
        .catch(next);
});
// DELETE /api/assistants/:id - Delete an assistant
router.delete('/:id', function (req, res, next) {
    (0, assistants_1.deleteAssistant)(req.params.id)
        .then(result => {
        res.json(result);
    })
        .catch(next);
});
exports.default = router;
