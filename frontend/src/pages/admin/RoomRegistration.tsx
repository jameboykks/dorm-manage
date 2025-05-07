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
  Card,
  CardContent,
  CardActions,
  CardMedia
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { roomService } from '../../services/room.service';
import { authService } from '../../services/auth.service';
import BackButton from '../../components/BackButton';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface RoomForm {
  roomNumber: string;
  building: string;
  floor: string;
  capacity: string;
  type: string;
  price: string;
  status: string;
}

export const RoomRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<string>('');
  const [formData, setFormData] = useState<RoomForm>({
    roomNumber: '',
    building: '',
    floor: '',
    capacity: '',
    type: '',
    price: '',
    status: 'available'
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Xử lý đặc biệt cho trường số phòng
    if (name === 'roomNumber') {
      // Chỉ cho phép nhập số và bắt đầu bằng số 1-9
      if (value === '' || /^[1-9][0-9]*$/.test(value)) {
        setFormData(prev => {
          const newData = {
            ...prev,
            [name]: value
          };
          
          // Tự động điền số tầng nếu có số phòng
          if (value.length > 0) {
            newData.floor = value.charAt(0);
          }
          
          return newData;
        });
      }
    } else {
      // Xử lý bình thường cho các trường khác
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Tạo object dữ liệu để gửi lên server
      const roomData = {
        roomNumber: formData.roomNumber,
        building: formData.building,
        floor: parseInt(formData.floor),
        capacity: parseInt(formData.capacity),
        type: formData.type,
        price: parseFloat(formData.price),
        status: formData.status
      };
      
      // Gọi API đăng ký phòng
      await roomService.registerRoom(roomData);
      
      setSuccess('Đăng ký phòng thành công!');
      setTimeout(() => {
        navigate('/admin');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi đăng ký phòng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (showForm) {
      setShowForm(false);
      setFormType('');
    } else {
      navigate(-1);
    }
  };

  const handleOptionSelect = (type: string) => {
    setFormType(type);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <Container maxWidth="md">
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
              {formType === 'register' ? 'Đăng ký phòng ký túc xá' : 'Thay đổi giá phòng'}
            </Typography>
          </Box>
          <Paper sx={{ p: 3, mt: 2 }}>
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
                    inputProps={{
                      pattern: '[1-9][0-9]*',
                      title: 'Số phòng phải bắt đầu bằng số từ 1-9'
                    }}
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
                    label="Tầng"
                    name="floor"
                    type="number"
                    value={formData.floor}
                    onChange={handleChange}
                    disabled
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
                <Grid item xs={12}>
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
                      disabled={isSubmitting}
                    >
                      Quay lại
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
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
            Thêm phòng mới
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6
                }
              }}
              onClick={() => handleOptionSelect('register')}
            >
              <CardMedia
                sx={{ 
                  height: 140, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'primary.light'
                }}
              >
                <MeetingRoomIcon sx={{ fontSize: 80, color: 'white' }} />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Đăng ký phòng
                </Typography>
                <Typography>
                  Thêm phòng mới vào hệ thống ký túc xá với thông tin chi tiết về số phòng, tòa nhà, tầng, sức chứa, loại phòng và giá phòng.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Xem chi tiết</Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6
                }
              }}
              onClick={() => handleOptionSelect('price')}
            >
              <CardMedia
                sx={{ 
                  height: 140, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'secondary.light'
                }}
              >
                <AttachMoneyIcon sx={{ fontSize: 80, color: 'white' }} />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Thay đổi giá phòng
                </Typography>
                <Typography>
                  Cập nhật giá phòng cho các phòng hiện có trong hệ thống ký túc xá. Bạn có thể thay đổi giá phòng dựa trên loại phòng hoặc các yếu tố khác.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Xem chi tiết</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}; 