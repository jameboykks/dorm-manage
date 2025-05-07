import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { authService } from '../../services/auth.service';
import BackButton from '../../components/BackButton';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
  sender: {
    username: string;
    role: string;
  };
}

interface Student {
  id: number;
  userId: number;
  fullName: string;
}

export const AdminChat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | ''>('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const currentUser = authService.getCurrentUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchStudents();
    if (selectedStudent) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [selectedStudent]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students', {
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError('Không thể tải danh sách sinh viên. Vui lòng thử lại sau.');
    }
  };

  const fetchMessages = async () => {
    if (!selectedStudent) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/messages/${selectedStudent}`, {
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError('Không thể tải tin nhắn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedStudent
        })
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      setError('Không thể gửi tin nhắn. Vui lòng thử lại sau.');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <BackButton />
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Hỗ trợ trực tuyến
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Chọn sinh viên</InputLabel>
          <Select
            value={selectedStudent}
            label="Chọn sinh viên"
            onChange={(e) => setSelectedStudent(e.target.value as number)}
          >
            {students.map((student) => (
              <MenuItem key={student.id} value={student.userId}>
                {student.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Paper sx={{ p: 2, height: '60vh', display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <List sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
                {messages.map((message) => (
                  <React.Fragment key={message.id}>
                    <ListItem
                      sx={{
                        justifyContent: message.senderId === currentUser?.user.id ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          maxWidth: '70%',
                          backgroundColor: message.senderId === currentUser?.user.id ? 'primary.main' : 'grey.100',
                          color: message.senderId === currentUser?.user.id ? 'white' : 'text.primary'
                        }}
                      >
                        <ListItemText
                          primary={message.content}
                          secondary={new Date(message.createdAt).toLocaleString()}
                          secondaryTypographyProps={{
                            color: message.senderId === currentUser?.user.id ? 'grey.300' : 'text.secondary'
                          }}
                        />
                      </Paper>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
                <div ref={messagesEndRef} />
              </List>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !selectedStudent}
                >
                  <SendIcon />
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
}; 