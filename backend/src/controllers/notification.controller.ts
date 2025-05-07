import { Response } from 'express';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../types/auth';
import { Op } from 'sequelize';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const notifications = await Notification.findAll({
      where: {
        [Op.or]: [
          { userId: req.user.id },
          { userId: null } // General notifications for all users
        ]
      },
      order: [['createdAt', 'DESC']],
    });

    // Transform the data to match the expected format
    const transformedNotifications = notifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      content: notification.content,
      type: notification.type,
      isRead: notification.isRead,
      createdAt: notification.createdAt
    }));

    res.json(transformedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const notification = await Notification.findOne({
      where: { id, userId: req.user.id },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({ isRead: true });
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const notification = await Notification.findOne({
      where: { id, userId: req.user.id },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.destroy();
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
};

export const createNotification = async (userId: number, title: string, content: string, type: string = 'general') => {
  try {
    return await Notification.create({
      userId,
      title,
      content,
      type,
      isRead: false,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const createNotificationEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title, content, type, recipientId } = req.body;
    console.log('Creating notification with data:', { title, content, type, recipientId });

    // Validate required fields
    if (!title || !content || !type || !recipientId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create notification
    const notification = await Notification.create({
      userId: recipientId === 'all' ? null : parseInt(recipientId),
      title,
      content,
      type,
      isRead: false,
    });

    res.status(201).json(notification);
  } catch (error: any) {
    console.error('Error creating notification:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      sql: error.sql,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ 
      message: 'Error creating notification',
      error: error.message 
    });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await Notification.update(
      { isRead: true },
      {
        where: {
          [Op.or]: [
            { userId: req.user.id },
            { userId: null }
          ],
          isRead: false
        }
      }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Error marking all notifications as read' });
  }
}; 