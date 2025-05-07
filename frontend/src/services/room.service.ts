import axiosInstance from './axios.config';
import { Room } from '../types/room';

export const roomService = {
  async registerRoom(roomData: any) {
    try {
      const response = await axiosInstance.post('/rooms', roomData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Lỗi khi đăng ký phòng');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  async getAllRooms() {
    try {
      const response = await axiosInstance.get('/rooms');
      return response.data;
    } catch (error: any) {
      console.error('Error in getAllRooms:', error);
      if (error.response) {
        // Server trả về lỗi với status code
        throw new Error(error.response.data.message || 'Lỗi server');
      } else if (error.request) {
        // Không nhận được response từ server
        throw new Error('Không thể kết nối đến server');
      } else {
        // Lỗi khi thiết lập request
        throw new Error('Lỗi khi gửi yêu cầu');
      }
    }
  },

  async getRoomById(id: number) {
    try {
      const response = await axiosInstance.get(`/rooms/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Lỗi khi lấy thông tin phòng');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  async updateRoom(id: number, roomData: any) {
    try {
      const response = await axiosInstance.put(`/rooms/${id}`, roomData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Lỗi khi cập nhật thông tin phòng');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  async deleteRoom(id: number) {
    try {
      const response = await axiosInstance.delete(`/rooms/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Lỗi khi xóa phòng');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  async createRoom(roomData: any) {
    try {
      const response = await axiosInstance.post('/rooms', roomData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Lỗi khi tạo phòng mới');
      }
      throw new Error('Không thể kết nối đến server');
    }
  }
}; 