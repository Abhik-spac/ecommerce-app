# 📚 Complete API Documentation

## Overview

This document provides comprehensive API documentation for all microservices in the eCommerce backend platform.

---

## 🔐 Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1️⃣ Auth Service (Port 3001)

### Base URL
- Development: `http://localhost:3001/api/v1/auth`
- Via Gateway: `http://localhost:3000/api/auth`

### Endpoints

#### POST /register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 2️⃣ Product Service (Port 3002)

### Base URL
- Development: `http://localhost:3002/api/v1/products`
- Via Gateway: `http://localhost:3000/api/products`

### Endpoints

#### GET /
Get list of products with pagination and search.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for full-text search
- `categoryId` (optional): Filter by category

**Example:**
```
GET /api/v1/products?page=1&limit=10&search=laptop&categoryId=electronics
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "sku": "LAPTOP-001",
      "name": "Dell XPS 15",
      "slug": "dell-xps-15",
      "description": "High-performance laptop",
      "price": 89999,
      "status": "ACTIVE",
      "images": [
        {
          "url": "https://example.com/image.jpg",
          "alt": "Dell XPS 15"
        }
      ],
      "inventory": {
        "quantity": 50,
        "trackInventory": true
      },
      "categoryId": "electronics",
      "tags": ["laptop", "dell", "premium"],
      "rating": 4.5,
      "reviewCount": 120
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### GET /:id
Get product by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "sku": "LAPTOP-001",
    "name": "Dell XPS 15",
    "price": 89999,
    "inventory": {
      "quantity": 50,
      "trackInventory": true
    }
  }
}
```

#### POST /
Create a new product (Admin only).

**Request Body:**
```json
{
  "sku": "LAPTOP-001",
  "name": "Dell XPS 15",
  "slug": "dell-xps-15",
  "description": "High-performance laptop",
  "price": 89999,
  "categoryId": "electronics",
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "alt": "Dell XPS 15"
    }
  ],
  "inventory": {
    "quantity": 50,
    "trackInventory": true
  },
  "tags": ["laptop", "dell"]
}
```

---

## 3️⃣ Cart Service (Port 3003)

### Base URL
- Development: `http://localhost:3003/api/v1/cart`
- Via Gateway: `http://localhost:3000/api/cart`

### Headers
- `x-user-id`: User ID (required)

### Endpoints

#### GET /
Get user's cart.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "name": "Dell XPS 15",
        "price": 89999,
        "quantity": 2,
        "image": "https://example.com/image.jpg"
      }
    ],
    "pricing": {
      "subtotal": 179998,
      "tax": 32399.64,
      "shipping": 0,
      "total": 212397.64,
      "currency": "INR"
    }
  }
}
```

#### POST /items
Add item to cart.

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "name": "Dell XPS 15",
  "price": 89999,
  "quantity": 1,
  "image": "https://example.com/image.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pricing": {...}
  }
}
```

---

## 4️⃣ Checkout Service (Port 3004)

### Base URL
- Development: `http://localhost:3004/api/v1/checkout`
- Via Gateway: `http://localhost:3000/api/checkout`

### Endpoints

#### POST /initiate
Initiate checkout session.

**Request Body:**
```json
{
  "userId": "user123",
  "cartId": "cart123",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "billingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "checkout_1234567890",
    "userId": "user123",
    "status": "PENDING",
    "expiresAt": "2024-01-01T12:30:00Z"
  }
}
```

#### POST /payment
Process payment.

**Request Body:**
```json
{
  "checkoutId": "checkout_1234567890",
  "paymentMethod": "CARD",
  "paymentDetails": {
    "amount": 212397.64,
    "currency": "INR"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "transactionId": "txn_1234567890",
      "status": "SUCCESS",
      "amount": 212397.64,
      "currency": "INR"
    },
    "order": {
      "id": 1,
      "orderNumber": "ORD-1",
      "status": "PENDING",
      "total": 212397.64
    }
  }
}
```

#### POST /validate-address
Validate shipping address.

**Request Body:**
```json
{
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  }
}
```

---

## 5️⃣ Order Service (Port 3005)

### Base URL
- Development: `http://localhost:3005/api/v1/orders`
- Via Gateway: `http://localhost:3000/api/orders`

### Headers
- `x-user-id`: User ID (required)

### Endpoints

#### POST /
Create a new order.

**Request Body:**
```json
{
  "userId": "user123",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "price": 89999
    }
  ],
  "shippingAddress": {...},
  "billingAddress": {...},
  "paymentResult": {
    "transactionId": "txn_123",
    "status": "SUCCESS"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "ORD-1",
    "status": "PENDING",
    "total": 212397.64,
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

#### GET /
Get user's orders with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": "user123",
      "status": "PENDING",
      "total": 212397.64,
      "created_at": "2024-01-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

#### GET /:id
Get order details by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": "user123",
    "status": "PENDING",
    "subtotal": 179998,
    "tax": 32399.64,
    "shipping": 0,
    "total": 212397.64,
    "items": [
      {
        "id": 1,
        "order_id": 1,
        "product_id": "507f1f77bcf86cd799439011",
        "quantity": 2,
        "price": 89999,
        "total": 179998
      }
    ]
  }
}
```

---

## 6️⃣ User Service (Port 3006)

### Base URL
- Development: `http://localhost:3006/api/v1/users`
- Via Gateway: `http://localhost:3000/api/users`

### Headers
- `x-user-id`: User ID (required)

### Endpoints

#### GET /profile
Get user profile.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "user123",
    "addresses": [
      {
        "type": "HOME",
        "street": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "country": "India",
        "isDefault": true
      }
    ],
    "preferences": {
      "language": "en",
      "currency": "INR",
      "notifications": {
        "email": true,
        "sms": true,
        "push": true
      }
    },
    "wishlist": []
  }
}
```

#### PUT /profile
Update user profile.

**Request Body:**
```json
{
  "preferences": {
    "language": "hi",
    "currency": "INR"
  }
}
```

#### GET /addresses
Get user addresses.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "type": "HOME",
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "isDefault": true
    }
  ]
}
```

#### POST /addresses
Add new address.

**Request Body:**
```json
{
  "type": "WORK",
  "street": "456 Office Rd",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400002",
  "country": "India",
  "isDefault": false
}
```

#### PUT /preferences
Update user preferences.

**Request Body:**
```json
{
  "language": "en",
  "currency": "INR",
  "notifications": {
    "email": true,
    "sms": false,
    "push": true
  }
}
```

---

## 🔄 Error Responses

All services return consistent error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error: Email is required"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🧪 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Get Products
```bash
curl http://localhost:3002/api/v1/products?page=1&limit=10
```

### Add to Cart
```bash
curl -X POST http://localhost:3003/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -d '{
    "productId": "507f1f77bcf86cd799439011",
    "name": "Dell XPS 15",
    "price": 89999,
    "quantity": 1
  }'
```

---

## 📊 Rate Limits

- **Auth Service**: 100 requests per 15 minutes per IP
- **Other Services**: 1000 requests per 15 minutes per user

---

## 🔗 Postman Collection

Import the Postman collection for easy testing:
- File: `Js-Backend/postman/ecommerce-api.postman_collection.json`

---

**For Swagger UI documentation, visit:**
- Auth: `http://localhost:3001/api-docs`
- Product: `http://localhost:3002/api-docs`
- Cart: `http://localhost:3003/api-docs`
- Checkout: `http://localhost:3004/api-docs`
- Order: `http://localhost:3005/api-docs`
- User: `http://localhost:3006/api-docs`