import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Badge
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import { notificationService } from '../../services/notification.service';

export const StudentHome: React.FC = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const notifications = await notificationService.getNotifications();
      const unread = notifications.filter((notification: any) => !notification.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Student Portal
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/student/notifications')}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Thông tin cá nhân */}
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
              onClick={() => navigate('/student/profile')}
            >
              <PersonIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Thông tin cá nhân
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Xem và cập nhật thông tin cá nhân
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Đăng ký phòng */}
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
              onClick={() => navigate('/student/available-rooms')}
            >
              <HomeIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Đăng ký phòng
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Xem và đăng ký phòng trọ
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Thanh toán */}
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
              onClick={() => navigate('/student/payment')}
            >
              <PaymentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Thanh toán
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Xem và thanh toán tiền phòng
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Lịch sử */}
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
              onClick={() => navigate('/student/history')}
            >
              <HistoryIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Lịch sử
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Xem lịch sử đăng ký phòng
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}; 