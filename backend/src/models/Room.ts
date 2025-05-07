
import { DataTypes, Model } from 'sequelize';
import sequelize from './database';
import { RoomAssignment } from './RoomAssignment';
import { Student } from './Student';

export interface RoomAttributes {
  id?: number;
  roomNumber: string;
  building: string;
  floor: number;
  capacity: number;
  type: 'standard' | 'deluxe' | 'suite';
  price: number;
  status: 'available' | 'Đã có Người ở' | 'Room đầy' | 'maintenance';
  createdAt?: Date;
  updatedAt?: Date;
  roomAssignments?: RoomAssignment[];
}

interface RoomOutput extends Required<RoomAttributes> {
  roomAssignments: (RoomAssignment & {
    student: Student;
  })[];
}

class Room extends Model<RoomAttributes> implements RoomAttributes {
  public id!: number;
  public roomNumber!: string;
  public building!: string;
  public floor!: number;
  public capacity!: number;
  public type!: 'standard' | 'deluxe' | 'suite';
  public price!: number;
  public status!: 'available' | 'Đã có Người ở' | 'Room đầy' | 'maintenance';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public roomAssignments?: RoomAssignment[];

  public readonly get!: () => RoomOutput;
}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roomNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    building: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('standard', 'deluxe', 'suite'),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('available', 'Đã có Người ở', 'Room đầy', 'maintenance'),
      allowNull: false,
      defaultValue: 'available',
    }
  },
  {
    sequelize,
    tableName: 'rooms',
  }
);

export default Room; 