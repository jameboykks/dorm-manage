import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Message from '../models/Message';
import { User } from '../models/User';

// Get all messages for a user
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username'] },
        { model: User, as: 'receiver', attributes: ['id', 'username'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Không thể tải tin nhắn. Vui lòng thử lại sau.' });
  }
};

// Send a new message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!content || !receiverId || !senderId) {
      return res.status(400).json({ message: 'Sender ID, receiver ID and content are required' });
    }

    // Check if sender exists
    const sender = await User.findByPk(senderId);
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    // Check if receiver exists
    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      content,
      isRead: false
    });

    const messageWithUsers = await Message.findByPk(message.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username'] },
        { model: User, as: 'receiver', attributes: ['id', 'username'] }
      ]
    });

    res.status(201).json(messageWithUsers);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Không thể gửi tin nhắn. Vui lòng thử lại sau.' });
  }
};

// Mark a message as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const message = await Message.findOne({
      where: {
        id: messageId,
        receiverId: userId
      }
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isRead = true;
    await message.save();

    res.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Không thể đánh dấu tin nhắn đã đọc. Vui lòng thử lại sau.' });
  }
};

// Delete a message
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const message = await Message.findOne({
      where: {
        id: messageId,
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.destroy();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Không thể xóa tin nhắn. Vui lòng thử lại sau.' });
  }
}; 