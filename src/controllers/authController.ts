import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 12 characters long and include uppercase, lowercase, number, and special character'
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const defaultRole = await Role.findOne({ where: { name: role || 'user' } });

    if (!defaultRole) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.create({
      email,
      password_hash: hashedPassword,
      role_id: defaultRole.id
    });

    res.status(201).json({
      message: 'User created successfully',
      userId: user.id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ 
      where: { email },
      include: [Role]
    });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is disabled' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role.name },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // Store refresh token
    await RefreshToken.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Update user last login
    user.last_login = new Date();
    user.failed_attempts = 0;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      expiresIn: 15 * 60 // 15 minutes in seconds
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const storedToken = await RefreshToken.findOne({
      where: { token: refreshToken, revoked: false }
    });

    if (!storedToken || storedToken.expires_at < new Date()) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: number };
    const user = await User.findByPk(decoded.userId, { include: [Role] });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role.name },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    res.json({
      accessToken: newAccessToken,
      expiresIn: 15 * 60 // 15 minutes in seconds
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userData = {
      id: user.id,
      email: user.email,
      role: user.role.name,
      is_active: user.is_active,
      last_login: user.last_login,
      mfa_enabled: user.mfa_enabled
    };

    res.json(userData);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
