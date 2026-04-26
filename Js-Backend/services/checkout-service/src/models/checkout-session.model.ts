import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export interface ICheckoutSession extends Document {
  userId?: string;
  guestId?: string;
  currentStep: number;
  shippingAddress?: IAddress;
  billingAddress?: IAddress;
  paymentMethod?: string;
  cartSnapshot?: any;
  totalAmount?: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const AddressSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  phone: { type: String },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'India' }
}, { _id: false });

const CheckoutSessionSchema = new Schema({
  userId: { type: String, index: true },
  guestId: { type: String, index: true },
  currentStep: { type: Number, default: 1, min: 1, max: 4 },
  shippingAddress: { type: AddressSchema },
  billingAddress: { type: AddressSchema },
  paymentMethod: { type: String },
  cartSnapshot: { type: Schema.Types.Mixed },
  totalAmount: { type: Number },
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'],
    default: 'IN_PROGRESS'
  },
  completedAt: { type: Date }, // Timestamp when session was completed
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    index: { expires: 0 } // TTL index - MongoDB will auto-delete expired documents
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
CheckoutSessionSchema.index({ userId: 1, status: 1 });
CheckoutSessionSchema.index({ guestId: 1, status: 1 });

// Ensure either userId or guestId is present
CheckoutSessionSchema.pre('save', function() {
  if (!this.userId && !this.guestId) {
    throw new Error('Either userId or guestId must be provided');
  }
});

export const CheckoutSession = mongoose.model<ICheckoutSession>('CheckoutSession', CheckoutSessionSchema);

// Made with Bob