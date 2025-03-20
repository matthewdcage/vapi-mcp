"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conversations_1 = require("../controllers/conversations");
const router = express_1.default.Router();
// GET /api/conversations - List conversations
router.get('/', function (req, res, next) {
    (0, conversations_1.listConversations)(req.query)
        .then(result => {
        res.json(result);
    })
        .catch(next);
});
// GET /api/conversations/:callId - Get conversation by call ID
router.get('/:callId', function (req, res, next) {
    (0, conversations_1.getConversation)(req.params.callId)
        .then(result => {
        if (!result) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        res.json(result);
    })
        .catch(next);
});
exports.default = router;
