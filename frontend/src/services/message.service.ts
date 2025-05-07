import axiosInstance from './axios.config';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const messageService = {
  // Lấy tất cả tin nhắn của một user
  async getMessages(userId: number): Promise<Message[]> {
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể tải tin nhắn');
    }
  },

  // Gửi tin nhắn mới
  async sendMessage(senderId: number, receiverId: number, content: string): Promise<Message> {
    try {
      const response = await axiosInstance.post('/messages', {
        senderId,
        receiverId,
        content
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể gửi tin nhắn');
    }
  },

  // Đánh dấu tin nhắn đã đọc
  async markAsRead(messageId: number, userId: number): Promise<Message> {
    try {
      const response = await axiosInstance.put(`/messages/${messageId}/read`, {
        userId
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể đánh dấu tin nhắn đã đọc');
    }
  },

  // Xóa tin nhắn
  async deleteMessage(messageId: number, userId: number): Promise<void> {
    try {
      const response = await axiosInstance.delete(`/messages/${messageId}`, {
        data: { userId }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể xóa tin nhắn');
    }
  }
};

export type { Message }; 