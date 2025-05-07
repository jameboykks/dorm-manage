
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'student';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 