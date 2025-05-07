import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import { roomAssignmentService } from '../../services/roomAssignment.service';
import BackButton from '../../components/BackButton';

interface Student {
  id: number;
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
}

export const RoomAssignment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const roomNumber = searchParams.get('roomNumber');
  const building = searchParams.get('building');

  const [students, setStudents] = useState<Student[]>([]);
  const [assignedStudentIds, setAssignedStudentIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Lấy danh sách tất cả sinh viên
      const studentsResponse = await studentService.getAllStudents();
      const allStudents = studentsResponse.data || [];

      // Lấy danh sách các phòng đã được gán
      const assignmentsResponse = await roomAssignmentService.getRoomAssignments();
      const assignments = assignmentsResponse.data || [];
      
      // Lấy danh sách ID của các sinh viên đã được gán phòng
      const assignedIds = assignments.map((assignment: any) => assignment.student.id);
      setAssignedStudentIds(assignedIds);

      // Lọc ra những sinh viên chưa được gán phòng
      const unassignedStudents = allStudents.filter(
        (student: Student) => !assignedIds.includes(student.id)
      );
      
      setStudents(unassignedStudents);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu');
      setLoading(false);
    }
  };

  const handleAssignStudent = async (student: Student) => {
    if (!roomId) {
      setError('Không tìm thấy thông tin phòng');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Lấy ngày hiện tại
      const today = new Date();
      // Lấy ngày kết thúc (mặc định là 1 năm sau)
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      await roomAssignmentService.assignRoom({
        studentId: student.id,
        roomId: parseInt(roomId),
        startDate: today.toISOString().split('T')[0], // Format: YYYY-MM-DD
        endDate: endDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
        isAdmin: true // Thêm tham số isAdmin để chỉ định đây là thao tác của admin
      });

      setSuccess(`Gán sinh viên ${student.fullName} vào phòng ${roomNumber} thành công!`);
      // Cập nhật lại danh sách sinh viên sau khi gán phòng
      setStudents(students.filter(s => s.id !== student.id));
      setAssignedStudentIds([...assignedStudentIds, student.id]);
      
      setTimeout(() => {
        navigate('/admin/room-list');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi gán sinh viên vào phòng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Gán sinh viên vào phòng
          </Typography>
        </Box>

        {roomId && (
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="h6" gutterBottom>
              Thông tin phòng đã chọn:
            </Typography>
            <Typography>
              Số phòng: {roomNumber}
              <br />
              Tòa nhà: {building}
            </Typography>
          </Paper>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Tìm kiếm sinh viên"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã sinh viên, tên hoặc email"
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã sinh viên</TableCell>
                  <TableCell>Họ và tên</TableCell>
                  <TableCell>Ngày sinh</TableCell>
                  <TableCell>Giới tính</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.fullName}</TableCell>
                    <TableCell>{new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        onClick={() => handleAssignStudent(student)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Đang xử lý...' : 'Gán vào phòng'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      {searchTerm ? 'Không tìm thấy sinh viên phù hợp' : 'Không có sinh viên nào chưa được gán phòng'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/room-list')}
              disabled={isSubmitting}
            >
              Quay lại
            </Button>
          </Box>
        </Paper>
      </Paper>
    </Container>
  );
}; 