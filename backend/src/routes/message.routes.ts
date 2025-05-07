import express from 'express';
import { getMessages, sendMessage, markAsRead, deleteMessage } from '../controllers/message.controller';

const router = express.Router();

// Get all messages for a user
router.get('/:userId', getMessages);

// Send a new message
router.post('/', sendMessage);

// Mark a message as read
router.put('/:messageId/read', markAsRead);

// Delete a message
router.delete('/:messageId', deleteMessage);

export default router; 