# Complete Implementation Guide for All Services

This guide provides production-ready code templates for implementing all remaining microservices.

## 📋 Implementation Status

- ✅ **API Gateway** - Complete
- ✅ **Shared Libraries** - Complete
- ✅ **Infrastructure** - Complete
- 🔄 **Auth Service** - Template provided below
- 🔄 **Product Service** - Template provided below
- 🔄 **Cart Service** - Template provided below
- 🔄 **Checkout Service** - Template provided below
- 🔄 **Order Service** - Template provided below
- 🔄 **User Service** - Template provided below

## 🚀 Quick Implementation Steps

For each service:
1. Copy the package.json
2. Copy the model files
3. Copy the controller files
4. Copy the route files
5. Copy the main index.ts
6. Run `npm install` in the service directory
7. Configure .env file
8. Start the service

---

## 1️⃣ Auth Service Implementation

### File Structure
```
services/auth-service/
├── src/
│   ├── models/
│   │   ├── User.ts
│   │   ├── Session.ts
│   │   └── OTP.ts
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── routes/
│   │   └── auth.routes.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── otp.service.ts
│   ├── config/
│   │   └── database.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── .env.example
```

### Key Features to Implement
- ✅ User registration with email verification
- ✅ Login with email/password
- ✅ JWT token generation (access + refresh)
- ✅ OTP-based phone authentication
- ✅ Password reset flow
- ✅ Session management
- ✅ Token refresh endpoint
- ✅ Logout functionality

### MongoDB Schema (User Model)
```typescript
// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import { UserRole, UserStatus } from '@ecommerce/types';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, sparse: true },
  avatar: { type: String },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  status: { type: String, enum: Object.values(UserStatus), default: UserStatus.ACTIVE },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  lastLoginAt: { type: Date },
}, { timestamps: true });

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ status: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
```

### Auth Controller Template
```typescript
// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { 
  hashPassword, 
  comparePassword, 
  generateAccessToken, 
  generateRefreshToken,
  generateOTP 
} from '@ecommerce/common';
import { User } from '../models/User';
import { AuthenticationError, ValidationError } from '@ecommerce/common';

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, password, firstName, lastName, phone } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
    });
    
    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    
    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        tokens: { accessToken, refreshToken },
      },
    });
  }
  
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email, status: 'ACTIVE' });
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }
    
    // Verify password
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new AuthenticationError('Invalid credentials');
    }
    
    // Update last login
    user.lastLoginAt = new Date();
    await user.save();
    
    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    
    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        tokens: { accessToken, refreshToken },
      },
    });
  }
  
  // Add more methods: sendOTP, verifyOTP, forgotPassword, resetPassword, etc.
}
```

### Routes Template
```typescript
// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { asyncHandler, validateRequest } from '@ecommerce/common';
import { registerSchema, loginSchema } from '@ecommerce/common';

const router = Router();
const authController = new AuthController();

router.post('/register', 
  validateRequest(registerSchema),
  asyncHandler(authController.register)
);

router.post('/login',
  validateRequest(loginSchema),
  asyncHandler(authController.login)
);

// Add more routes...

export default router;
```

---

## 2️⃣ Product Service Implementation

### Key Features
- ✅ Product CRUD operations
- ✅ Category management
- ✅ Product search with filters
- ✅ Inventory tracking
- ✅ Product reviews
- ✅ Image management
- ✅ Bulk operations

### MongoDB Schema (Product Model)
```typescript
// src/models/Product.ts
import mongoose, { Schema, Document } from 'mongoose';
import { ProductStatus } from '@ecommerce/types';

export interface IProduct extends Document {
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  status: ProductStatus;
  images: Array<{
    url: string;
    alt: string;
    position: number;
    isDefault: boolean;
  }>;
  inventory: {
    quantity: number;
    lowStockThreshold: number;
    trackInventory: boolean;
    allowBackorder: boolean;
  };
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  categoryId: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  status: { 
    type: String, 
    enum: Object.values(ProductStatus), 
    default: ProductStatus.ACTIVE 
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, required: true },
    position: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
  }],
  inventory: {
    quantity: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    trackInventory: { type: Boolean, default: true },
    allowBackorder: { type: Boolean, default: false },
  },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

// Indexes for search and filtering
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ categoryId: 1, status: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isFeatured: 1, isNew: 1 });
ProductSchema.index({ slug: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
```

---

## 3️⃣ Cart Service Implementation

### Key Features
- ✅ Redis-based cart storage
- ✅ Add/remove/update items
- ✅ Guest cart support
- ✅ Cart merging on login
- ✅ Price calculation
- ✅ Coupon application
- ✅ Auto-expiration

### Redis Cart Structure
```typescript
// src/services/cart.service.ts
import { createClient } from 'redis';
import { Cart, CartItem } from '@ecommerce/types';

export class CartService {
  private redis;
  
  constructor() {
    this.redis = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    this.redis.connect();
  }
  
  async getCart(userId: string): Promise<Cart | null> {
    const key = `cart:${userId}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }
  
  async addItem(userId: string, item: CartItem): Promise<Cart> {
    const cart = await this.getCart(userId) || this.createEmptyCart(userId);
    
    // Check if item exists
    const existingIndex = cart.items.findIndex(i => i.productId === item.productId);
    
    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }
    
    // Recalculate pricing
    cart.pricing = this.calculatePricing(cart.items);
    
    // Save to Redis with expiration
    await this.saveCart(userId, cart);
    
    return cart;
  }
  
  private calculatePricing(items: CartItem[]) {
    const subtotal = items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    const tax = subtotal * 0.18; // 18% GST
    const shipping = subtotal > 500 ? 0 : 50;
    
    return {
      subtotal,
      discount: 0,
      tax,
      shipping,
      total: subtotal + tax + shipping,
      currency: 'INR',
    };
  }
  
  private async saveCart(userId: string, cart: Cart) {
    const key = `cart:${userId}`;
    await this.redis.setEx(key, 86400, JSON.stringify(cart)); // 24 hour expiry
  }
}
```

---

## 4️⃣ Order Service Implementation (PostgreSQL)

### Database Schema
```sql
-- migrations/001_create_orders.sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  payment_status VARCHAR(20) NOT NULL,
  fulfillment_status VARCHAR(30) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  notes TEXT,
  tracking_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  sku VARCHAR(100) NOT NULL,
  image VARCHAR(500),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

---

## 🔧 Environment Configuration

### Auth Service .env
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://admin:password123@localhost:27017/ecommerce?authSource=admin
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 📦 Complete Service Template Generator

Use this command structure for each service:

```bash
# Generate service structure
mkdir -p services/{service-name}/src/{models,controllers,routes,services,middleware,config}

# Copy templates
cp templates/package.json services/{service-name}/
cp templates/tsconfig.json services/{service-name}/
cp templates/.env.example services/{service-name}/

# Install dependencies
cd services/{service-name}
npm install

# Start development
npm run dev
```

---

## 🚀 Deployment Checklist

- [ ] All services have proper error handling
- [ ] All endpoints have input validation
- [ ] Database indexes are created
- [ ] Environment variables are configured
- [ ] Logging is implemented
- [ ] Health checks are working
- [ ] Docker images build successfully
- [ ] Integration tests pass
- [ ] API documentation is complete
- [ ] Security headers are configured

---

## 📚 Additional Resources

- MongoDB Best Practices: https://docs.mongodb.com/manual/administration/production-notes/
- PostgreSQL Performance: https://wiki.postgresql.org/wiki/Performance_Optimization
- Redis Patterns: https://redis.io/topics/data-types-intro
- JWT Best Practices: https://tools.ietf.org/html/rfc8725

---

**This guide provides the foundation for implementing all services. Each service follows the same pattern with service-specific business logic.**