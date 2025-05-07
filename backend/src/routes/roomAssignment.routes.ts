
import express from 'express';
import { roomAssignmentController } from '../controllers/roomAssignment.controller';
import { authenticateToken } from '../middleware/auth';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Gán sinh viên vào phòng
router.post('/assign', authenticateToken, roomAssignmentController.assignRoom);

// Lấy danh sách gán phòng
router.get('/', authenticateToken, roomAssignmentController.getRoomAssignments);

// Phê duyệt yêu cầu đăng ký phòng
router.put('/:id/approve', authenticateToken, roomAssignmentController.approveAssignment);

// Từ chối yêu cầu đăng ký phòng
router.put('/:id/reject', authenticateToken, roomAssignmentController.rejectAssignment);

// Xóa gán phòng
router.delete('/:id', authenticateToken, roomAssignmentController.removeAssignment);

export default router; 