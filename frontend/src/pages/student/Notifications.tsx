import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { notificationService } from '../../services/notification.service';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { authService } from '../../services/auth.service';
import BackButton from '../../components/BackButton';

interface Notification {
  id: number;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
      // Mark all notifications as read
      await notificationService.markAllAsRead();
      setLoading(false);
    } catch (err: any) {
      setError('Không thể tải thông báo');
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <PaymentIcon color="primary" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <CancelIcon color="error" />;
      default:
        return <NotificationsIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box display="flex" flexDirection="column" mb={3}>
          <BackButton />
      <Typography variant="h4" gutterBottom>
        Thông báo
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ width: '100%', mb: 2 }}>
        <List>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                <ListItemText
                  primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" component="span">
                      {notification.title}
                    </Typography>
                          {!notification.isRead && (
                            <Chip label="Mới" color="primary" size="small" />
                          )}
                        </Box>
                  }
                  secondary={
                    <>
                          <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                        {notification.content}
                      </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm')}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
                  {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
              ))
            ) : (
              <ListItem>
                <ListItemText
                  primary="Chưa có thông báo nào"
                  sx={{ textAlign: 'center' }}
                />
              </ListItem>
            )}
        </List>
        </Paper>
      </Paper>
    </Container>
  );
};