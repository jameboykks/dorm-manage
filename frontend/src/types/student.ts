export interface Student {
  id: number;
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  year?: number;
  userId?: number;
  userData?: {
    id: number;
    username: string;
    email: string | null;
    role: string;
  };
  createdAt?: string;
  updatedAt?: string;
} 