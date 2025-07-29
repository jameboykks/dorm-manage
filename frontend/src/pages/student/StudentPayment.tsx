// frontend/src/pages/student/StudentPayment.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Chip,
  Divider
} from '@mui/material';
import { paymentService } from '../../services/payment.service';
import { studentService } from '../../services/student.service';
import { roomAssignmentService } from '../../services/roomAssignment.service';
import { roomService } from '../../services/room.service';
import { authService } from '../../services/auth.service';
import { format as formatDate } from 'date-fns';
import BackButton from '../../components/BackButton';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface Payment {
  id: number;
  amount: number;
  paymentDate: string;
  evidenceImage: string;
  status: 'pending' | 'approved' | 'rejected';
  month: number;
  year: number;
  createdAt: string;
}

export const StudentPayment: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentMonthPayment, setCurrentMonthPayment] = useState<Payment | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [roomPrice, setRoomPrice] = useState<number | null>(null);  // giá phòng
  const [amount, setAmount] = useState('');
  const [evidenceImage, setEvidenceImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const currentUser = authService.getCurrentUser();
  const dateNow = new Date();
  const currentMonth = dateNow.getMonth() + 1;
  const currentYear = dateNow.getFullYear();

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      if (!currentUser?.user.id) return;
      const resp = await studentService.getStudentByUserId(currentUser.user.id);
      setStudentId(resp.data.id);

      // Lấy giá phòng student đang ở
      const asgResp = await roomAssignmentService.getRoomAssignments();
      const active = asgResp.data.find((a: any) =>
        a.student.id === resp.data.id && a.status === 'active'
      );
      if (active) {
        const roomResp = await roomService.getRoomById(active.room.id);
        setRoomPrice(roomResp.data.price);
      } else {
        setRoomPrice(null);
      }

      // Lấy lịch sử & thanh toán tháng này
      const pays = await paymentService.getStudentPayments(resp.data.id);
      setPayments(pays.data);
      const cur = await paymentService.checkCurrentMonthPayment(resp.data.id);
      setCurrentMonthPayment(cur.data.payment);

      setLoading(false);
    } catch {
      setError('Không thể tải thông tin thanh toán');
      setLoading(false);
    }
  };

  const handleTabChange = (_: any, newVal: number) => setTabValue(newVal);
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setEvidenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return setError('Không tìm thấy thông tin sinh viên');
    if (!amount || !evidenceImage) return setError('Vui lòng điền đầy đủ thông tin');

    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('studentId', studentId.toString());
      formData.append('amount', amount);
      formData.append('month', currentMonth.toString());
      formData.append('year', currentYear.toString());
      formData.append('evidenceImage', evidenceImage);

      await paymentService.createPayment(formData);
      setSuccess('Đã gửi yêu cầu thanh toán thành công');
      await fetchStudentData();
      setAmount(''); setEvidenceImage(null); setPreviewImage(null);
      setTabValue(1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể gửi yêu cầu thanh toán');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusChip = (status: string) => {
    if (status === 'pending') return <Chip label="Đang chờ" color="warning" />;
    if (status === 'approved') return <Chip label="Đã duyệt" color="success" />;
    if (status === 'rejected') return <Chip label="Từ chối" color="error" />;
    return <Chip label={status} />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Disable nếu amount không khớp với roomPrice hoặc đang submitting
  const isSubmitDisabled = submitting || amount !== roomPrice?.toString();

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box mb={3}>
          <BackButton />
          <Typography variant="h4" gutterBottom>
            Thanh toán
          </Typography>
        </Box>

        {/* Hiển thị Giá phòng */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">
            Giá phòng hiện tại:{' '}
            {roomPrice != null
              ? roomPrice.toLocaleString('vi-VN') + ' VNĐ'
              : 'Không có'}
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Thanh toán" />
            <Tab label="Lịch sử thanh toán" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {currentMonthPayment ? (
              <Alert severity="info">
                Bạn đã thanh toán cho tháng {currentMonth}/{currentYear} với trạng thái:{' '}
                {getStatusChip(currentMonthPayment.status)}
              </Alert>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Thông tin thanh toán tháng {currentMonth}/{currentYear}
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Số tiền"
                      type="number"
                      value={amount}
                      onChange={handleAmountChange}
                      InputProps={{
                        endAdornment: <Typography variant="body2">VNĐ</Typography>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ height: '56px' }}
                    >
                      Tải lên hình ảnh chứng minh
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                    {previewImage && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <img
                          src={previewImage}
                          alt="Preview"
                          style={{ maxWidth: '100%', maxHeight: '200px' }}
                        />
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/student/home')}
                        disabled={submitting}
                      >
                        Quay lại
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitDisabled}
                      >
                        {submitting ? 'Đang xử lý...' : 'Gửi yêu cầu thanh toán'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tháng/Năm</TableCell>
                    <TableCell>Số tiền</TableCell>
                    <TableCell>Ngày thanh toán</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Hình ảnh</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.length > 0 ? (
                    payments.map(payment => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {payment.month}/{payment.year}
                        </TableCell>
                        <TableCell>
                          {payment.amount.toLocaleString('vi-VN')} VNĐ
                        </TableCell>
                        <TableCell>
                          {formatDate(new Date(payment.paymentDate), 'dd/MM/yyyy')}
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
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Chưa có lịch sử thanh toán
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Paper>
    </Container>
  );
};
