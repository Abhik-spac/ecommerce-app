import { Router } from 'express';
import {
  register,
  login,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  verifyToken,
} from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify', verifyToken);

export default router;

// Made with Bob
