
import { DataTypes, Model } from 'sequelize';
import sequelize from './database';
import { Student } from './Student';
import Room from './Room';

export interface RoomAssignmentAttributes {
  id?: number;
  studentId: number;
  roomId: number;
  startDate: Date;
  endDate?: Date;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
  room?: Room;
  student?: Student;
}

class RoomAssignment extends Model<RoomAssignmentAttributes> implements RoomAssignmentAttributes {
  public id!: number;
  public studentId!: number;
  public roomId!: number;
  public startDate!: Date;
  public endDate?: Date;
  public status!: 'pending' | 'active' | 'completed' | 'cancelled';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public room?: Room;
  public student?: Student;
}

RoomAssignment.init(
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
        model: 'students',
        key: 'id',
      },
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rooms',
        key: 'id',
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'room_assignments',
    timestamps: true,
  }
);

export { RoomAssignment }; 