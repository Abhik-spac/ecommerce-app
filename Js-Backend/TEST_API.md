# API Testing Guide

This guide shows how to test the backend APIs with authentication.

## 1. Register a New User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User",
    "phone": "+1234567890"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "test@example.com",
      "name": "Test User"
    }
  }
}
```

## 2. Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "test@example.com",
      "name": "Test User"
    }
  }
}
```

**Save the token from the response!**

## 3. Access Protected Endpoints

### Get Products (No Auth Required)

```bash
curl http://localhost:3002/api/products
```

### Add to Cart (Auth Required)

```bash
TOKEN="your_token_here"

curl -X POST http://localhost:3003/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productId": "prod123",
    "quantity": 2,
    "price": 99.99
  }'
```

### Get Cart (Auth Required)

```bash
curl http://localhost:3003/api/v1/cart \
  -H "Authorization: Bearer $TOKEN"
```

### Get Orders (Auth Required)

```bash
curl http://localhost:3005/api/v1/orders \
  -H "Authorization: Bearer $TOKEN"
```

### Get User Profile (Auth Required)

```bash
curl http://localhost:3006/api/v1/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

## 4. Complete Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

echo "=== 1. Register User ==="
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User",
    "phone": "+1234567890"
  }')

echo $REGISTER_RESPONSE | jq '.'

# Extract token
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')
echo ""
echo "Token: $TOKEN"
echo ""

echo "=== 2. Get Products (No Auth) ==="
curl -s http://localhost:3002/api/products | jq '.'
echo ""

echo "=== 3. Add to Cart (With Auth) ==="
curl -s -X POST http://localhost:3003/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productId": "prod123",
    "quantity": 2,
    "price": 99.99
  }' | jq '.'
echo ""

echo "=== 4. Get Cart (With Auth) ==="
curl -s http://localhost:3003/api/v1/cart \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

echo "=== 5. Get User Profile (With Auth) ==="
curl -s http://localhost:3006/api/v1/users/profile \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

Make it executable:
```bash
chmod +x test-api.sh
./test-api.sh
```

## API Endpoints Summary

### Public Endpoints (No Auth Required)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/otp/send` - Send OTP
- `POST /api/auth/otp/verify` - Verify OTP
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /health` - Health check (all services)

### Protected Endpoints (Auth Required)
- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/:productId` - Update cart item
- `DELETE /api/v1/cart/items/:productId` - Remove from cart
- `DELETE /api/v1/cart` - Clear cart
- `POST /api/v1/checkout` - Process checkout
- `GET /api/v1/orders` - Get user's orders
- `GET /api/v1/orders/:id` - Get order by ID
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile

## Error Responses

### 401 Unauthorized (Missing/Invalid Token)
```json
{
  "success": false,
  "error": {
    "message": "No token provided" 
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "message": "Invalid token"
  }
}
```

## Notes

1. **Token Expiration**: Tokens expire after 7 days by default
2. **Token Format**: Always use `Bearer <token>` in Authorization header
3. **CORS**: Enabled for all origins in development
4. **Rate Limiting**: Not implemented yet (add in production)