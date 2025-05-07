
import express from 'express';
import { roomController } from '../controllers/room.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Đăng ký phòng mới (yêu cầu quyền admin)
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, roomController.registerRoom);

// Lấy danh sách phòng (yêu cầu đăng nhập)
router.get('/', authMiddleware.verifyToken, roomController.getAllRooms);

// Lấy thông tin phòng theo ID (yêu cầu đăng nhập)
router.get('/:id', authMiddleware.verifyToken, roomController.getRoomById);

// Cập nhật thông tin phòng (yêu cầu quyền admin)
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, roomController.updateRoom);

// Xóa phòng (yêu cầu quyền admin)
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, roomController.deleteRoom);

export default router; 