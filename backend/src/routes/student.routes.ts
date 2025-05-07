import express from 'express';
import { studentController } from '../controllers/student.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Đăng ký sinh viên (yêu cầu quyền admin)
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, studentController.registerStudent);

// Lấy danh sách sinh viên (yêu cầu đăng nhập)
router.get('/', authMiddleware.verifyToken, studentController.getAllStudents);

// Cập nhật thông tin sinh viên (cho phép sinh viên tự cập nhật)
router.put('/profile', authMiddleware.verifyToken, studentController.updateStudentProfile);

// Lấy thông tin sinh viên theo ID (yêu cầu đăng nhập)
router.get('/:id', authMiddleware.verifyToken, studentController.getStudentById);

// Lấy thông tin sinh viên theo userId (yêu cầu đăng nhập)
router.get('/user/:userId', authMiddleware.verifyToken, studentController.getStudentByUserId);

// Cập nhật thông tin sinh viên (yêu cầu quyền admin)
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, studentController.updateStudent);

// Xóa sinh viên (yêu cầu quyền admin)
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, studentController.deleteStudent);

export default router; 