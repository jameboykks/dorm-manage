import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import { roomService } from '../../services/room.service';
import { roomAssignmentService } from '../../services/roomAssignment.service';
import { Room } from '../../types/room';
import { authService } from '../../services/auth.service';
import { studentService } from '../../services/student.service';

export const StudentRoomRegistration: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [studentId, setStudentId] = useState<number | null>(null);

  useEffect(() => {
    fetchRoomData();
    fetchStudentData();
  }, [roomId]);

  const fetchStudentData = async () => {
    try {
      if (!currentUser?.user.id) return;
      const response = await studentService.getStudentByUserId(currentUser.user.id);
      setStudentId(response.data.id);
    } catch (err: any) {
      setError('Không thể tải thông tin sinh viên');
    }
  };

  const fetchRoomData = async () => {
    try {
      if (!roomId) return;
      const response = await roomService.getRoomById(parseInt(roomId));
      setRoom(response.data);
    } catch (err: any) {
      setError('Không thể tải thông tin phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !studentId) return;

    setSubmitting(true);
    try {
      await roomAssignmentService.assignRoom({
        roomId: parseInt(roomId),
        studentId: studentId,
        startDate,
        endDate,
        isAdmin: false
      });
      navigate('/student/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể đăng ký phòng');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!room) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">Không tìm thấy thông tin phòng</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Đăng ký phòng
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Thông tin phòng
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Số phòng:</strong> {room.roomNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Tòa nhà:</strong> {room.building}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Tầng:</strong> {room.floor}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Loại phòng:</strong> {room.type}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Giá phòng:</strong> {room.price.toLocaleString('vi-VN')} VNĐ/tháng
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Sức chứa:</strong> {room.currentOccupancy}/{room.capacity}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Ngày bắt đầu"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Ngày kết thúc"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/student/home')}
            >
              Hủy
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}; 