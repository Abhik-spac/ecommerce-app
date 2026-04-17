export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  status: string;
  images: ProductImage[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  inventory: ProductInventory;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
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
  attributes: { [key: string]: string };
  inventory: ProductInventory;
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

// Made with Bob
