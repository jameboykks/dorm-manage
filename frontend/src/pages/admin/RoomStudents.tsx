import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { roomAssignmentService } from '../../services/roomAssignment.service';
import { roomService } from '../../services/room.service';
import { authService } from '../../services/auth.service';
import BackButton from '../../components/BackButton';

interface Student {
  id: number;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  roomAssignmentId: number;
}

const RoomStudents: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchRoomStudents();
  }, [roomId]);

  const fetchRoomStudents = async () => {
    try {
      setLoading(true);
      const response = await roomAssignmentService.getRoomAssignments();
      const roomAssignments = response.data.filter(
        (assignment: any) => 
          assignment.roomId === Number(roomId) && 
          assignment.status === 'active'
      );
      
      if (roomAssignments.length > 0) {
        setRoomInfo(roomAssignments[0].room);
        const studentsData = roomAssignments.map((assignment: any) => ({
          id: assignment.student.id,
          studentId: assignment.student.studentId,
          fullName: assignment.student.fullName,
          email: assignment.student.email,
          phone: assignment.student.phone,
          roomAssignmentId: assignment.id
        }));
        setStudents(studentsData);
      }
    } catch (err) {
      setError('Không thể tải danh sách sinh viên');
      console.error('Error fetching room students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;

    try {
      await roomAssignmentService.removeAssignment(selectedStudent.roomAssignmentId);
      setStudents(students.filter(s => s.id !== selectedStudent.id));
      setSnackbar({
        open: true,
        message: 'Đã xóa sinh viên khỏi phòng thành công',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Không thể xóa sinh viên khỏi phòng',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedStudent(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container>
        <Typography>Đang tải...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box display="flex" flexDirection="column" mb={3}>
          <BackButton />
          <Typography variant="h4" gutterBottom>
            Danh sách sinh viên trong phòng
          </Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã sinh viên</TableCell>
                <TableCell>Họ và tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(student)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Chưa có sinh viên nào trong phòng
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa sinh viên {selectedStudent?.fullName} khỏi phòng này?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Hủy</Button>
            <Button onClick={handleDeleteConfirm} color="error">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default RoomStudents; 