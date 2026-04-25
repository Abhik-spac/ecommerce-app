/**
 * Cart-related type definitions
 */

import { Timestamps } from './common.types';

export interface Cart extends Timestamps {
  id: string;
  userId?: string; // Optional for guest carts
  sessionId: string;
  items: CartItem[];
  pricing: CartPricing;
  expiresAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  attributes?: Record<string, string>;
  maxQuantity?: number;
}

export interface CartPricing {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
}

export interface AddToCartDto {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface ApplyCouponDto {
  code: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
}

// Made with Bob
