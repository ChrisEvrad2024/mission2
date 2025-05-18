import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
      const user = await User.findByPk(decoded.userId, {
        include: [Role]
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  } else {
    res.status(401).json({ message: 'Authorization header missing' });
  }
};

export const authorizeRole = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const rolePermissions = user.role.permissions as Record<string, boolean>;
    const hasPermission = requiredPermissions.some(permission => rolePermissions[permission]);

    if (!hasPermission) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};
