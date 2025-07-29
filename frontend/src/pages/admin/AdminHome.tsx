import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';

export const AdminHome: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const navigate = useNavigate();
  const handleLogout = () => {
    authService.logout();
    navigate('/login');   // chuyển về trang login chung
  };

  return (
    <Container maxWidth="lg">
      {/* Nút Đăng xuất */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="outlined" onClick={handleLogout}>
          Đăng xuất
        </Button>
      </Box>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Quản lý Ký túc xá
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Chào mừng, {currentUser?.user.username}!
        </Typography>

        <Grid container spacing={3}>
          {/* Quản lý sinh viên */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
              component={Link}
              to="/admin/student-registration"
            >
              <PersonAddIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Đăng ký sinh viên
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Thêm, chỉnh sửa và quản lý thông tin sinh viên
              </Typography>
            </Paper>
          </Grid>

          {/* Danh sách sinh viên */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
              component={Link}
              to="/admin/student-list"
            >
              <ListAltIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Danh sách sinh viên
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Xem danh sách tất cả sinh viên trong hệ thống
              </Typography>
            </Paper>
          </Grid>

          {/* Quản lý phòng */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
              component={Link}
              to="/admin/room-registration"
            >
              <MeetingRoomIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Quản lý phòng
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Thêm và quản lý thông tin phòng ký túc xá
              </Typography>
            </Paper>
          </Grid>

          {/* Danh sách phòng */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
              component={Link}
              to="/admin/room-list"
            >
              <HomeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Danh sách phòng
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Xem danh sách tất cả phòng trong ký túc xá
              </Typography>
            </Paper>
          </Grid>

          {/* Quản lý thanh toán */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
              component={Link}
              to="/admin/payment-management"
            >
              <PaymentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Quản lý thanh toán
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Xem và quản lý thanh toán của sinh viên
              </Typography>
            </Paper>
          </Grid>

          {/* Hỗ trợ trực tuyến */}
          {/* <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
              component={Link}
              to="/admin/chat"
            >
              <ChatIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Hỗ trợ trực tuyến
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Hỗ trợ và giải đáp thắc mắc cho sinh viên
              </Typography>
            </Paper>
          </Grid> */}

          {/* Thêm card mới cho Tạo thông báo */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer'
                }
              }}
              onClick={() => navigate('/admin/create-notification')}
            >
              <NotificationsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Tạo thông báo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tạo thông báo mới cho sinh viên
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}; 