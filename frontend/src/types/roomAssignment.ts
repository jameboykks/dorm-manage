
export interface RoomAssignment {
  id: number;
  roomId: number;
  studentId: number;
  startDate: string;
  endDate?: string;
  status: 'pending' | 'active' | 'rejected' | 'completed';
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
} 