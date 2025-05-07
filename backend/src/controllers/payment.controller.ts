import { Request, Response } from 'express';
import Payment from '../models/Payment';
import { Student } from '../models/Student';
import { Op } from 'sequelize';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Cấu hình multer để lưu file upload
const storage = multer.diskStorage({
  destination: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = 'uploads/payments';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage,
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export const paymentController = {
  // Tạo thanh toán mới
  async createPayment(req: Request, res: Response) {
    try {
      const { studentId, amount, month, year } = req.body;
      
      // Kiểm tra xem sinh viên đã thanh toán cho tháng này chưa
      const existingPayment = await Payment.findOne({
        where: {
          studentId,
          month,
          year,
          status: {
            [Op.not]: 'rejected'
          }
        }
      });

      if (existingPayment) {
        return res.status(400).json({
          success: false,
          message: 'Bạn đã thanh toán cho tháng này hoặc đang chờ xác nhận'
        });
      }

      // Kiểm tra file ảnh
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng tải lên hình ảnh chứng minh thanh toán'
        });
      }

      const payment = await Payment.create({
        studentId,
        amount,
        month,
        year,
        paymentDate: new Date(),
        evidenceImage: req.file.path,
        status: 'pending'
      });

      res.status(201).json({
        success: true,
        message: 'Đã gửi yêu cầu thanh toán thành công',
        data: payment
      });
    } catch (error: any) {
      console.error('Error creating payment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Lấy danh sách thanh toán của sinh viên
  async getStudentPayments(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      
      const payments = await Payment.findAll({
        where: { studentId },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'studentId', 'fullName']
          }
        ]
      });

      res.status(200).json({
        success: true,
        data: payments
      });
    } catch (error: any) {
      console.error('Error fetching student payments:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Lấy thông tin thanh toán theo ID
  async getPaymentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const payment = await Payment.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'studentId', 'fullName']
          }
        ]
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin thanh toán'
        });
      }

      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error: any) {
      console.error('Error fetching payment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Kiểm tra thanh toán của tháng hiện tại
  async checkCurrentMonthPayment(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      const payment = await Payment.findOne({
        where: {
          studentId,
          month: currentMonth,
          year: currentYear,
          status: {
            [Op.not]: 'rejected'
          }
        }
      });

      res.status(200).json({
        success: true,
        data: {
          hasPayment: !!payment,
          payment
        }
      });
    } catch (error: any) {
      console.error('Error checking current month payment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Lấy tất cả thanh toán (cho admin)
  getAllPayments: async (req: Request, res: Response) => {
    try {
      const payments = await Payment.findAll({
        include: [{
          model: Student,
          as: 'student',
          attributes: ['id', 'studentId', 'fullName']
        }],
        order: [['createdAt', 'DESC']]
      });
      res.json({
        success: true,
        data: payments
      });
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error?.message || 'Unknown error'
      });
    }
  },

  // Chấp nhận thanh toán
  approvePayment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findByPk(id);
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thanh toán'
        });
      }

      payment.status = 'approved';
      await payment.save();

      res.json({
        success: true,
        message: 'Đã chấp nhận thanh toán thành công',
        data: payment
      });
    } catch (error: any) {
      console.error('Error approving payment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error?.message || 'Unknown error'
      });
    }
  },

  // Từ chối thanh toán
  rejectPayment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const payment = await Payment.findByPk(id);
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thanh toán'
        });
      }

      payment.status = 'rejected';
      payment.rejectionReason = reason;
      await payment.save();

      res.json({
        success: true,
        message: 'Đã từ chối thanh toán thành công',
        data: payment
      });
    } catch (error: any) {
      console.error('Error rejecting payment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error?.message || 'Unknown error'
      });
    }
  }
}; 