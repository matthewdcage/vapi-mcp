"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const calls_1 = require("../controllers/calls");
const router = express_1.default.Router();
// POST /api/calls - Create a new call
router.post('/', function (req, res, next) {
    (0, calls_1.createCall)(req.body)
        .then(result => {
        res.status(201).json(result);
    })
        .catch(next);
});
// GET /api/calls - List calls
router.get('/', function (req, res, next) {
    (0, calls_1.listCalls)(req.query)
        .then(result => {
        res.json(result);
    })
        .catch(next);
});
// GET /api/calls/:id - Get a call by ID
router.get('/:id', function (req, res, next) {
    (0, calls_1.getCall)(req.params.id)
        .then(result => {
        if (!result) {
            return res.status(404).json({ error: 'Call not found' });
        }
        res.json(result);
    })
        .catch(next);
});
exports.default = router;
