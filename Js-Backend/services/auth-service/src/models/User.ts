import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role: 'customer' | 'admin' | 'b2b';
  isVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      sparse: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'b2b'],
      default: 'customer',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpiry: Date,
    resetToken: String,
    resetTokenExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);

// Made with Bob
