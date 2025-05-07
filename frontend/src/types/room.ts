export interface Room {
  id: number;
  roomNumber: string;
  building: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  type: string;
  price: number;
  status: string;
  gender: string;
}

export interface RoomAssignmentData {
  roomId: number;
  studentId: number;
  startDate: string;
  endDate: string;
  isAdmin?: boolean;
}

export interface RoomRegistrationForm {
  startDate: string;
  endDate: string;
  paymentMethod: string;
  agreement: boolean;
} 