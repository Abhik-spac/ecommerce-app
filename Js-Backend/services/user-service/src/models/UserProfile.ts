import mongoose, { Schema, Document } from 'mongoose';

interface IAddress {
  _id?: any;
  type: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

interface IPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface IUserProfile extends Document {
  userId: string;
  addresses: IAddress[];
  preferences: IPreferences;
  wishlist: string[];
}

const AddressSchema = new Schema({
  type: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' },
  isDefault: { type: Boolean, default: false },
});

const UserProfileSchema = new Schema<IUserProfile>({
  userId: { type: String, required: true, unique: true },
  addresses: [AddressSchema],
  preferences: {
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'INR' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
  },
  wishlist: [{ type: String }],
}, { timestamps: true });

UserProfileSchema.index({ userId: 1 });

export const UserProfile = mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);

// Made with Bob
