
import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';

export const AdminHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Quản lý Ký túc xá
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
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
              onClick={() => navigate('/admin/student-registration')}
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
              onClick={() => navigate('/admin/room-registration')}
            >
              <HomeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Đăng ký phòng ký túc xá
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Quản lý và phân bố phòng ký túc xá cho sinh viên
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}; 