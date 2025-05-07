import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Box,
  Chip
} from '@mui/material';
import { roomAssignmentService } from '../../services/roomAssignment.service';
import { authService } from '../../services/auth.service';
import { studentService } from '../../services/student.service';
import BackButton from '../../components/BackButton';

interface RoomAssignment {
  id: number;
  roomId: number;
  studentId: number;
  startDate: string;
  endDate?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  room: {
    id: number;
    roomNumber: string;
    building: string;
  };
}

export const RoomHistory: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignments, setAssignments] = useState<RoomAssignment[]>([]);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchRoomHistory();
  }, []);

  const fetchRoomHistory = async () => {
    try {
      setLoading(true);
      setError('');

      if (!currentUser?.user.id) {
        setError('Không tìm thấy thông tin người dùng');
        return;
      }

      // Lấy thông tin sinh viên
      const studentResponse = await studentService.getStudentByUserId(currentUser.user.id);
      const studentId = studentResponse.data.id;

      // Lấy danh sách yêu cầu đăng ký phòng
      const assignmentsResponse = await roomAssignmentService.getRoomAssignments();
      const allAssignments = assignmentsResponse.data || [];

      // Lọc các yêu cầu đăng ký phòng của sinh viên
      const studentAssignments = allAssignments.filter(
        (assignment: RoomAssignment) => assignment.studentId === studentId
      );

      setAssignments(studentAssignments);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tải lịch sử đăng ký phòng');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xét duyệt';
      case 'active':
        return 'Đang ở';
      case 'completed':
        return 'Đã kết thúc';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box display="flex" flexDirection="column" mb={3}>
          <BackButton />
          <Typography variant="h4" gutterBottom>
            Lịch sử đăng ký phòng
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {assignments.length === 0 ? (
          <Alert severity="info">
            Bạn chưa có lịch sử đăng ký phòng nào.
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Phòng</TableCell>
                  <TableCell>Tòa nhà</TableCell>
                  <TableCell>Ngày bắt đầu</TableCell>
                  <TableCell>Ngày kết thúc</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.room.roomNumber}</TableCell>
                    <TableCell>{assignment.room.building}</TableCell>
                    <TableCell>
                      {new Date(assignment.startDate).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      {assignment.endDate
                        ? new Date(assignment.endDate).toLocaleDateString('vi-VN')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(assignment.status)}
                        color={getStatusColor(assignment.status)}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(assignment.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}; 