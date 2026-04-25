import mongoose, { Schema, Document } from 'mongoose';

export interface IProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
  isDefault: boolean;
}

export interface IProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  attributes: Record<string, string>;
  inventory: {
    quantity: number;
    lowStockThreshold: number;
    trackInventory: boolean;
    allowBackorder: boolean;
    sku: string;
  };
}

export interface IProductAttribute {
  name: string;
  value: string;
  displayOrder: number;
}

export interface IProductInventory {
  quantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  sku: string;
}

export interface IProduct extends Document {
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  status: string;
  images: IProductImage[];
  variants: IProductVariant[];
  attributes: IProductAttribute[];
  inventory: IProductInventory;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  // Legacy fields for backward compatibility
  category?: string;
  brand?: string;
  stock?: number;
  specifications?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema({
  id: { type: String, required: true },
  url: { type: String, required: true },
  alt: { type: String, default: '' },
  position: { type: Number, default: 0 },
  isDefault: { type: Boolean, default: false }
});

const ProductInventorySchema = new Schema({
  quantity: { type: Number, required: true, default: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  trackInventory: { type: Boolean, default: true },
  allowBackorder: { type: Boolean, default: false },
  sku: { type: String, required: true }
});

const ProductVariantSchema = new Schema({
  id: { type: String, required: true },
  sku: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  attributes: { type: Map, of: String },
  inventory: { type: ProductInventorySchema, required: true }
});

const ProductAttributeSchema = new Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  displayOrder: { type: Number, default: 0 }
});

const ProductSchema: Schema = new Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      default: '',
    },
    categoryId: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
    },
    images: {
      type: [ProductImageSchema],
      default: [],
    },
    variants: {
      type: [ProductVariantSchema],
      default: [],
    },
    attributes: {
      type: [ProductAttributeSchema],
      default: [],
    },
    inventory: {
      type: ProductInventorySchema,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    // Legacy fields
    category: {
      type: String,
      index: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    specifications: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filtering
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ brand: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);

// Made with Bob
