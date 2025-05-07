import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/student.service';
import { authService } from '../../services/auth.service';
import { Link, useNavigate } from 'react-router-dom';
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
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

export const StudentList: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentService.getAllStudents();
      setStudents(response.data || []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách sinh viên');
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
      await studentService.deleteStudent(selectedStudent.id);
      setStudents(students.filter(s => s.id !== selectedStudent.id));
      setSnackbar({
        open: true,
        message: 'Xóa sinh viên thành công',
        severity: 'success'
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Không thể xóa sinh viên',
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
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
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
            Danh sách sinh viên
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={Link}
              to="/admin/student-registration"
            >
              Thêm sinh viên mới
            </Button>
          </Box>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm theo tên, mã sinh viên hoặc email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Tổng số: {filteredStudents.length} sinh viên
          </Typography>
        </Paper>

        {filteredStudents.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? 'Không tìm thấy sinh viên nào phù hợp với từ khóa tìm kiếm.' : 'Chưa có sinh viên nào trong hệ thống.'}
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã sinh viên</TableCell>
                  <TableCell>Họ và tên</TableCell>
                  <TableCell>Ngày sinh</TableCell>
                  <TableCell>Giới tính</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.fullName}</TableCell>
                    <TableCell>
                      {new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.gender.toLowerCase() === 'nam' ? 'Nam' : 'Nữ'}
                        color={student.gender.toLowerCase() === 'nam' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{student.address}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/admin/student/${student.id}/edit`)}
                        sx={{ mr: 1 }}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(student)}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>Xác nhận xóa sinh viên</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa sinh viên {selectedStudent?.fullName} (Mã: {selectedStudent?.studentId})?
              Hành động này không thể hoàn tác.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Hủy</Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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