import express from 'express';
import {
  register,
  login,
  refreshToken,
  getCurrentUser
} from '../controllers/authController';
import { authenticateJWT } from '../middlewares/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get('/me', authenticateJWT, getCurrentUser);

export default router;
