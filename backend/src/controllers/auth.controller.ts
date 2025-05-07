import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Student } from "../models/Student";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Tên đăng nhập hoặc mật khẩu không đúng"
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Tên đăng nhập hoặc mật khẩu không đúng"
        });
      }

      const token = jwt.sign(
        { 
          id: user.id,
          username: user.username,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Lỗi server",
        error: error.message
      });
    }
  },

  async register(req: Request, res: Response) {
    try {
      const { username, password, role } = req.body;

      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Tên đăng nhập đã tồn tại"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        password: hashedPassword,
        role: role || "user"
      });

      res.status(201).json({
        success: true,
        message: "Đăng ký thành công",
        data: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Lỗi server",
        error: error.message
      });
    }
  },

  async registerStudent(req: Request, res: Response) {
    try {
      const { studentId, fullName, dateOfBirth, gender, address, phone, email, password, year } = req.body;

      // Kiểm tra email đã tồn tại
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được sử dụng'
        });
      }

      // Kiểm tra studentId đã tồn tại
      const existingStudent = await Student.findOne({ where: { studentId } });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Mã sinh viên đã tồn tại'
        });
      }

      // Tạo user mới
      const user = await User.create({
        username: studentId,
        email,
        password,
        role: 'student'
      });

      // Tạo student profile
      const student = await Student.create({
        studentId,
        fullName,
        dateOfBirth,
        gender,
        address,
        phone,
        email,
        year: parseInt(year),
        userId: user.id
      });

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: {
          id: user.id,
          studentId: student.studentId,
          fullName: student.fullName,
          email: user.email,
          role: user.role,
          year: student.year
        }
      });
    } catch (error: any) {
      console.error('Register student error:', error);
      res.status(500).json({
        success: false,
        message: error?.message || 'Lỗi server'
      });
    }
  }
}; 