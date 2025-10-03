import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

interface AuthRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Create JWT token
    const payload = {
      id: admin._id,
      email: admin.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any
    });

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.status(200).json({
      success: true,
      admin
    });
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};