import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid
} from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { paymentService } from '../../services/payment.service';
import { studentService } from '../../services/student.service';
import { notificationService } from '../../services/notification.service';
import { authService } from '../../services/auth.service';
import BackButton from '../../components/BackButton';

interface Payment {
  id: number;
  studentId: number;
  amount: number;
  paymentDate: string;
  evidenceImage: string;
  status: 'pending' | 'approved' | 'rejected';
  month: number;
  year: number;
  createdAt: string;
  student?: {
    id: number;
    studentId: string;
    fullName: string;
  };
}

export const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getAllPayments();
      setPayments(response.data);
      setLoading(false);
    } catch (err: any) {
      setError('Không thể tải danh sách thanh toán');
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId: number) => {
    try {
      const response = await paymentService.approvePayment(paymentId);
      
      // Lấy thông tin user của sinh viên
      if (response.success && response.data) {
        const payment = response.data;
        const studentResponse = await studentService.getStudentById(payment.studentId);
        if (studentResponse.success && studentResponse.data) {
          await notificationService.createNotification({
            title: 'Thanh toán được chấp nhận',
            content: `Thanh toán của bạn cho tháng ${payment.month}/${payment.year} với số tiền ${payment.amount.toLocaleString('vi-VN')} VNĐ đã được chấp nhận.`,
            type: 'payment',
            recipientId: studentResponse.data.userId.toString()
          });
        }
      }
      
      setSuccess('Đã chấp nhận thanh toán thành công');
      fetchPayments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể chấp nhận thanh toán');
    }
  };

  const handleReject = async () => {
    if (!selectedPayment) return;
    
    try {
      const response = await paymentService.rejectPayment(selectedPayment.id, rejectionReason);
      
      // Lấy thông tin user của sinh viên
      if (response.success && response.data) {
        const payment = response.data;
        const studentResponse = await studentService.getStudentById(payment.studentId);
        if (studentResponse.success && studentResponse.data) {
          await notificationService.createNotification({
            title: 'Thanh toán bị từ chối',
            content: `Thanh toán của bạn cho tháng ${payment.month}/${payment.year} với số tiền ${payment.amount.toLocaleString('vi-VN')} VNĐ đã bị từ chối. Lý do: ${rejectionReason}`,
            type: 'payment',
            recipientId: studentResponse.data.userId.toString()
          });
        }
      }
      
      setSuccess('Đã từ chối thanh toán thành công');
      setOpenDialog(false);
      setRejectionReason('');
      setSelectedPayment(null);
      fetchPayments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể từ chối thanh toán');
    }
  };

  const openRejectDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setOpenDialog(true);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label="Đang chờ" color="warning" />;
      case 'approved':
        return <Chip label="Đã duyệt" color="success" />;
      case 'rejected':
        return <Chip label="Từ chối" color="error" />;
      default:
        return <Chip label={status} />;
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
            Quản lý thanh toán
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã SV</TableCell>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>Tháng/Năm</TableCell>
                  <TableCell>Số tiền</TableCell>
                  <TableCell>Ngày thanh toán</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Hình ảnh</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.student?.studentId}</TableCell>
                      <TableCell>{payment.student?.fullName}</TableCell>
                      <TableCell>{payment.month}/{payment.year}</TableCell>
                      <TableCell>{payment.amount.toLocaleString('vi-VN')} VNĐ</TableCell>
                      <TableCell>
                        {format(new Date(payment.paymentDate), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>{getStatusChip(payment.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          href={`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/${payment.evidenceImage}`}
                          target="_blank"
                        >
                          Xem ảnh
                        </Button>
                      </TableCell>
                      <TableCell>
                        {payment.status === 'pending' && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleApprove(payment.id)}
                            >
                              Chấp nhận
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => openRejectDialog(payment)}
                            >
                              Từ chối
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Chưa có thanh toán nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Paper>

      {/* Dialog từ chối thanh toán */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Từ chối thanh toán</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Sinh viên: {selectedPayment?.student?.fullName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Số tiền: {selectedPayment?.amount.toLocaleString('vi-VN')} VNĐ
              </Typography>
              <Typography variant="body1" gutterBottom>
                Tháng/Năm: {selectedPayment?.month}/{selectedPayment?.year}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lý do từ chối"
                multiline
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button 
            onClick={handleReject} 
            color="error" 
            variant="contained"
            disabled={!rejectionReason.trim()}
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 