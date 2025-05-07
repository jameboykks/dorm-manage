import axios from 'axios';
import { authService } from './auth.service';
import { RoomAssignmentData } from '../types/room';

const API_URL = 'http://localhost:3001/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const studentService = {
  async registerStudent(studentData: any) {
    try {
      const response = await axiosInstance.post('/students', studentData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Lỗi khi đăng ký sinh viên');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  async getAllStudents() {
    try {
      const response = await axiosInstance.get('/students');
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Lỗi khi lấy danh sách sinh viên');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  async getStudentById(id: number) {
    try {
      const response = await axiosInstance.get(`/students/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Lỗi khi lấy thông tin sinh viên');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  async getStudentByUserId(userId: number) {
    try {
      const response = await axiosInstance.get(`/students/user/${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Lỗi khi lấy thông tin sinh viên');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  async updateStudent(id: number, studentData: any) {
    try {
      const response = await axiosInstance.put(`/students/${id}`, studentData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Lỗi khi cập nhật thông tin sinh viên');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  async deleteStudent(id: number) {
    try {
      const response = await axiosInstance.delete(`/students/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Lỗi khi xóa sinh viên');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  async updateStudentProfile(studentData: any) {
    try {
      const response = await axiosInstance.put('/students/profile', studentData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Lỗi khi cập nhật thông tin sinh viên');
      }
      throw new Error('Không thể kết nối đến server');
    }
  }
}; 