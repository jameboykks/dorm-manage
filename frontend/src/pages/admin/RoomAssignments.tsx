import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  Box,
  Chip,
  CircularProgress
} from '@mui/material';
import { roomAssignmentService } from '../../services/roomAssignment.service';
import BackButton from '../../components/BackButton';

interface RoomAssignment {
  id: number;
  roomId: number;
  studentId: number;
  status: string;
  startDate: string;
  endDate: string;
  room: {
    roomNumber: string;
    building: string;
  };
  student: {
    fullName: string;
    studentId: string;
  };
}

export const RoomAssignments: React.FC = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<RoomAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await roomAssignmentService.getRoomAssignments();
      setAssignments(response.data || []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách yêu cầu đăng ký');
      setLoading(false);
    }
  };

  const handleApprove = async (assignmentId: number) => {
    try {
      await roomAssignmentService.approveAssignment(assignmentId);
      setSuccess('Đã phê duyệt yêu cầu đăng ký');
      fetchAssignments();
    } catch (err: any) {
      setError(err.message || 'Không thể phê duyệt yêu cầu');
    }
  };

  const handleReject = async (assignmentId: number) => {
    try {
      await roomAssignmentService.rejectAssignment(assignmentId);
      setSuccess('Đã từ chối yêu cầu đăng ký');
      fetchAssignments();
    } catch (err: any) {
      setError(err.message || 'Không thể từ chối yêu cầu');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ xét duyệt';
      case 'approved':
        return 'Đã phê duyệt';
      case 'rejected':
        return 'Đã từ chối';
      default:
        return status;
    }
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
            Xét duyệt yêu cầu đăng ký phòng
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

        {assignments.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Không có yêu cầu đăng ký phòng nào cần xét duyệt.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sinh viên</TableCell>
                  <TableCell>Mã sinh viên</TableCell>
                  <TableCell>Phòng</TableCell>
                  <TableCell>Ngày bắt đầu</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.student.fullName}</TableCell>
                    <TableCell>{assignment.student.studentId}</TableCell>
                    <TableCell>
                      {assignment.room.building} - {assignment.room.roomNumber}
                    </TableCell>
                    <TableCell>{new Date(assignment.startDate).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(assignment.status)}
                        color={getStatusColor(assignment.status)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {assignment.status.toLowerCase() === 'pending' && (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleApprove(assignment.id)}
                            sx={{ mr: 1 }}
                          >
                            Phê duyệt
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleReject(assignment.id)}
                          >
                            Từ chối
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}; 