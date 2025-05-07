import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

export const studentController = {
  // Đăng ký sinh viên
  async registerStudent(req: Request, res: Response) {
    try {
      const {
        studentId,
        fullName,
        dateOfBirth,
        gender,
        address,
        phone,
        email,
        password,
        year
      } = req.body;
      
      // Kiểm tra dữ liệu bắt buộc
      if (!studentId || !fullName || !dateOfBirth || !gender || !address || !phone || !email || !password || !year) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc'
        });
      }

      // Kiểm tra giới tính hợp lệ
      if (!['Nam', 'Nữ', 'Khác'].includes(gender)) {
        return res.status(400).json({
          success: false,
          message: 'Giới tính không hợp lệ'
        });
      }

      // Kiểm tra số điện thoại hợp lệ
      if (!/^[0-9]{10}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại không hợp lệ'
        });
      }

      // Kiểm tra email hợp lệ
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email không hợp lệ'
        });
      }

      // Kiểm tra mã sinh viên đã tồn tại
      const existingStudent = await Student.findOne({ where: { studentId } });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Mã sinh viên đã tồn tại'
        });
      }

      // Kiểm tra email đã tồn tại
      const existingEmail = await Student.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email đã tồn tại'
        });
      }

      // Kiểm tra username đã tồn tại
      const existingUser = await User.findOne({ where: { username: studentId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Mã sinh viên đã được sử dụng làm tên đăng nhập'
        });
      }

      // Tạo user mới cho sinh viên
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username: studentId,
        password: hashedPassword,
        role: 'student'
      });

      // Tạo sinh viên với userId từ user vừa tạo
      const student = await Student.create({
        studentId,
        fullName,
        dateOfBirth,
        gender,
        address,
        phone,
        email,
        password: hashedPassword,
        year: parseInt(year) || 1,
        userId: user.id
      });
      
      res.status(201).json({
        success: true,
        message: 'Đăng ký sinh viên thành công',
        data: {
          student,
          user
        }
      });
    } catch (error: any) {
      // Nếu có lỗi, xóa user đã tạo (nếu có)
      if (error.userId) {
        await User.destroy({ where: { id: error.userId } });
      }
      
      console.error('Error registering student:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Lấy danh sách sinh viên
  async getAllStudents(req: Request, res: Response) {
    try {
      const students = await Student.findAll();
      res.status(200).json({
        success: true,
        data: students
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Lấy thông tin sinh viên theo ID
  async getStudentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const student = await Student.findByPk(id);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sinh viên'
        });
      }

      res.status(200).json({
        success: true,
        data: student
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Lấy thông tin sinh viên theo userId
  async getStudentByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const student = await Student.findOne({
        where: { userId },
        include: [{
          model: User,
          as: 'userData',
          attributes: ['id', 'username', 'email', 'role']
        }]
      });
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sinh viên'
        });
      }

      res.status(200).json({
        success: true,
        data: student
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Cập nhật thông tin sinh viên (yêu cầu quyền admin)
  async updateStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const studentData = req.body;
      
      const student = await Student.findByPk(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sinh viên'
        });
      }

      await student.update(studentData);
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin sinh viên thành công',
        data: student
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Cập nhật thông tin sinh viên (cho phép sinh viên tự cập nhật)
  async updateStudentProfile(req: Request, res: Response) {
    try {
      // Lấy userId từ token
      const userId = (req as any).user.id;
      
      // Tìm sinh viên theo userId
      const student = await Student.findOne({
        where: { userId }
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin sinh viên'
        });
      }

      const { dateOfBirth, address, phone, email } = req.body;

      // Kiểm tra số điện thoại hợp lệ
      if (phone && !/^[0-9]{10}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại không hợp lệ'
        });
      }

      // Kiểm tra email hợp lệ
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email không hợp lệ'
        });
      }

      // Kiểm tra email đã tồn tại (nếu có thay đổi email)
      if (email && email !== student.email) {
        const existingEmail = await Student.findOne({ where: { email } });
        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: 'Email đã tồn tại'
          });
        }
      }

      // Cập nhật thông tin
      await student.update({
        dateOfBirth: dateOfBirth || student.dateOfBirth,
        address: address || student.address,
        phone: phone || student.phone,
        email: email || student.email
      });

      res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin thành công',
        data: student
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  },

  // Xóa sinh viên
  async deleteStudent(req: Request, res: Response) {
    const t = await Student.sequelize!.transaction();
    
    try {
      const { id } = req.params;
      
      // Tìm sinh viên và include thông tin user
      const student = await Student.findByPk(id, {
        include: [{
          model: User,
          as: 'user'
        }],
        transaction: t
      });

      if (!student) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sinh viên'
        });
      }

      // Xóa sinh viên trước
      await student.destroy({ transaction: t });

      // Sau đó xóa user nếu có
      if (student.userId) {
        const user = await User.findByPk(student.userId, { transaction: t });
        if (user) {
          await user.destroy({ transaction: t });
        }
      }
      
      await t.commit();
      
      res.status(200).json({
        success: true,
        message: 'Xóa sinh viên thành công'
      });
    } catch (error: any) {
      await t.rollback();
      console.error('Error deleting student:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }
}; 