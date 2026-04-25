# 🚀 Complete Developer Guide for Freshers

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Understanding the Code Flow](#understanding-the-code-flow)
4. [Setting Up Your Development Environment](#setting-up-your-development-environment)
5. [How to Debug](#how-to-debug)
6. [Adding New Features](#adding-new-features)
7. [Database Operations](#database-operations)
8. [Best Practices](#best-practices)
9. [Common Issues & Solutions](#common-issues--solutions)

---

## Introduction

Welcome! This guide will help you understand our Node.js microservices backend from scratch. Even if you're new to backend development, you'll learn everything step by step.

### What is a Microservice?

Think of microservices like a restaurant:
- **Monolithic App** = One chef does everything (cooking, serving, billing)
- **Microservices** = Specialized staff (chef cooks, waiter serves, cashier handles billing)

Each service does ONE thing really well and can work independently.

### Our Services

```
┌─────────────────────────────────────────────────────────┐
│                    API Gateway (3000)                    │
│              (Main entrance - routes requests)           │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼────┐        ┌────▼────┐        ┌────▼────┐
   │  Auth   │        │ Product │        │  Cart   │
   │ (3001)  │        │ (3002)  │        │ (3003)  │
   └─────────┘        └─────────┘        └─────────┘
        │                   │                   │
   ┌────▼────┐        ┌────▼────┐        ┌────▼────┐
   │Checkout │        │  Order  │        │  User   │
   │ (3004)  │        │ (3005)  │        │ (3006)  │
   └─────────┘        └─────────┘        └─────────┘
```

---

## Architecture Overview

### 1. Project Structure

```
Js-Backend/
├── services/                    # All microservices
│   ├── api-gateway/            # Routes requests to services
│   ├── auth-service/           # Handles login, registration
│   ├── product-service/        # Manages products
│   ├── cart-service/           # Shopping cart
│   ├── checkout-service/       # Payment processing
│   ├── order-service/          # Order management
│   └── user-service/           # User profiles
├── shared/                     # Common code used by all services
│   └── utils/                  # Helper functions
├── package.json                # Project dependencies
└── .gitignore                  # Files to ignore in git
```

### 2. Service Structure (Example: Product Service)

```
product-service/
├── src/
│   ├── index.ts               # 🚪 Entry point - starts the server
│   ├── models/                # 📦 Database schemas
│   │   └── Product.ts         # Defines what a product looks like
│   ├── controllers/           # 🎮 Business logic
│   │   └── product.controller.ts
│   ├── routes/                # 🛣️ API endpoints
│   │   └── product.routes.ts
│   ├── services/              # 🔧 Helper functions
│   │   └── product.service.ts
│   └── middleware/            # 🛡️ Authentication, validation
│       └── auth.middleware.ts
├── .env                       # 🔐 Secret configuration
├── package.json               # Service dependencies
└── tsconfig.json              # TypeScript configuration
```

---

## Understanding the Code Flow

### Request Flow Example: "Get All Products"

Let's trace what happens when a user requests products:

```
1. User Browser
   ↓
   GET http://localhost:3000/api/products
   ↓
2. API Gateway (Port 3000)
   ↓ (routes to product service)
   ↓
3. Product Service (Port 3002)
   ↓
4. Routes (product.routes.ts)
   ↓ matches GET /api/products
   ↓
5. Controller (product.controller.ts)
   ↓ calls getProducts()
   ↓
6. Service (product.service.ts)
   ↓ queries database
   ↓
7. Database (MongoDB)
   ↓ returns data
   ↓
8. Response flows back to user
```

### Code Example Walkthrough

#### Step 1: Route Definition (`routes/product.routes.ts`)

```typescript
import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/product.controller';

const router = Router();

// Define endpoints
router.get('/', getProducts);        // GET /api/products
router.post('/', createProduct);     // POST /api/products

export default router;
```

**What's happening?**
- `Router()` creates a new router to handle URLs
- `router.get('/', getProducts)` says: "When someone visits this URL with GET, run getProducts function"
- We export this router to use in index.ts

#### Step 2: Controller (`controllers/product.controller.ts`)

```typescript
import { Request, Response } from 'express';
import Product from '../models/Product';

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    // 1. Query database for all products
    const products = await Product.find();
    
    // 2. Send success response
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    // 3. Handle errors
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
};
```

**What's happening?**
- `async` means this function waits for database operations
- `try-catch` handles errors gracefully
- `Product.find()` gets all products from database
- `res.json()` sends response back to user

#### Step 3: Model (`models/Product.ts`)

```typescript
import mongoose from 'mongoose';

// Define what a product looks like
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Create and export the model
export default mongoose.model('Product', productSchema);
```

**What's happening?**
- Schema defines the structure of our data
- `required: true` means this field must have a value
- `default` provides a value if none is given
- `mongoose.model()` creates a model we can use to interact with database

---

## Setting Up Your Development Environment

### Prerequisites

1. **Install Node.js** (v18 or higher)
   ```bash
   # Check if installed
   node --version
   npm --version
   ```

2. **Install MongoDB**
   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community
   
   # Verify
   mongosh
   ```

3. **Install PostgreSQL**
   ```bash
   # macOS
   brew install postgresql@14
   brew services start postgresql@14
   ```

4. **Install Redis**
   ```bash
   # macOS
   brew install redis
   brew services start redis
   ```

### First Time Setup

```bash
# 1. Navigate to backend directory
cd Js-Backend

# 2. Install all dependencies
npm install

# 3. Start all services
npm run dev

# 4. Verify services are running
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
# ... check all 7 services
```

### Environment Variables

Each service has a `.env` file with configuration:

```env
# Example: product-service/.env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/product-db
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

**Important:** Never commit `.env` files to git (they're in .gitignore)

---

## How to Debug

### 1. Using Console Logs

```typescript
export const getProducts = async (req: Request, res: Response) => {
  console.log('📝 getProducts called');
  console.log('Query params:', req.query);
  
  try {
    const products = await Product.find();
    console.log('✅ Found products:', products.length);
    
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: 'Failed' });
  }
};
```

### 2. Using VS Code Debugger

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Product Service",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/services/product-service",
      "console": "integratedTerminal"
    }
  ]
}
```

**Set breakpoints:**
- Click left of line number in VS Code
- Run debugger (F5)
- Code pauses at breakpoint
- Inspect variables, step through code

### 3. Testing with cURL

```bash
# Test GET request
curl http://localhost:3002/api/products

# Test POST request
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":99.99}'

# Test with authentication
curl http://localhost:3003/api/v1/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Using Postman

1. Download Postman
2. Create new request
3. Set URL: `http://localhost:3002/api/products`
4. Set method: GET/POST/PUT/DELETE
5. Add headers if needed
6. Send request and view response

### 5. Checking Logs

```bash
# View service logs
cd Js-Backend
npm run dev

# Logs appear in terminal
# Look for:
# ✅ Success messages
# ❌ Error messages
# 📝 Debug logs
```

---

## Adding New Features

### Example: Add "Category" Feature to Products

#### Step 1: Update Model

```typescript
// services/product-service/src/models/Product.ts

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  stock: { type: Number, default: 0 },
  category: { type: String, required: true }, // ⭐ NEW
  createdAt: { type: Date, default: Date.now }
});
```

#### Step 2: Add Controller Function

```typescript
// services/product-service/src/controllers/product.controller.ts

// Get products by category
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    
    // Query products with specific category
    const products = await Product.find({ category });
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products by category'
    });
  }
};
```

#### Step 3: Add Route

```typescript
// services/product-service/src/routes/product.routes.ts

import { getProducts, getProductsByCategory } from '../controllers/product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/category/:category', getProductsByCategory); // ⭐ NEW

export default router;
```

#### Step 4: Test Your New Feature

```bash
# Create product with category
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "category": "Electronics"
  }'

# Get products by category
curl http://localhost:3002/api/products/category/Electronics
```

### Complete Checklist for New Feature

- [ ] Update Model (if database changes needed)
- [ ] Create Controller function
- [ ] Add Route
- [ ] Add Middleware (if authentication needed)
- [ ] Test with cURL/Postman
- [ ] Add error handling
- [ ] Update API documentation
- [ ] Write tests (optional but recommended)

---

## Database Operations

### MongoDB Operations (Product, Auth, User Services)

#### Create (Insert)

```typescript
// Create single product
const product = await Product.create({
  name: 'Laptop',
  price: 999.99,
  category: 'Electronics'
});

// Create multiple products
const products = await Product.insertMany([
  { name: 'Product 1', price: 10 },
  { name: 'Product 2', price: 20 }
]);
```

#### Read (Query)

```typescript
// Find all
const allProducts = await Product.find();

// Find with condition
const electronics = await Product.find({ category: 'Electronics' });

// Find one
const product = await Product.findById('product_id');
const product = await Product.findOne({ name: 'Laptop' });

// Find with pagination
const products = await Product.find()
  .skip(10)      // Skip first 10
  .limit(5)      // Get next 5
  .sort({ price: -1 }); // Sort by price descending
```

#### Update

```typescript
// Update one
await Product.findByIdAndUpdate(
  'product_id',
  { price: 899.99 },
  { new: true } // Return updated document
);

// Update many
await Product.updateMany(
  { category: 'Electronics' },
  { $inc: { stock: 10 } } // Increase stock by 10
);
```

#### Delete

```typescript
// Delete one
await Product.findByIdAndDelete('product_id');

// Delete many
await Product.deleteMany({ stock: 0 });
```

### PostgreSQL Operations (Order Service)

```typescript
// services/order-service/src/controllers/order.controller.ts

import { pool } from '../index';

// Create order
export const createOrder = async (req: Request, res: Response) => {
  const { userId, items, total } = req.body;
  
  try {
    // Start transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert order
      const orderResult = await client.query(
        'INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING id',
        [userId, total, 'PENDING']
      );
      
      const orderId = orderResult.rows[0].id;
      
      // Insert order items
      for (const item of items) {
        await client.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
          [orderId, item.productId, item.quantity, item.price]
        );
      }
      
      await client.query('COMMIT');
      
      res.json({ success: true, orderId });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
};

// Get orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
};
```

### Redis Operations (Cart Service)

```typescript
// services/cart-service/src/services/cart.service.ts

import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });

// Set cart
export const setCart = async (userId: string, cart: any) => {
  await redis.set(
    `cart:${userId}`,
    JSON.stringify(cart),
    { EX: 86400 } // Expire in 24 hours
  );
};

// Get cart
export const getCart = async (userId: string) => {
  const data = await redis.get(`cart:${userId}`);
  return data ? JSON.parse(data) : null;
};

// Delete cart
export const deleteCart = async (userId: string) => {
  await redis.del(`cart:${userId}`);
};
```

---

## Best Practices

### 1. Error Handling

**❌ Bad:**
```typescript
export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.find(); // What if this fails?
  res.json(products);
};
```

**✅ Good:**
```typescript
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
};
```

### 2. Input Validation

**❌ Bad:**
```typescript
export const createProduct = async (req: Request, res: Response) => {
  const product = await Product.create(req.body); // Trusting user input!
  res.json(product);
};
```

**✅ Good:**
```typescript
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, category } = req.body;
    
    // Validate input
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Name, price, and category are required'
      });
    }
    
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Price must be greater than 0'
      });
    }
    
    const product = await Product.create({ name, price, category });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
};
```

### 3. Use Environment Variables

**❌ Bad:**
```typescript
const JWT_SECRET = 'my-secret-key'; // Hardcoded!
```

**✅ Good:**
```typescript
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-for-development';
```

### 4. Consistent Response Format

```typescript
// Success response
{
  "success": true,
  "data": { ... }
}

// Error response
{
  "success": false,
  "error": "Error message"
}

// Paginated response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### 5. Use Async/Await

**❌ Bad (Callback Hell):**
```typescript
Product.find((err, products) => {
  if (err) {
    res.json({ error: err });
  } else {
    res.json(products);
  }
});
```

**✅ Good:**
```typescript
try {
  const products = await Product.find();
  res.json({ success: true, data: products });
} catch (error) {
  res.status(500).json({ success: false, error: error.message });
}
```

---

## Common Issues & Solutions

### Issue 1: Service Won't Start

**Error:** `Error: listen EADDRINUSE: address already in use :::3002`

**Solution:**
```bash
# Kill process using the port
lsof -ti:3002 | xargs kill -9

# Or change port in .env file
PORT=3012
```

### Issue 2: Database Connection Failed

**Error:** `MongoServerError: Authentication failed`

**Solution:**
```typescript
// Check .env file
MONGODB_URI=mongodb://localhost:27017/product-db  // No auth

// Not this:
MONGODB_URI=mongodb://admin:password@localhost:27017/product-db
```

### Issue 3: Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Install dependencies
npm install

# Or install specific package
npm install express
```

### Issue 4: TypeScript Errors

**Error:** `Property 'user' does not exist on type 'Request'`

**Solution:**
```typescript
// Use type casting
const userId = (req as any).user.id;

// Or create custom type
interface AuthRequest extends Request {
  user?: { id: string; email: string };
}
```

### Issue 5: CORS Errors

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
```typescript
// Add CORS middleware
import cors from 'cors';
app.use(cors());

// Or specific origins
app.use(cors({
  origin: 'http://localhost:4200'
}));
```

---

## Quick Reference

### Common Commands

```bash
# Start all services
npm run dev

# Start specific service
cd services/product-service && npm run dev

# Install dependencies
npm install

# Build for production
npm run build

# Run tests
npm test

# Check TypeScript errors
npx tsc --noEmit
```

### HTTP Status Codes

- `200` - OK (Success)
- `201` - Created (Resource created successfully)
- `400` - Bad Request (Invalid input)
- `401` - Unauthorized (Not logged in)
- `403` - Forbidden (Logged in but no permission)
- `404` - Not Found (Resource doesn't exist)
- `500` - Internal Server Error (Something went wrong)

### Useful VS Code Extensions

- **REST Client** - Test APIs directly in VS Code
- **MongoDB for VS Code** - View MongoDB data
- **PostgreSQL** - Manage PostgreSQL databases
- **Thunder Client** - Alternative to Postman
- **Error Lens** - Show errors inline
- **GitLens** - Git integration

---

## Next Steps

1. **Read the code** - Start with a simple service like product-service
2. **Make small changes** - Add a console.log, change a response
3. **Add a new endpoint** - Follow the examples in this guide
4. **Break things** - Best way to learn! (in development environment)
5. **Ask questions** - No question is too small

### Recommended Learning Path

1. Week 1: Understand project structure and code flow
2. Week 2: Add simple CRUD operations
3. Week 3: Work with authentication and middleware
4. Week 4: Handle complex database operations
5. Week 5: Add new microservice

---

## Resources

- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

**Remember:** Every expert was once a beginner. Take your time, experiment, and don't be afraid to make mistakes!

Happy Coding! 🚀

---

*Made with ❤️ by Bob*