import axios from 'axios';
import { authService } from './auth.service';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface CreateNotificationDto {
  title: string;
  content: string;
  type: string;
  recipientId: string;
}

export interface Notification {
  id: number;
  title: string;
  content: string;
  type: string;
  recipientId: string;
  isRead: boolean;
  createdAt: string;
}

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api/notifications`,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = authService.getCurrentUser();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class NotificationService {
  async createNotification(data: CreateNotificationDto) {
    const response = await axiosInstance.post('/', data);
    return response.data;
  }

  async getNotifications() {
    const response = await axiosInstance.get('/');
    return response.data;
  }

  async getNotificationById(id: number) {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  }

  async deleteNotification(id: number) {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  }

  async markAsRead(id: number) {
    const response = await axiosInstance.patch(`/${id}/read`);
    return response.data;
  }

  async markAllAsRead() {
    const response = await axiosInstance.put('/mark-all-read');
    return response.data;
  }
}

export const notificationService = new NotificationService();

export default notificationService; 