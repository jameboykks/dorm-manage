import React, { useState, useEffect } from 'react';
import { roomService } from '../../services/room.service';
import { authService } from '../../services/auth.service';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import BackButton from '../../components/BackButton';

interface Room {
  id: number;
  roomNumber: string;
  building: string;
  floor: number;
  capacity: number;
  type: string;
  price: number;
  status: string;
  currentOccupancy: number;
  students: Array<{
    id: number;
    fullName: string;
  }>;
}

export const RoomList: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomService.getAllRooms();
      setRooms(response.data || []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách phòng');
      setLoading(false);
    }
  };

  const handleDeleteClick = (room: Room) => {
    setSelectedRoom(room);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRoom) return;

    try {
      await roomService.deleteRoom(selectedRoom.id);
      setRooms(rooms.filter(r => r.id !== selectedRoom.id));
      setSnackbar({
        open: true,
        message: 'Xóa phòng thành công',
        severity: 'success'
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Không thể xóa phòng',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedRoom(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedRoom(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleRegisterStudent = (room: Room) => {
    // Chuyển đến trang gán sinh viên vào phòng với thông tin phòng
    navigate(`/admin/room-assignment?roomId=${room.id}&roomNumber=${room.roomNumber}&building=${room.building}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'success';
      case 'đã có người ở':
        return 'info';
      case 'room đầy':
        return 'error';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'Còn trống';
      case 'đã có người ở':
        return 'Đã có Người ở';
      case 'room đầy':
        return 'Room đầy';
      case 'maintenance':
        return 'Đang bảo trì';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'standard':
        return 'Tiêu chuẩn';
      case 'deluxe':
        return 'Cao cấp';
      case 'suite':
        return 'Suite';
      default:
        return type;
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getTypeLabel(room.type).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportList = () => {
    // Convert rooms data to CSV format
    const headers = ['Số phòng', 'Tòa nhà', 'Tầng', 'Sức chứa', 'Loại phòng', 'Giá', 'Trạng thái', 'Số người ở'];
    const csvData = filteredRooms.map(room => [
      room.roomNumber,
      room.building,
      room.floor,
      room.capacity,
      getTypeLabel(room.type),
      room.price.toLocaleString('vi-VN'),
      getStatusLabel(room.status),
      room.currentOccupancy
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `danh-sach-phong-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box display="flex" flexDirection="column" mb={3}>
          <BackButton onClick={handleBack} />
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4">
              Danh sách phòng
            </Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/admin/room/add')}
                sx={{ mr: 2 }}
              >
                Tạo phòng mới
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/admin/room-assignments')}
                sx={{ mr: 2 }}
              >
                Xét duyệt yêu cầu đăng ký
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleExportList()}
              >
                Xuất danh sách
              </Button>
            </Box>
          </Box>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm theo số phòng, tòa nhà hoặc loại phòng"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Tổng số: {filteredRooms.length} phòng
          </Typography>
        </Paper>

        {filteredRooms.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? 'Không tìm thấy phòng nào phù hợp với từ khóa tìm kiếm.' : 'Chưa có phòng nào trong hệ thống.'}
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Số phòng</TableCell>
                  <TableCell>Tòa nhà</TableCell>
                  <TableCell>Tầng</TableCell>
                  <TableCell>Sức chứa</TableCell>
                  <TableCell>Loại phòng</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      <Button
                        color="primary"
                        onClick={() => navigate(`/admin/room-students/${room.id}`)}
                      >
                        {room.roomNumber}
                      </Button>
                    </TableCell>
                    <TableCell>{room.building}</TableCell>
                    <TableCell>{room.floor}</TableCell>
                    <TableCell>
                      {room.currentOccupancy}/{room.capacity}
                      {room.students && room.students.length > 0 && (
                        <Tooltip
                          title={
                            <Box>
                              <Typography variant="subtitle2">Danh sách sinh viên:</Typography>
                              {room.students.map((student, index) => (
                                <Typography key={index} variant="body2">
                                  • {student.fullName}
                                </Typography>
                              ))}
                            </Box>
                          }
                        >
                          <IconButton size="small" sx={{ ml: 1 }}>
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>{getTypeLabel(room.type)}</TableCell>
                    <TableCell>{room.price.toLocaleString('vi-VN')} VNĐ</TableCell>
                    <TableCell>
                      <Chip
                        label={room.status}
                        color={
                          room.status.toLowerCase() === 'available'
                            ? 'success'
                            : room.status.toLowerCase() === 'maintenance'
                            ? 'error'
                            : 'warning'
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/admin/room/${room.id}/edit`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(room)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        color="success"
                        onClick={() => handleRegisterStudent(room)}
                        disabled={room.currentOccupancy >= room.capacity}
                      >
                        <PersonAddIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>Xác nhận xóa phòng</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa phòng {selectedRoom?.roomNumber} (Tòa: {selectedRoom?.building})?
              Hành động này không thể hoàn tác.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Hủy</Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}; 