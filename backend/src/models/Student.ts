import { DataTypes, Model } from 'sequelize';
import sequelize from './database';
import { User } from './User';
import bcrypt from 'bcrypt';

export interface StudentAttributes {
  id?: number;
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  userData?: User;
  password?: string;
  year?: number;
}

class Student extends Model<StudentAttributes> implements StudentAttributes {
  public id!: number;
  public studentId!: string;
  public fullName!: string;
  public dateOfBirth!: string;
  public gender!: string;
  public address!: string;
  public phone!: string;
  public email!: string;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public userData?: User;
  public password?: string;
  public year?: number;
}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Nam', 'Nữ', 'Khác']],
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^[0-9]{10}$/, // Số điện thoại 10 chữ số
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 5
      }
    }
  },
  {
    sequelize,
    tableName: 'students',
    timestamps: true,
    hooks: {
      beforeCreate: async (student: Student) => {
        if (student.password) {
          const salt = await bcrypt.genSalt(10);
          student.password = await bcrypt.hash(student.password, salt);
        }
      },
    },
  }
);

export { Student }; 