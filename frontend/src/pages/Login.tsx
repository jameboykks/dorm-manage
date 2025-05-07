import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { LoginCredentials } from '../types/user';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1
  }
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 450,
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
  transition: 'transform 0.3s ease-in-out',
  position: 'relative',
  zIndex: 2,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'scale(1.01)',
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1976d2 0%, #3f51b5 100%)',
  padding: theme.spacing(4),
  textAlign: 'center',
  color: 'white',
}));

const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const credentials: LoginCredentials = { username, password };
      const response = await authService.login(credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        // Chuyển hướng dựa trên role
        if (response.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/student/home');
        }
      }
    } catch (error) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientBackground>
      <Container maxWidth="sm">
        <LoginCard>
          <HeaderSection>
            <Typography variant="h4" component="h1" gutterBottom>
              Đăng nhập
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
              Hệ thống quản lý ký túc xá
            </Typography>
          </HeaderSection>
          
          <FormSection>
            <form onSubmit={handleLogin}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Tên đăng nhập"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Nhập tên đăng nhập"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  label="Mật khẩu"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Nhập mật khẩu"
                />
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <AlertTitle>Lỗi</AlertTitle>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isLoading}
                sx={{ 
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(90deg, #1976d2 0%, #3f51b5 100%)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #1565c0 0%, #303f9f 100%)',
                  }
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Đang đăng nhập...
                  </Box>
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </form>
          </FormSection>
        </LoginCard>
      </Container>
    </GradientBackground>
  );
};

export default Login; 