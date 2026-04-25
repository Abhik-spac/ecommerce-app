import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  sku: string;
  stock: number;
  images: string[];
  specifications?: Record<string, any>;
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    specifications: {
      type: Schema.Types.Mixed,
      default: {},
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
