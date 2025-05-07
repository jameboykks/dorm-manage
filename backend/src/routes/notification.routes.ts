import { Router } from 'express';
import { getNotifications, markAsRead, deleteNotification, createNotificationEndpoint, markAllAsRead } from '../controllers/notification.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getNotifications);
router.post('/', authenticateToken, createNotificationEndpoint);
router.put('/:id/read', authenticateToken, markAsRead);
router.put('/mark-all-read', authenticateToken, markAllAsRead);
router.delete('/:id', authenticateToken, deleteNotification);

export default router; 