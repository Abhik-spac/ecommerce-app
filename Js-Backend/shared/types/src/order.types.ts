/**
 * Order-related type definitions
 */

import { Timestamps, Address } from './common.types';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export enum FulfillmentStatus {
  UNFULFILLED = 'UNFULFILLED',
  PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
  FULFILLED = 'FULFILLED',
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  UPI = 'UPI',
  NET_BANKING = 'NET_BANKING',
  WALLET = 'WALLET',
  COD = 'COD',
}

export interface Order extends Timestamps {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  items: OrderItem[];
  pricing: OrderPricing;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentDetails?: PaymentDetails;
  timeline: OrderTimeline;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  image: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
  attributes?: Record<string, string>;
}

export interface OrderPricing {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  couponCode?: string;
}

export interface OrderTimeline {
  placedAt: Date;
  confirmedAt?: Date;
  processingAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
}

export interface PaymentDetails {
  transactionId: string;
  gateway: string;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt?: Date;
  failureReason?: string;
}

export interface CreateOrderDto {
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  notes?: string;
}

export interface OrderSearchParams {
  userId?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  fromDate?: Date;
  toDate?: Date;
  orderNumber?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'total' | 'orderNumber';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
}

export interface Shipment extends Timestamps {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
  shippedAt?: Date;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  trackingUrl?: string;
}

export interface Refund extends Timestamps {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  processedAt?: Date;
  transactionId?: string;
}

// Made with Bob
