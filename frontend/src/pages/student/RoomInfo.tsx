import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  ListItemAvatar
} from '@mui/material';
import { roomAssignmentService } from '../../services/roomAssignment.service';
import { roomService } from '../../services/room.service';
import { authService } from '../../services/auth.service';
import { studentService } from '../../services/student.service';
import { Room } from '../../types/room';
import { RoomAssignment } from '../../types/roomAssignment';
import PersonIcon from '@mui/icons-material/Person';
import BackButton from '../../components/BackButton';

interface Roommate {
  id: number;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export const RoomInfo: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roomInfo, setRoomInfo] = useState<Room | null>(null);
  const [assignment, setAssignment] = useState<RoomAssignment | null>(null);
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchRoomInfo();
  }, []);

  const fetchRoomInfo = async () => {
    try {
      setLoading(true);
      setError('');

      if (!currentUser?.user.id) {
        setError('Không tìm thấy thông tin người dùng');
        return;
      }

      // Lấy thông tin sinh viên
      const studentResponse = await studentService.getStudentByUserId(currentUser.user.id);
      const studentId = studentResponse.data.id;

      // Lấy danh sách yêu cầu đăng ký phòng
      const assignmentsResponse = await roomAssignmentService.getRoomAssignments();
      const assignments = assignmentsResponse.data || [];

      // Tìm yêu cầu đăng ký phòng đang active của sinh viên
      const activeAssignment = assignments.find((assignment: RoomAssignment) => 
        assignment.studentId === studentId && 
        assignment.status === 'active'
      );

      if (!activeAssignment) {
        setError('Bạn chưa được gán phòng');
        return;
      }

      setAssignment(activeAssignment);

      // Lấy thông tin phòng
      const roomResponse = await roomService.getRoomById(activeAssignment.roomId);
      setRoomInfo(roomResponse.data);

      // Lấy danh sách sinh viên trong phòng
      const activeAssignments = assignments.filter((assignment: RoomAssignment) => 
        assignment.roomId === activeAssignment.roomId && 
        assignment.status === 'active' &&
        assignment.studentId !== studentId
      );

      // Lấy thông tin chi tiết của từng sinh viên
      const roommatesPromises = activeAssignments.map(async (assignment: RoomAssignment) => {
        const studentResponse = await studentService.getStudentById(assignment.studentId);
        return {
          id: studentResponse.data.id,
          fullName: studentResponse.data.fullName,
          phoneNumber: studentResponse.data.phoneNumber,
          dateOfBirth: studentResponse.data.dateOfBirth,
        };
      });

      const roommatesData = await Promise.all(roommatesPromises);
      setRoommates(roommatesData);

    } catch (err: any) {
      console.error('Error fetching room info:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin phòng');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, mt: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Box mt={2}>
            <Button variant="contained" onClick={() => navigate('/student/home')}>
              Quay lại
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (!roomInfo || !assignment) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box display="flex" flexDirection="column" mb={3}>
          <BackButton />
          <Typography variant="h4" gutterBottom>
            Thông tin phòng
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thông tin phòng
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Số phòng" 
                      secondary={roomInfo.roomNumber} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Tòa nhà" 
                      secondary={roomInfo.building} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Tầng" 
                      secondary={roomInfo.floor} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Loại phòng" 
                      secondary={roomInfo.type} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Giá phòng" 
                      secondary={`${roomInfo.price.toLocaleString('vi-VN')} VNĐ/tháng`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Sức chứa" 
                      secondary={`${roomInfo.currentOccupancy}/${roomInfo.capacity}`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Trạng thái" 
                      secondary={
                        <Chip 
                          label={roomInfo.status} 
                          color={roomInfo.status === 'available' ? 'success' : 'primary'} 
                        />
                      } 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thông tin đăng ký
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Ngày bắt đầu" 
                      secondary={new Date(assignment.startDate).toLocaleDateString('vi-VN')} 
                    />
                  </ListItem>
                  {assignment.endDate && (
                    <ListItem>
                      <ListItemText 
                        primary="Ngày kết thúc" 
                        secondary={new Date(assignment.endDate).toLocaleDateString('vi-VN')} 
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemText 
                      primary="Trạng thái" 
                      secondary={
                        <Chip 
                          label={assignment.status === 'active' ? 'Đang ở' : 'Chờ xét duyệt'} 
                          color={assignment.status === 'active' ? 'success' : 'warning'} 
                        />
                      } 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sinh viên cùng phòng
                </Typography>
                {roommates.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Hiện tại không có sinh viên nào ở cùng phòng
                  </Typography>
                ) : (
                  <List>
                    {roommates.map((roommate) => (
                      <ListItem key={roommate.id}>
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={roommate.fullName}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                SĐT: {roommate.phoneNumber}
                              </Typography>
                              <br />
                              <Typography component="span" variant="body2">
                                Ngày sinh: {new Date(roommate.dateOfBirth).toLocaleDateString('vi-VN')}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}; 