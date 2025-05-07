import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Autocomplete,
  Chip,
  FormHelperText
} from '@mui/material';
import { notificationService } from '../../services/notification.service';
import { studentService } from '../../services/student.service';
import { authService } from '../../services/auth.service';
import BackButton from '../../components/BackButton';
import { Student } from '../../types/student';

export const CreateNotification: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [recipientType, setRecipientType] = useState('all');
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    if (recipientType === 'specific') {
      fetchStudents();
    }
  }, [recipientType]);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await studentService.getAllStudents();
      if (response && response.data) {
        setStudents(response.data);
      }
    } catch (err: any) {
      setError('Không thể tải danh sách sinh viên: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Nếu chọn tất cả sinh viên
      if (recipientType === 'all') {
        await notificationService.createNotification({
          title,
          content,
          type,
          recipientId: 'all'
        });
      } 
      // Nếu chọn sinh viên cụ thể
      else if (recipientType === 'specific' && selectedStudents.length > 0) {
        // Gửi thông báo cho từng sinh viên được chọn
        const promises = selectedStudents.map(student => 
          notificationService.createNotification({
            title,
            content,
            type,
            recipientId: student.userId?.toString() || ''
          })
        );
        
        await Promise.all(promises);
      } else {
        throw new Error('Vui lòng chọn ít nhất một sinh viên');
      }

      setSuccess('Thông báo đã được tạo thành công');
      // Reset form
      setTitle('');
      setContent('');
      setType('general');
      setSelectedStudents([]);
      setRecipientType('all');
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Có lỗi xảy ra khi tạo thông báo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box display="flex" flexDirection="column" mb={3}>
          <BackButton />
          <Typography variant="h4" gutterBottom>
            Tạo thông báo
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
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="type-label">Loại thông báo</InputLabel>
            <Select
              labelId="type-label"
              value={type}
              label="Loại thông báo"
              onChange={(e) => setType(e.target.value)}
              required
            >
              <MenuItem value="general">Thông báo chung</MenuItem>
              <MenuItem value="maintenance">Bảo trì</MenuItem>
              <MenuItem value="event">Sự kiện</MenuItem>
              <MenuItem value="important">Quan trọng</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="recipient-type-label">Người nhận</InputLabel>
            <Select
              labelId="recipient-type-label"
              value={recipientType}
              label="Người nhận"
              onChange={(e) => setRecipientType(e.target.value)}
              required
            >
              <MenuItem value="all">Tất cả sinh viên</MenuItem>
              <MenuItem value="specific">Sinh viên cụ thể</MenuItem>
            </Select>
          </FormControl>

          {recipientType === 'specific' && (
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                multiple
                id="students-select"
                options={students}
                getOptionLabel={(option) => `${option.fullName} (${option.studentId})`}
                value={selectedStudents}
                onChange={(_, newValue) => setSelectedStudents(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn sinh viên"
                    placeholder="Chọn sinh viên"
                    helperText={selectedStudents.length === 0 ? "Vui lòng chọn ít nhất một sinh viên" : ""}
                    error={selectedStudents.length === 0}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={`${option.fullName} (${option.studentId})`}
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
                loading={loadingStudents}
                disabled={loadingStudents}
              />
              {loadingStudents && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>
          )}

          <TextField
            fullWidth
            label="Tiêu đề thông báo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Nội dung thông báo"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            multiline
            rows={4}
            sx={{ mb: 3 }}
          />

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                setTitle('');
                setContent('');
                setType('general');
                setSelectedStudents([]);
                setRecipientType('all');
              }}
              disabled={loading}
            >
              Xóa form
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || (recipientType === 'specific' && selectedStudents.length === 0)}
            >
              {loading ? <CircularProgress size={24} /> : 'Tạo thông báo'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}; 