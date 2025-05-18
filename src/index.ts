import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/authRoutes';
import { seedDefaultRoles } from './seeders/defaultRoles';

dotenv.config();

class AuthServer {
  private app: express.Application;
  private port: number | string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    this.app.use('/api/v1/auth', authRoutes);
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK' });
    });
  }

  public async start(): Promise<void> {
    await initializeDatabase();
    await seedDefaultRoles();

    this.app.listen(this.port, () => {
      console.log(`Auth service running on port ${this.port}`);
    });
  }
}

const server = new AuthServer();
server.start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
