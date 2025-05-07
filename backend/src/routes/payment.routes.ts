import express from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

// Admin routes - phải đặt trước các route có tham số
router.get('/admin', authMiddleware.verifyToken, authMiddleware.isAdmin, paymentController.getAllPayments);
router.post('/:id/approve', authMiddleware.verifyToken, authMiddleware.isAdmin, paymentController.approvePayment);
router.post('/:id/reject', authMiddleware.verifyToken, authMiddleware.isAdmin, paymentController.rejectPayment);

// Tạo thanh toán mới (yêu cầu đăng nhập)
router.post('/', authMiddleware.verifyToken, upload.single('evidenceImage'), paymentController.createPayment);

// Lấy danh sách thanh toán của sinh viên (yêu cầu đăng nhập)
router.get('/student/:studentId', authMiddleware.verifyToken, paymentController.getStudentPayments);

// Kiểm tra thanh toán của tháng hiện tại (yêu cầu đăng nhập)
router.get('/check-current-month/:studentId', authMiddleware.verifyToken, paymentController.checkCurrentMonthPayment);

// Lấy thông tin thanh toán theo ID (yêu cầu đăng nhập)
router.get('/:id', authMiddleware.verifyToken, paymentController.getPaymentById);

export default router; 