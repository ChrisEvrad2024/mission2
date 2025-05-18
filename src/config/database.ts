import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { RefreshToken } from '../models/RefreshToken';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'auth_service',
  models: [User, Role, RefreshToken],
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;
