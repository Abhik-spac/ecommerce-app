/**
 * Common validation schemas using Joi
 */

import Joi from 'joi';

// User validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const otpLoginSchema = Joi.object({
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
});

export const otpVerifySchema = Joi.object({
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  otp: Joi.string().length(6).required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

// Product validation schemas
export const createProductSchema = Joi.object({
  sku: Joi.string().required(),
  name: Joi.string().min(3).max(200).required(),
  description: Joi.string().required(),
  shortDescription: Joi.string().max(500).required(),
  categoryId: Joi.string().required(),
  price: Joi.number().positive().required(),
  compareAtPrice: Joi.number().positive().optional(),
  images: Joi.array().items(Joi.object({
    url: Joi.string().uri().required(),
    alt: Joi.string().required(),
    position: Joi.number().integer().min(0).required(),
    isDefault: Joi.boolean().required(),
  })).optional(),
  attributes: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    value: Joi.string().required(),
    displayOrder: Joi.number().integer().min(0).required(),
  })).optional(),
  inventory: Joi.object({
    quantity: Joi.number().integer().min(0).required(),
    lowStockThreshold: Joi.number().integer().min(0).required(),
    trackInventory: Joi.boolean().required(),
    allowBackorder: Joi.boolean().required(),
  }).required(),
  tags: Joi.array().items(Joi.string()).optional(),
  isFeatured: Joi.boolean().optional(),
  isNew: Joi.boolean().optional(),
});

// Cart validation schemas
export const addToCartSchema = Joi.object({
  productId: Joi.string().required(),
  variantId: Joi.string().optional(),
  quantity: Joi.number().integer().min(1).required(),
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(0).required(),
});

// Order validation schemas
export const createOrderSchema = Joi.object({
  items: Joi.array().items(Joi.object({
    productId: Joi.string().required(),
    variantId: Joi.string().optional(),
    quantity: Joi.number().integer().min(1).required(),
  })).min(1).required(),
  shippingAddressId: Joi.string().required(),
  billingAddressId: Joi.string().required(),
  paymentMethod: Joi.string().valid(
    'CREDIT_CARD',
    'DEBIT_CARD',
    'UPI',
    'NET_BANKING',
    'WALLET',
    'COD'
  ).required(),
  couponCode: Joi.string().optional(),
  notes: Joi.string().max(500).optional(),
});

// Address validation schemas
export const addressSchema = Joi.object({
  type: Joi.string().valid('HOME', 'WORK', 'OTHER').required(),
  fullName: Joi.string().min(3).max(100).required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  addressLine1: Joi.string().min(5).max(200).required(),
  addressLine2: Joi.string().max(200).optional(),
  city: Joi.string().min(2).max(100).required(),
  state: Joi.string().min(2).max(100).required(),
  postalCode: Joi.string().pattern(/^\d{6}$/).required(),
  country: Joi.string().default('India').required(),
  isDefault: Joi.boolean().optional(),
});

// Pagination validation
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

// ID validation
export const idParamSchema = Joi.object({
  id: Joi.string().required(),
});

// Made with Bob
