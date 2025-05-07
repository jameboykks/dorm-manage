import { Request, Response } from 'express';
import Room, { RoomAttributes } from '../models/Room';
import { RoomAssignment } from '../models/RoomAssignment';
import { Student } from '../models/Student';

interface RoomWithAssignments extends RoomAttributes {
  roomAssignments?: Array<RoomAssignment & {
    student: Pick<Student, 'id' | 'fullName'>;
  }>;
}

export const roomController = {
  // Đăng ký phòng mới
  async registerRoom(req: Request, res: Response) {
    try {
      const roomData: RoomAttributes = req.body;
      const room = await Room.create(roomData);
      res.status(201).json({
        success: true,
        message: 'Đăng ký phòng thành công',
        data: room
      });
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Số phòng đã tồn tại'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Lấy danh sách phòng
  async getAllRooms(req: Request, res: Response) {
    try {
      const rooms = await Room.findAll({
        include: [{
          model: RoomAssignment,
          as: 'roomAssignments',
          required: false,
          where: {
            status: 'active'
          },
          include: [{
            model: Student,
            as: 'student',
            attributes: ['id', 'fullName']
          }]
        }],
        order: [
          ['building', 'ASC'],
          ['roomNumber', 'ASC']
        ]
      });

      const roomsWithCount = rooms.map(room => {
        const roomData = room.toJSON();
        const currentOccupancy = roomData.roomAssignments?.length || 0;
        
        // Cập nhật trạng thái phòng dựa trên số lượng assignment active
        let status = roomData.status;
        if (currentOccupancy >= roomData.capacity) {
          status = 'Room đầy';
        } else if (currentOccupancy > 0) {
          status = 'Đã có Người ở';
        } else {
          status = 'available';
        }
        
        return {
          ...roomData,
          status,
          currentOccupancy
        };
      });

      res.json({
        success: true,
        data: roomsWithCount
      });
    } catch (error: any) {
      console.error('Error in getAllRooms:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Lấy thông tin phòng theo ID
  async getRoomById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const room = await Room.findByPk(id);
      
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy phòng'
        });
      }

      res.status(200).json({
        success: true,
        data: room
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Cập nhật thông tin phòng
  async updateRoom(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const roomData: RoomAttributes = req.body;
      
      const room = await Room.findByPk(id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy phòng'
        });
      }

      await room.update(roomData);
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin phòng thành công',
        data: room
      });
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Số phòng đã tồn tại'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Xóa phòng
  async deleteRoom(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const room = await Room.findByPk(id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy phòng'
        });
      }

      await room.destroy();
      
      res.status(200).json({
        success: true,
        message: 'Xóa phòng thành công'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }
}; 