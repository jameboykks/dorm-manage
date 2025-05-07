
import { DataTypes, Model } from 'sequelize';
import sequelize from './database';
import { User } from './User';

export interface NotificationAttributes {
  id?: number;
  userId: number | null;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class Notification extends Model<NotificationAttributes> implements NotificationAttributes {
  public id!: number;
  public userId!: number | null;
  public title!: string;
  public content!: string;
  public type!: string;
  public isRead!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'general'
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
  }
);

// Define association with User
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

export { Notification }; 