import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { roomService } from '../../services/room.service';
import { roomAssignmentService } from '../../services/roomAssignment.service';
import { Room } from '../../types/room';
import { authService } from '../../services/auth.service';
import { studentService } from '../../services/student.service';
import BackButton from '../../components/BackButton';

interface StudentData {
  id: number;
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  year: number;
  userId: number;
  userData?: {
    id: number;
    username: string;
    email: string | null;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface StudentResponse {
  success: boolean;
  data: StudentData;
}

export const AvailableRooms: React.FC = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState<number | null>(null);
  const [studentYear, setStudentYear] = useState<number | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasRoomAssignment, setHasRoomAssignment] = useState(false);
  const [autoRegisterDialogOpen, setAutoRegisterDialogOpen] = useState(false);
  const [autoRegistering, setAutoRegistering] = useState(false);
  const [success, setSuccess] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const currentUser = authService.getCurrentUser();

  // Hàm khởi tạo dữ liệu
  const initializeData = async (userId: number) => {
    try {
      setLoading(true);
      console.log('Initializing data for user:', userId);
      
      // Reset các state
      setStudentId(null);
      setStudentYear(null);
      setRooms([]);
      setError('');
      setHasRoomAssignment(false);
      setAutoRegisterDialogOpen(false);
      setAutoRegistering(false);
      setSuccess('');
      
      // Lấy thông tin sinh viên
      const studentResponse = await studentService.getStudentByUserId(userId);
      console.log('Student data response:', studentResponse);
      
      // Kiểm tra cấu trúc response
      if (!studentResponse) {
        console.log('No response from student service');
        setError('Không thể kết nối đến server');
        setLoading(false);
        return;
      }

      // Kiểm tra các trường hợp response khác nhau
      let studentData: StudentData;
      if (studentResponse.data?.data) {
        studentData = studentResponse.data.data as StudentData;
      } else if (studentResponse.data) {
        studentData = studentResponse.data as StudentData;
      } else {
        studentData = studentResponse as unknown as StudentData;
      }

      console.log('Extracted student data:', studentData);

      if (!studentData) {
        console.log('No student data found in response');
        setError('Không tìm thấy thông tin sinh viên');
        setLoading(false);
        return;
      }

      if (typeof studentData.year !== 'number') {
        console.log('Invalid year value:', studentData.year);
        setError('Thông tin năm học không hợp lệ');
        setLoading(false);
        return;
      }

      console.log('Setting student data:', {
        id: studentData.id,
        year: studentData.year
      });

      // Cập nhật state và đợi cho đến khi state được cập nhật
      await new Promise<void>((resolve) => {
        setStudentId(studentData.id);
        setStudentYear(studentData.year);
        // Đợi một khoảng thời gian ngắn để state được cập nhật
        setTimeout(resolve, 100);
      });

      // Lấy danh sách phòng sau khi state đã được cập nhật
      await fetchAvailableRooms(studentData.year);
      await checkRoomAssignment();
    } catch (err: any) {
      console.error('Error initializing data:', err);
      setError('Không thể tải thông tin sinh viên');
    } finally {
      setLoading(false);
    }
  };

  // useEffect để xử lý khi component mount và khi currentUser thay đổi
  useEffect(() => {
    const currentUserId = currentUser?.user.id;
    console.log('Current user ID:', currentUserId);

    if (currentUserId) {
      initializeData(currentUserId);
    } else {
      // Reset tất cả state khi không có user
      setStudentId(null);
      setStudentYear(null);
      setRooms([]);
      setError('');
      setHasRoomAssignment(false);
      setAutoRegisterDialogOpen(false);
      setAutoRegistering(false);
      setSuccess('');
      setLoading(false);
    }

    // Cleanup function
    return () => {
      setStudentId(null);
      setStudentYear(null);
      setRooms([]);
      setError('');
      setHasRoomAssignment(false);
      setAutoRegisterDialogOpen(false);
      setAutoRegistering(false);
      setSuccess('');
      setLoading(false);
    };
  }, [currentUser?.user.id]); // Chỉ phụ thuộc vào user.id

  // Thêm useEffect để lưu trữ state vào localStorage
  useEffect(() => {
    if (studentId && studentYear) {
      localStorage.setItem('studentData', JSON.stringify({
        studentId,
        studentYear,
        rooms
      }));
    }
  }, [studentId, studentYear, rooms]);

  // Thêm useEffect để khôi phục state từ localStorage khi component mount
  useEffect(() => {
    const savedData = localStorage.getItem('studentData');
    if (savedData) {
      try {
        const { studentId: savedStudentId, studentYear: savedStudentYear, rooms: savedRooms } = JSON.parse(savedData);
        if (savedStudentId && savedStudentYear) {
          setStudentId(savedStudentId);
          setStudentYear(savedStudentYear);
          setRooms(savedRooms || []);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error restoring state from localStorage:', error);
        setLoading(false);
    }
    } else {
      setLoading(false);
    }
  }, []);

  const checkRoomAssignment = async () => {
    try {
      if (!currentUser?.user.id) return;
      
      // Lấy thông tin sinh viên
      const studentResponse = await studentService.getStudentByUserId(currentUser.user.id);
      const studentId = studentResponse.data.id;

      // Lấy danh sách yêu cầu đăng ký phòng
      const assignmentsResponse = await roomAssignmentService.getRoomAssignments();
      const assignments = assignmentsResponse.data || [];

      // Kiểm tra xem sinh viên có yêu cầu đăng ký đang chờ hoặc đã có phòng không
      const hasAssignment = assignments.some((assignment: any) => 
        assignment.studentId === studentId && 
        (assignment.status === 'pending' || assignment.status === 'active')
      );

      setHasRoomAssignment(hasAssignment);
    } catch (err: any) {
      console.error('Error checking room assignment:', err);
    }
  };

  const fetchAvailableRooms = async (year?: number) => {
    try {
      setLoading(true);
      setError('');
      const studentYearToUse = year ?? studentYear;
      console.log('Fetching available rooms for student year:', studentYearToUse);
      
      if (studentYearToUse === null) {
        console.log('Student year is null, skipping room fetch');
        setLoading(false);
        return;
      }
      
      const response = await roomService.getAllRooms();
      console.log('Raw API response:', response);
      
      // Kiểm tra cấu trúc dữ liệu trả về
      let allRooms: Room[] = [];
      
      if (response && response.data) {
        // Nếu API trả về dữ liệu trong thuộc tính data
        allRooms = Array.isArray(response.data) ? response.data : [];
        console.log('Extracted rooms from response.data:', allRooms);
      } else if (Array.isArray(response)) {
        // Nếu API trả về trực tiếp một mảng
        allRooms = response;
        console.log('Using response directly as rooms array:', allRooms);
      } else {
        console.error('Unexpected API response format:', response);
        setError('Định dạng dữ liệu không hợp lệ');
        setRooms([]);
        setLoading(false);
        return;
      }

      console.log('All Rooms Before Filter:', allRooms);

      // Lấy thông tin sinh viên để kiểm tra giới tính
      const studentResponse = await studentService.getStudentByUserId(currentUser?.user.id || 0);
      const studentData = studentResponse.data?.data || studentResponse.data;
      const studentGender = studentData?.gender;

      console.log('Student gender:', studentGender);

      // Lọc các phòng còn trống và phù hợp với giới tính của sinh viên
      const availableRooms = allRooms.filter((room: Room) => {
        // Log chi tiết từng phòng trước khi lọc
        console.log('Checking room:', {
          roomId: room.id,
          roomNumber: room.roomNumber,
          building: room.building,
          status: room.status,
          currentOccupancy: room.currentOccupancy,
          capacity: room.capacity,
          studentGender: studentGender
        });

        const isAvailable = room.status === 'available' || room.status === 'Đã có Người ở';
        const hasSpace = room.currentOccupancy < room.capacity;
        
        // Kiểm tra building dựa trên giới tính
        let isMatchingBuilding = true;
        if (studentGender) {
          isMatchingBuilding = (studentGender === 'Nam' && room.building === 'R1') || 
                             (studentGender === 'Nữ' && room.building === 'R2');
        }
        
        console.log('Room conditions:', {
          roomNumber: room.roomNumber,
          isAvailable,
          hasSpace,
          isMatchingBuilding,
          willBeIncluded: isAvailable && hasSpace && isMatchingBuilding
        });
        
        return isAvailable && hasSpace && isMatchingBuilding;
      });
      
      console.log('Available Rooms After Filter:', availableRooms);
      
      setRooms(availableRooms);
      if (availableRooms.length === 0) {
        setError(`Hiện không có phòng nào khả dụng cho sinh viên ${studentGender === 'Nam' ? 'nam' : 'nữ'}`);
      }
    } catch (error: any) {
      console.error('Error fetching rooms:', error);
      setError(error.message || 'Có lỗi xảy ra khi tải danh sách phòng');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmRegister = async () => {
    if (!selectedRoomId || !studentId) {
      setError('Thông tin không hợp lệ');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Tạo yêu cầu đăng ký phòng với trạng thái pending
      await roomAssignmentService.assignRoom({
        roomId: selectedRoomId,
        studentId: studentId,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isAdmin: false // Đăng ký thủ công cần xét duyệt
      });

      setSuccess('Yêu cầu đăng ký phòng đã được gửi và đang chờ xét duyệt');
      setConfirmDialogOpen(false);
      setSelectedRoomId(null);
      
      // Cập nhật lại trạng thái
      await checkRoomAssignment();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể gửi yêu cầu đăng ký phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoRegister = async () => {
    try {
      setAutoRegistering(true);
      setError('');

      // Lấy thông tin sinh viên
      const studentResponse = await studentService.getStudentByUserId(currentUser?.user.id || 0);
      const studentData = studentResponse.data;
      const studentId = studentData.id;
      const studentGender = studentData.gender;
      const studentYear = studentData.year;

      // Lọc phòng phù hợp với giới tính và năm học
      const availableRoom = rooms.find(room => {
        // Kiểm tra phòng có sẵn sàng và còn chỗ
        const isAvailable = room.status === 'available';
        const hasSpace = room.currentOccupancy < room.capacity;

        // Kiểm tra building dựa trên giới tính
        let isMatchingBuilding = true;
        if (studentGender) {
          isMatchingBuilding = (studentGender === 'Nam' && room.building === 'R1') || 
                             (studentGender === 'Nữ' && room.building === 'R2');
        }
        
        // Kiểm tra tầng dựa trên năm học
        let isMatchingFloor = true;
        if (studentYear && room.floor) {
          // Năm 1 -> tầng 1, năm 2 -> tầng 2, năm 3 -> tầng 3, năm 4 -> tầng 4
          isMatchingFloor = room.floor === studentYear;
        }
        
        return isAvailable && hasSpace && isMatchingBuilding && isMatchingFloor;
      });

      if (!availableRoom) {
        setError('Hiện không có phòng nào khả dụng phù hợp với giới tính và năm học của bạn');
        return;
      }

      // Đăng ký phòng tự động - không cần xét duyệt
      await roomAssignmentService.assignRoom({
        roomId: availableRoom.id,
        studentId: studentId,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isAdmin: true // Đăng ký tự động không cần xét duyệt
      });

      setSuccess(`Đã đăng ký thành công vào phòng ${availableRoom.building} - ${availableRoom.roomNumber}`);
      setAutoRegisterDialogOpen(false);
      navigate('/student/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể đăng ký phòng tự động');
    } finally {
      setAutoRegistering(false);
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <BackButton />
          <Typography variant="h4" gutterBottom>
              Danh sách phòng có sẵn
          </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAutoRegisterDialogOpen(true)}
            disabled={hasRoomAssignment || rooms.length === 0}
          >
            Đăng ký tự động
          </Button>
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

        {hasRoomAssignment && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Bạn đã có yêu cầu đăng ký phòng đang chờ phê duyệt hoặc đã được gán phòng.
          </Alert>
        )}

        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Phòng {room.roomNumber}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Tòa {room.building}
                  </Typography>
                  <Typography variant="body2">
                    Loại phòng: {room.type}
                  </Typography>
                  <Typography variant="body2">
                    Giá phòng: {room.price.toLocaleString('vi-VN')} VNĐ/tháng
                  </Typography>
                  <Typography variant="body2">
                    Sức chứa: {room.currentOccupancy}/{room.capacity}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Trạng thái: {room.status}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => handleRegisterRoom(room.id)}
                    disabled={hasRoomAssignment}
                  >
                    Đăng ký
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Dialog xác nhận đăng ký tự động */}
      <Dialog
        open={autoRegisterDialogOpen}
        onClose={() => !autoRegistering && setAutoRegisterDialogOpen(false)}
      >
        <DialogTitle>Xác nhận đăng ký tự động</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hệ thống sẽ tự động đăng ký bạn vào phòng còn trống đầu tiên phù hợp với giới tính và năm học của bạn. Bạn có chắc chắn muốn tiếp tục?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setAutoRegisterDialogOpen(false)} 
            disabled={autoRegistering}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleAutoRegister} 
            color="primary" 
            disabled={autoRegistering}
            autoFocus
          >
            {autoRegistering ? <CircularProgress size={24} /> : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận đăng ký thủ công */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => !loading && setConfirmDialogOpen(false)}
      >
        <DialogTitle>Xác nhận đăng ký phòng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Yêu cầu đăng ký phòng của bạn sẽ được gửi để xét duyệt. Bạn có chắc chắn muốn tiếp tục?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialogOpen(false)} 
            disabled={loading}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleConfirmRegister} 
            color="primary" 
            disabled={loading}
            autoFocus
          >
            {loading ? <CircularProgress size={24} /> : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 

export default AvailableRooms; 