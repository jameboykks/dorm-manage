import axiosInstance from './axios.config';

export const paymentService = {
  // Tạo thanh toán mới
  async createPayment(data: FormData) {
    const response = await axiosInstance.post('/payments', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Lấy danh sách thanh toán của sinh viên
  async getStudentPayments(studentId: number) {
    const response = await axiosInstance.get(`/payments/student/${studentId}`);
    return response.data;
  },

  // Lấy thông tin thanh toán theo ID
  async getPaymentById(id: number) {
    const response = await axiosInstance.get(`/payments/${id}`);
    return response.data;
  },

  // Kiểm tra thanh toán của tháng hiện tại
  async checkCurrentMonthPayment(studentId: number) {
    const response = await axiosInstance.get(`/payments/check-current-month/${studentId}`);
    return response.data;
  },

  // Lấy tất cả thanh toán (cho admin)
  getAllPayments: async () => {
    try {
      const response = await axiosInstance.get('/payments/admin');
      return response.data;
    } catch (error: any) {
      console.error('Error in getAllPayments:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Lỗi khi lấy danh sách thanh toán');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  // Chấp nhận thanh toán
  approvePayment: async (paymentId: number) => {
    try {
      const response = await axiosInstance.post(`/payments/${paymentId}/approve`);
      return response.data;
    } catch (error: any) {
      console.error('Error in approvePayment:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Lỗi khi chấp nhận thanh toán');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  // Từ chối thanh toán
  rejectPayment: async (paymentId: number, reason: string) => {
    try {
      const response = await axiosInstance.post(`/payments/${paymentId}/reject`, { reason });
      return response.data;
    } catch (error: any) {
      console.error('Error in rejectPayment:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Lỗi khi từ chối thanh toán');
      }
      throw new Error('Không thể kết nối đến server');
    }
  }
}; 