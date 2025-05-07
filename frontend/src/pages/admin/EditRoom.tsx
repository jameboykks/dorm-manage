import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomService } from '../../services/room.service';
import { authService } from '../../services/auth.service';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BackButton from '../../components/BackButton';

interface RoomForm {
  roomNumber: string;
  building: string;
  floor: string;
  capacity: string;
  type: string;
  price: string;
  status: string;
}

export const EditRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<RoomForm>({
    roomNumber: '',
    building: '',
    floor: '',
    capacity: '',
    type: '',
    price: '',
    status: ''
  });

  useEffect(() => {
    fetchRoomData();
  }, [id]);

  const fetchRoomData = async () => {
    try {
      const response = await roomService.getRoomById(Number(id));
      const room = response.data;
      setFormData({
        roomNumber: room.roomNumber,
        building: room.building,
        floor: room.floor.toString(),
        capacity: room.capacity.toString(),
        type: room.type,
        price: room.price.toString(),
        status: room.status
      });
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin phòng');
      setLoading(false);
    }
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
    setError('');
    setSuccess('');
    
    try {
      const roomData = {
        roomNumber: formData.roomNumber,
        building: formData.building,
        floor: parseInt(formData.floor),
        capacity: parseInt(formData.capacity),
        type: formData.type,
        price: parseFloat(formData.price),
        status: formData.status
      };
      
      await roomService.updateRoom(Number(id), roomData);
      setSuccess('Cập nhật thông tin phòng thành công!');
      setTimeout(() => {
        navigate('/admin/room-list');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi cập nhật thông tin phòng');
    }
  };

  const handleBack = () => {
    navigate('/admin/room-list');
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
            Chỉnh sửa phòng
          </Typography>
        </Box>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />} 
              onClick={handleBack}
              sx={{ mr: 2 }}
            >
              Quay lại
            </Button>
            <Typography variant="h4" component="h1" gutterBottom>
              Chỉnh sửa thông tin phòng
            </Typography>
          </Box>

          <Paper sx={{ p: 3 }}>
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
                    required
                    fullWidth
                    label="Số phòng"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Tòa nhà"
                    name="building"
                    value={formData.building}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Tầng"
                    name="floor"
                    type="number"
                    value={formData.floor}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Sức chứa"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    select
                    label="Loại phòng"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <MenuItem value="standard">Tiêu chuẩn</MenuItem>
                    <MenuItem value="deluxe">Cao cấp</MenuItem>
                    <MenuItem value="suite">Suite</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Giá phòng"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    select
                    label="Trạng thái"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <MenuItem value="available">Còn trống</MenuItem>
                    <MenuItem value="Đã có Người ở">Đã có Người ở</MenuItem>
                    <MenuItem value="Room đầy">Room đầy</MenuItem>
                    <MenuItem value="maintenance">Đang bảo trì</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                    >
                      Lưu thay đổi
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
}; 