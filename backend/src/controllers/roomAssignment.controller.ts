import { Request, Response } from 'express';
import { RoomAssignment } from '../models/RoomAssignment';
import { Student } from '../models/Student';
import Room from '../models/Room';
import { createNotification } from './notification.controller';
import { User } from '../models/User';

export const roomAssignmentController = {
  // Gán sinh viên vào phòng
  assignRoom: async (req: Request, res: Response) => {
    try {
      const { studentId, roomId, startDate, endDate, isAdmin } = req.body;

      // Kiểm tra sinh viên tồn tại
      const student = await Student.findByPk(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sinh viên'
        });
      }

      // Kiểm tra phòng tồn tại
      const room = await Room.findByPk(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy phòng'
        });
      }

      // Kiểm tra số lượng người đã đăng ký (cả pending và active)
      const totalAssignments = await RoomAssignment.count({
        where: { 
          roomId,
          status: ['active', 'pending']
        }
      });

      if (totalAssignments >= room.capacity) {
        return res.status(400).json({
          success: false,
          message: 'Phòng đã đầy hoặc có quá nhiều yêu cầu đăng ký đang chờ xét duyệt'
        });
      }

      // Kiểm tra sinh viên đã được gán phòng chưa
      const existingAssignment = await RoomAssignment.findOne({
        where: { 
          studentId,
          status: ['active', 'pending']
        }
      });

      if (existingAssignment) {
        return res.status(400).json({
          success: false,
          message: 'Sinh viên đã có yêu cầu đăng ký phòng hoặc đã được gán phòng'
        });
      }

      // Tạo gán phòng mới
      // Nếu là admin gán trực tiếp thì status là 'active', ngược lại là 'pending'
      const assignment = await RoomAssignment.create({
        studentId,
        roomId,
        startDate: startDate || new Date(),
        endDate: endDate || null,
        status: isAdmin ? 'active' : 'pending'
      });

      // Chỉ cập nhật trạng thái phòng khi admin gán trực tiếp
      if (isAdmin) {
        const currentAssignments = await RoomAssignment.count({
          where: { 
            roomId, 
            status: 'active' // Chỉ đếm các assignment đã được phê duyệt
          }
        });

        if (currentAssignments >= room.capacity) {
          await room.update({ status: 'Room đầy' });
        } else if (currentAssignments > 0) {
          await room.update({ status: 'Đã có Người ở' });
        }
      }

      res.status(201).json({
        success: true,
        message: isAdmin ? 'Đã gán sinh viên vào phòng' : 'Đã tạo yêu cầu đăng ký phòng',
        data: assignment
      });
    } catch (error: any) {
      console.error('Error in assignRoom:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Lấy danh sách gán phòng
  getRoomAssignments: async (req: Request, res: Response) => {
    try {
      const assignments = await RoomAssignment.findAll({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'studentId', 'fullName', 'email']
          },
          {
            model: Room,
            as: 'room',
            attributes: ['id', 'roomNumber', 'building']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: assignments
      });
    } catch (error: any) {
      console.error('Error in getRoomAssignments:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Hủy gán phòng
  removeAssignment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const assignment = await RoomAssignment.findByPk(id);
      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin gán phòng'
        });
      }

      // Cập nhật trạng thái phòng về available
      await Room.update(
        { status: 'available' },
        { where: { id: assignment.roomId } }
      );

      // Xóa gán phòng
      await assignment.destroy();

      res.json({
        success: true,
        message: 'Hủy gán phòng thành công'
      });
    } catch (error: any) {
      console.error('Error in removeAssignment:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Có lỗi xảy ra khi hủy gán phòng'
      });
    }
  },

  // Phê duyệt yêu cầu đăng ký phòng
  approveAssignment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Tìm yêu cầu đăng ký phòng
      const assignment = await RoomAssignment.findByPk(id, {
        include: [
          {
            model: Room,
            as: 'room'
          },
          {
            model: Student,
            as: 'student',
            include: [{
              model: User,
              as: 'userData'
            }]
          }
        ]
      });
      
      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy yêu cầu đăng ký phòng'
        });
      }
      
      if (assignment.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Yêu cầu đăng ký phòng này không ở trạng thái chờ phê duyệt'
        });
      }

      if (!assignment.room) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin phòng'
        });
      }

      if (!assignment.student || !assignment.student.userData) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin sinh viên'
        });
      }
      
      // Cập nhật trạng thái assignment thành active
      await assignment.update({ status: 'active' });
      
      // Cập nhật trạng thái phòng
      const currentAssignments = await RoomAssignment.count({
        where: { 
          roomId: assignment.roomId, 
          status: 'active'
        }
      });
      
      if (currentAssignments >= assignment.room.capacity) {
        await assignment.room.update({ status: 'Room đầy' });
      } else if (currentAssignments > 0) {
        await assignment.room.update({ status: 'Đã có Người ở' });
      }

      // Tạo thông báo cho sinh viên
      if (assignment.student?.userData?.id) {
        await createNotification(
          assignment.student.userData.id,
          'Yêu cầu đăng ký phòng đã được phê duyệt',
          `Yêu cầu đăng ký phòng ${assignment.room.building} - ${assignment.room.roomNumber} của bạn đã được phê duyệt.`,
          'success'
        );
      }
      
      res.status(200).json({
        success: true,
        message: 'Đã phê duyệt yêu cầu đăng ký phòng',
        data: assignment
      });
    } catch (error: any) {
      console.error('Error in approveAssignment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },
  
  // Từ chối yêu cầu đăng ký phòng
  rejectAssignment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Tìm yêu cầu đăng ký phòng
      const assignment = await RoomAssignment.findByPk(id, {
        include: [
          {
            model: Room,
            as: 'room'
          },
          {
            model: Student,
            as: 'student',
            include: [{
              model: User,
              as: 'userData'
            }]
          }
        ]
      });
      
      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy yêu cầu đăng ký phòng'
        });
      }
      
      if (assignment.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Yêu cầu đăng ký phòng này không ở trạng thái chờ phê duyệt'
        });
      }

      if (!assignment.student || !assignment.student.userData) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin sinh viên'
        });
      }
      
      // Cập nhật trạng thái yêu cầu đăng ký phòng
      await assignment.update({ status: 'cancelled' });

      // Tạo thông báo cho sinh viên
      if (assignment.room) {
        await createNotification(
          assignment.student.userData.id,
          'Yêu cầu đăng ký phòng bị từ chối',
          `Yêu cầu đăng ký phòng ${assignment.room.building} - ${assignment.room.roomNumber} của bạn đã bị từ chối.`
        );
      }
      
      res.status(200).json({
        success: true,
        message: 'Đã từ chối yêu cầu đăng ký phòng',
        data: assignment
      });
    } catch (error: any) {
      console.error('Error in rejectAssignment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }
}; 