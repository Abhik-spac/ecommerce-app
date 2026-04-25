import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'customer'
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Made with Bob