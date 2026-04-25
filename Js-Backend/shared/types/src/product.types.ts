/**
 * Product-related type definitions
 */

import { Timestamps } from './common.types';

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED',
}

export interface Product extends Timestamps {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  status: ProductStatus;
  images: ProductImage[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  inventory: ProductInventory;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  seo?: ProductSeo;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
  isDefault: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  attributes: Record<string, string>;
  inventory: ProductInventory;
  image?: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
  displayOrder: number;
}

export interface ProductInventory {
  quantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  sku: string;
}

export interface ProductSeo {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
}

export interface Category extends Timestamps {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  position: number;
  isActive: boolean;
}

export interface CreateProductDto {
  sku: string;
  name: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  images?: Omit<ProductImage, 'id'>[];
  attributes?: ProductAttribute[];
  inventory: Omit<ProductInventory, 'sku'>;
  tags?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  shortDescription?: string;
  categoryId?: string;
  price?: number;
  compareAtPrice?: number;
  status?: ProductStatus;
  images?: ProductImage[];
  attributes?: ProductAttribute[];
  inventory?: ProductInventory;
  tags?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface ProductSearchParams {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  status?: ProductStatus;
  isFeatured?: boolean;
  isNew?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'name' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductReview extends Timestamps {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// Made with Bob
