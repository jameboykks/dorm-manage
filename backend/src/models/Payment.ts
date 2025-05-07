import { DataTypes, Model } from 'sequelize';
import sequelize from './database';
import { Student } from './Student';

export interface PaymentAttributes {
  id?: number;
  studentId: number;
  amount: number;
  paymentDate: Date;
  evidenceImage: string;
  status: 'pending' | 'approved' | 'rejected';
  month: number;
  year: number;
  rejectionReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
  student?: Student;
}

class Payment extends Model<PaymentAttributes> implements PaymentAttributes {
  public id!: number;
  public studentId!: number;
  public amount!: number;
  public paymentDate!: Date;
  public evidenceImage!: string;
  public status!: 'pending' | 'approved' | 'rejected';
  public month!: number;
  public year!: number;
  public rejectionReason!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public student?: Student;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Students',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    evidenceImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Payments',
  }
);

// Thiết lập mối quan hệ
Payment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Student.hasMany(Payment, { foreignKey: 'studentId', as: 'payments' });

export default Payment; 