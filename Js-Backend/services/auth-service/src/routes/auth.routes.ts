import { Router } from 'express';
import {
  register,
  login,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  verifyToken,
  createGuestSession,
  getCurrentUser,
} from '../controllers/auth.controller';

const router = Router();

// User authentication
router.post('/register', register);
router.post('/login', login);
router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Token verification and user info
router.get('/verify', verifyToken);
router.get('/me', getCurrentUser);

// Guest session
router.post('/guest/create', createGuestSession);

export default router;

// Made with Bob
