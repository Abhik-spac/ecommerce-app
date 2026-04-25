import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
    type: 'user' | 'guest';
    guestId?: string;
  };
}

// Authenticate user or guest
export const authenticateOrGuest = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (decoded.type === 'guest') {
      req.user = {
        id: decoded.guestId,
        type: 'guest',
        guestId: decoded.guestId
      };
    } else {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || 'customer',
        type: 'user'
      };
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Authenticate only registered users (not guests)
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (decoded.type === 'guest') {
      return res.status(403).json({ error: 'This endpoint requires user authentication' });
    }
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'customer',
      type: 'user'
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Made with Bob