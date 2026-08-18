import express from 'express';
import * as chatController from '../controllers/chat.controller.js';

const router = express.Router({ mergeParams: true });

router.get('/:moduleType', chatController.getChatHistory);
router.delete('/:moduleType', chatController.clearChatHistory);

export default router;
