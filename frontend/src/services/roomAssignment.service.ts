
import axiosInstance from './axios.config';
import { RoomAssignmentData } from '../types/room';

export const roomAssignmentService = {
  assignRoom: async (data: RoomAssignmentData) => {
    try {
      const response = await axiosInstance.post('/room-assignments/assign', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký sinh viên vào phòng');
    }
  },

  getRoomAssignments: async () => {
    try {
      const response = await axiosInstance.get('/room-assignments');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách đăng ký phòng');
    }
  },

  approveAssignment: async (assignmentId: number) => {
    try {
      const response = await axiosInstance.put(`/room-assignments/${assignmentId}/approve`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi phê duyệt đăng ký phòng');
    }
  },

  rejectAssignment: async (assignmentId: number) => {
    try {
      const response = await axiosInstance.put(`/room-assignments/${assignmentId}/reject`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi từ chối đăng ký phòng');
    }
  },

  removeAssignment: async (assignmentId: number) => {
    try {
      const response = await axiosInstance.delete(`/room-assignments/${assignmentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa đăng ký phòng');
    }
  }
}; 