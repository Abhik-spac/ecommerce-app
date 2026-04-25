/**
 * Authentication-related type definitions
 */

import { UserRole } from './user.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface OtpLoginDto {
  phone: string;
}

export interface OtpVerifyDto {
  phone: string;
  otp: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  expiresIn?: number; // seconds
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SocialLoginDto {
  provider: 'google' | 'facebook' | 'apple';
  token: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface VerifyEmailDto {
  token: string;
}

export interface VerifyPhoneDto {
  phone: string;
  otp: string;
}

export interface AuthSession {
  sessionId: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
}

// Made with Bob
