import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import { authService } from '../../services/auth.service';
import BackButton from '../../components/BackButton';

interface StudentFormData {
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  year: string;
}

export const StudentRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StudentFormData>({
    studentId: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    year: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await studentService.registerStudent(formData);
      setSuccess('Đăng ký sinh viên thành công!');
      setTimeout(() => {
        navigate('/admin/student-list');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi đăng ký sinh viên');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box display="flex" flexDirection="column" mb={3}>
          <BackButton />
          <Typography variant="h4" gutterBottom>
          Đăng ký sinh viên mới
        </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>
        )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Mã sinh viên"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Họ và tên"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  label="Ngày sinh"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Giới tính"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="email"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Sinh Viên Năm Thứ"
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                <MenuItem value="1">Năm 1</MenuItem>
                <MenuItem value="2">Năm 2</MenuItem>
                <MenuItem value="3">Năm 3</MenuItem>
                <MenuItem value="4">Năm 4</MenuItem>
                <MenuItem value="5">Năm 5</MenuItem>
              </TextField>
            </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="password"
                  label="Mật khẩu"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/student-list')}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Đăng ký'}
              </Button>
            </Box>
          </form>
        </Paper>
    </Container>
  );
}; 