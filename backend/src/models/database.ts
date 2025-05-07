
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'dormitory_management',
  process.env.DB_USERNAME || 'root',
  process.env.DB_PASSWORD || 'D7y2p0a1!',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: true,
  }
);

export default sequelize; 