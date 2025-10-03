import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

interface AuthRequest extends Request {
  admin?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Get admin from database
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin) {
      res.status(401).json({ message: 'Token is not valid' });
      return;
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};