import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import { authService } from '../../services/auth.service';
import BackButton from '../../components/BackButton';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  MenuItem
} from '@mui/material';

interface Student {
  id: number;
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  year: string;
}

export const EditStudent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    year: ''
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (!id) return;
        const response = await studentService.getStudentById(parseInt(id));
        console.log('Student data:', response);
        setStudent(response);
        
        // Format date safely
        let formattedDate = '';
        if (response.dateOfBirth) {
          try {
            const date = new Date(response.dateOfBirth);
            formattedDate = date.toISOString().split('T')[0];
          } catch (e) {
            console.error('Error formatting date:', e);
            formattedDate = '';
          }
        }

        // Capitalize first letter of gender safely
        const formattedGender = response.gender ? 
          response.gender.charAt(0).toUpperCase() + response.gender.slice(1) : 
          '';

        setFormData({
          fullName: response.fullName || '',
          dateOfBirth: formattedDate,
          gender: formattedGender,
          address: response.address || '',
          phone: response.phone || '',
          email: response.email || '',
          year: response.year || ''
        });
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching student:', err);
        setError(err.message || 'Không thể tải thông tin sinh viên');
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const validateForm = () => {
    // Validate phone number
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError('Số điện thoại phải có 10 chữ số');
      return false;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }

    // Validate required fields
    if (!formData.fullName || !formData.dateOfBirth || !formData.gender || !formData.address) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      if (!id) return;
      await studentService.updateStudent(parseInt(id), formData);
      setSuccess('Cập nhật thông tin sinh viên thành công!');
      setTimeout(() => {
        navigate('/admin/student-list');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật thông tin sinh viên');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h6">Đang tải...</Typography>
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
          Chỉnh sửa thông tin sinh viên
        </Typography>
        </Box>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              {success && (
                <Grid item xs={12}>
                  <Alert severity="success">{success}</Alert>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mã sinh viên"
                  value={student?.studentId || ''}
                  disabled
                  helperText="Mã sinh viên không thể thay đổi"
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
                  error={!formData.fullName}
                  helperText={!formData.fullName ? 'Vui lòng nhập họ tên' : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Ngày sinh"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!formData.dateOfBirth}
                  helperText={!formData.dateOfBirth ? 'Vui lòng chọn ngày sinh' : ''}
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
                  error={!formData.gender}
                  helperText={!formData.gender ? 'Vui lòng chọn giới tính' : ''}
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
                  error={!formData.address}
                  helperText={!formData.address ? 'Vui lòng nhập địa chỉ' : ''}
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
                  error={!/^[0-9]{10}$/.test(formData.phone)}
                  helperText={!/^[0-9]{10}$/.test(formData.phone) ? 'Số điện thoại phải có 10 chữ số' : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
                  helperText={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'Email không hợp lệ' : ''}
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
                error={!formData.year}
                helperText={!formData.year ? 'Vui lòng chọn năm học' : ''}
              >
                <MenuItem value="1">Năm 1</MenuItem>
                <MenuItem value="2">Năm 2</MenuItem>
                <MenuItem value="3">Năm 3</MenuItem>
                <MenuItem value="4">Năm 4</MenuItem>
                <MenuItem value="5">Năm 5</MenuItem>
              </TextField>
            </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/admin/student-list')}
                    disabled={isSubmitting}
                  >
                    Quay lại
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Lưu thay đổi'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
    </Container>
  );
}; 