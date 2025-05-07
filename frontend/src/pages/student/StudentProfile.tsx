import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Button,
  Divider,
  TextField,
  Snackbar
} from '@mui/material';
import { studentService } from '../../services/student.service';
import { authService } from '../../services/auth.service';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Student } from '../../types/student';
import BackButton from '../../components/BackButton';

interface StudentProfile {
  id: number;
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
}

export const StudentProfile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<StudentProfile | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      if (!currentUser?.user.id) return;
      const response = await studentService.getStudentByUserId(currentUser.user.id);
      setProfile(response.data);
      setEditedProfile(response.data);
    } catch (err: any) {
      setError('Không thể tải thông tin sinh viên');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedProfile) return;
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!editedProfile) return;
    try {
      await studentService.updateStudentProfile({
        dateOfBirth: editedProfile.dateOfBirth,
        address: editedProfile.address,
        phone: editedProfile.phone,
        email: editedProfile.email
      });
      setProfile(editedProfile);
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: 'Cập nhật thông tin thành công',
        severity: 'success'
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Không thể cập nhật thông tin',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/student/home')}
          >
            Quay lại
          </Button>
        </Box>
      </Container>
    );
  }

  if (!profile || !editedProfile) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box display="flex" flexDirection="column" mb={3}>
          <BackButton />
          <Typography variant="h4" gutterBottom>
            Thông tin cá nhân
          </Typography>
        </Box>
        
        <Paper sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Thông tin sinh viên
            </Typography>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Chỉnh sửa
              </Button>
            ) : (
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{ mr: 1 }}
                >
                  Lưu
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                >
                  Hủy
                </Button>
              </Box>
            )}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Mã sinh viên
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profile.studentId}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Họ và tên
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profile.fullName}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Ngày sinh
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  type="date"
                  name="dateOfBirth"
                  value={editedProfile.dateOfBirth.split('T')[0]}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              ) : (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {new Date(profile.dateOfBirth).toLocaleDateString('vi-VN')}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Giới tính
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profile.gender === 'male' ? 'Nam' : 'Nữ'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                Địa chỉ
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="address"
                  value={editedProfile.address}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {profile.address}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Số điện thoại
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="phone"
                  value={editedProfile.phone}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {profile.phone}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Email
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  value={editedProfile.email}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {profile.email}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}; 