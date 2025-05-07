
import axios from 'axios';
import { LoginCredentials, AuthResponse } from '../types/user';

const API_URL = 'http://localhost:3001/api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data.data;
      }
      throw new Error(response.data.message || 'Đăng nhập thất bại');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  },

  logout(): void {
    localStorage.removeItem('user');
  },

  getCurrentUser(): AuthResponse | null {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
}; 