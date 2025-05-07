import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { roomAssignmentService } from '../../services/roomAssignment.service';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BackButton from '../../components/BackButton';

interface RoomAssignment {
  id: number;
  studentId: number;
  roomId: number;
  startDate: string;
  endDate?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  student: {
    id: number;
    studentId: string;
    fullName: string;
    email: string;
  };
  room: {
    id: number;
    roomNumber: string;
    building: string;
  };
}

export const RoomRegistrationRequests: React.FC = () => {
  const [assignments, setAssignments] = useState<RoomAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<RoomAssignment | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'approve' | 'reject'>('approve');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await roomAssignmentService.getRoomAssignments();
      setAssignments(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách yêu cầu đăng ký phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (assignment: RoomAssignment, type: 'approve' | 'reject') => {
    setSelectedAssignment(assignment);
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAssignment(null);
  };

  const handleApprove = async () => {
    if (!selectedAssignment) return;
    
    try {
      await roomAssignmentService.approveAssignment(selectedAssignment.id);
      setSuccess('Đã phê duyệt yêu cầu đăng ký phòng thành công');
      fetchAssignments();
    } catch (err: any) {
      setError(err.message || 'Không thể phê duyệt yêu cầu đăng ký phòng');
    } finally {
      handleCloseDialog();
    }
  };

  const handleReject = async () => {
    if (!selectedAssignment) return;
    
    try {
      await roomAssignmentService.rejectAssignment(selectedAssignment.id);
      setSuccess('Đã từ chối yêu cầu đăng ký phòng thành công');
      fetchAssignments();
    } catch (err: any) {
      setError(err.message || 'Không thể từ chối yêu cầu đăng ký phòng');
    } finally {
      handleCloseDialog();
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label="Chờ phê duyệt" color="warning" />;
      case 'active':
        return <Chip label="Đã phê duyệt" color="success" />;
      case 'cancelled':
        return <Chip label="Đã từ chối" color="error" />;
      case 'completed':
        return <Chip label="Đã hoàn thành" color="info" />;
      default:
        return <Chip label={status} />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (error) {
      return dateString;
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
            Yêu cầu đăng ký phòng
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

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã sinh viên</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Phòng</TableCell>
                <TableCell>Ngày bắt đầu</TableCell>
                <TableCell>Ngày kết thúc</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Không có yêu cầu đăng ký phòng nào
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.student.studentId}</TableCell>
                    <TableCell>{assignment.student.fullName}</TableCell>
                    <TableCell>
                      {assignment.room.building} - {assignment.room.roomNumber}
                    </TableCell>
                    <TableCell>{formatDate(assignment.startDate)}</TableCell>
                    <TableCell>
                      {assignment.endDate ? formatDate(assignment.endDate) : 'Không xác định'}
                    </TableCell>
                    <TableCell>{getStatusChip(assignment.status)}</TableCell>
                    <TableCell>
                      {assignment.status === 'pending' && (
                        <>
                          <Button
                            size="small"
                            color="success"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleOpenDialog(assignment, 'approve')}
                            sx={{ mr: 1 }}
                          >
                            Phê duyệt
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => handleOpenDialog(assignment, 'reject')}
                          >
                            Từ chối
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog xác nhận phê duyệt/từ chối */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogType === 'approve' ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogType === 'approve'
              ? 'Bạn có chắc chắn muốn phê duyệt yêu cầu đăng ký phòng này?'
              : 'Bạn có chắc chắn muốn từ chối yêu cầu đăng ký phòng này?'}
          </DialogContentText>
          {selectedAssignment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Sinh viên:</strong> {selectedAssignment.student.fullName}
              </Typography>
              <Typography variant="body2">
                <strong>Phòng:</strong> {selectedAssignment.room.building} - {selectedAssignment.room.roomNumber}
              </Typography>
              <Typography variant="body2">
                <strong>Ngày bắt đầu:</strong> {formatDate(selectedAssignment.startDate)}
              </Typography>
              {selectedAssignment.endDate && (
                <Typography variant="body2">
                  <strong>Ngày kết thúc:</strong> {formatDate(selectedAssignment.endDate)}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={dialogType === 'approve' ? handleApprove : handleReject}
            color={dialogType === 'approve' ? 'success' : 'error'}
            autoFocus
          >
            {dialogType === 'approve' ? 'Phê duyệt' : 'Từ chối'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 