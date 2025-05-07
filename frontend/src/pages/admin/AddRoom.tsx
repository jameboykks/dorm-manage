import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  Box
} from '@mui/material';
import { roomService } from '../../services/room.service';
import BackButton from '../../components/BackButton';

export const AddRoom: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    roomNumber: '',
    building: '',
    floor: '',
    capacity: '',
    type: 'standard',
    price: '',
    status: 'available'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const roomData = {
        ...formData,
        floor: parseInt(formData.floor),
        capacity: parseInt(formData.capacity),
        price: parseInt(formData.price),
        currentOccupancy: 0
      };

      await roomService.createRoom(roomData);
      setSuccess('Thêm phòng mới thành công');
      setTimeout(() => {
        navigate('/admin/room-list');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Không thể thêm phòng mới');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box display="flex" flexDirection="column" mb={3}>
          <BackButton />
          <Typography variant="h4" gutterBottom>
            Thêm phòng mới
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
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
                select
                label="Tòa nhà"
                name="building"
                value={formData.building}
                onChange={handleChange}
              >
                <MenuItem value="R1">R1</MenuItem>
                <MenuItem value="R2">R2</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Tầng"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Sức chứa"
                name="capacity"
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
                type="number"
                label="Giá phòng"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/room-list')}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Đang thêm...' : 'Thêm phòng'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}; 