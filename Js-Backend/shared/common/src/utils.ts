/**
 * Common utility functions
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '@ecommerce/types';

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// JWT token generation and verification
export const generateAccessToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  const secret = process.env.JWT_ACCESS_SECRET || 'access-secret-key';
  const expiresIn = process.env.JWT_ACCESS_EXPIRY || '15m';
  
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key';
  const expiresIn = process.env.JWT_REFRESH_EXPIRY || '7d';
  
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_ACCESS_SECRET || 'access-secret-key';
  return jwt.verify(token, secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key';
  return jwt.verify(token, secret) as TokenPayload;
};

// Generate random OTP
export const generateOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  
  return otp;
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Slugify string
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Pagination helper
export const getPaginationParams = (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit };
};

export const getPaginationMeta = (
  total: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

// Format currency
export const formatCurrency = (
  amount: number,
  currency: string = 'INR'
): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Calculate tax
export const calculateTax = (amount: number, taxRate: number = 0.18): number => {
  return Math.round(amount * taxRate * 100) / 100;
};

// Sanitize user input
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '');
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Indian format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Generate order number
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Sleep utility for testing
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Deep clone object
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Remove undefined/null values from object
export const cleanObject = (obj: Record<string, any>): Record<string, any> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
};

// Made with Bob
