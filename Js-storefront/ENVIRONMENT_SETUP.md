# Environment Variable Configuration Guide

## Overview

All hardcoded configuration values have been removed from the codebase. The application now strictly uses environment variables for all configuration, ensuring proper separation of concerns and deployment flexibility.

## Frontend Configuration

### Files Structure

```
Js-storefront/
├── .env.example          # Template with all required variables
├── .env.local            # Local development values (gitignored)
├── public/env.js         # Runtime environment loader
├── scripts/generate-env.js  # Build-time env generator
└── src/environments/
    ├── environment.ts       # Development environment
    └── environment.prod.ts  # Production environment
```

### Required Environment Variables

All frontend services require these environment variables:

```bash
AUTH_SERVICE_URL=http://localhost:3001/api/v1
PRODUCT_SERVICE_URL=http://localhost:3002/api/v1
CART_SERVICE_URL=http://localhost:3003/api/v1
CHECKOUT_SERVICE_URL=http://localhost:3004/api/v1
ORDER_SERVICE_URL=http://localhost:3005/api/v1
USER_SERVICE_URL=http://localhost:3006/api/v1
```

### Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update values in `.env.local`** for your environment

3. **Generate runtime env.js:**
   ```bash
   npm run generate-env
   # or
   node scripts/generate-env.js
   ```

4. **Start the application:**
   ```bash
   npm start
   ```

### How It Works

1. **Build Time**: The `generate-env.js` script reads `.env.local` and generates `public/env.js`
2. **Runtime**: The `env.js` file is loaded in `index.html` before Angular bootstraps
3. **Application**: Services import from `environment.ts` which reads from `window.__env`

### Usage in Code

```typescript
import { environment } from '../environments/environment';

// Use environment variables
const apiUrl = environment.apiUrls.auth;
```

### Production Deployment

For production, you have two options:

#### Option 1: Build-time Configuration
```bash
# Set environment variables
export AUTH_SERVICE_URL=https://api.example.com/auth
export PRODUCT_SERVICE_URL=https://api.example.com/products
# ... set all variables

# Generate env.js
node scripts/generate-env.js

# Build application
npm run build
```

#### Option 2: Runtime Configuration
Replace `public/env.js` after build with environment-specific values:

```javascript
(function(window) {
  window.__env = window.__env || {};
  window.__env.AUTH_SERVICE_URL = 'https://api.example.com/auth';
  window.__env.PRODUCT_SERVICE_URL = 'https://api.example.com/products';
  // ... set all variables
}(this));
```

## Backend Configuration

### Required Environment Variables by Service

#### Auth Service (Port 3001)
```bash
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ecommerce-auth
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

#### Product Service (Port 3002)
```bash
PORT=3002
MONGODB_URI=mongodb://localhost:27017/ecommerce-products
```

#### Cart Service (Port 3003)
```bash
PORT=3003
REDIS_URL=redis://localhost:6379
```

#### Checkout Service (Port 3004)
```bash
PORT=3004
CART_SERVICE_URL=http://localhost:3003
ORDER_SERVICE_URL=http://localhost:3005
```

#### Order Service (Port 3005)
```bash
PORT=3005
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_orders
DB_USER=admin
DB_PASSWORD=password123
```

#### User Service (Port 3006)
```bash
PORT=3006
MONGODB_URI=mongodb://localhost:27017/ecommerce-users
```

#### API Gateway (Port 3000)
```bash
PORT=3000
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:4300,http://localhost:4400
AUTH_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002
CART_SERVICE_URL=http://localhost:3003
CHECKOUT_SERVICE_URL=http://localhost:3004
ORDER_SERVICE_URL=http://localhost:3005
USER_SERVICE_URL=http://localhost:3006
```

### Backend Setup Instructions

1. **Copy example file to each service:**
   ```bash
   # For each service directory
   cd Js-Backend/services/auth-service
   cp ../../.env.example .env
   # Edit .env with service-specific values
   ```

2. **Or use individual .env files:**
   ```bash
   # Create .env in each service directory with only required variables
   cd Js-Backend/services/auth-service
   cat > .env << EOF
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/ecommerce-auth
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   EOF
   ```

## Validation

### Frontend Validation

The application will throw an error at startup if any required environment variable is missing:

```
Error: Environment variable AUTH_SERVICE_URL is not defined
```

### Backend Validation

Services will fail to start if required environment variables are missing:

```typescript
const PORT = process.env.PORT!;  // Will throw if undefined
```

## Security Best Practices

1. **Never commit `.env` or `.env.local` files** - They are in `.gitignore`
2. **Use different secrets for each environment** (dev, staging, production)
3. **Rotate JWT secrets regularly** in production
4. **Use HTTPS URLs** in production environment variables
5. **Restrict CORS origins** to only allowed domains
6. **Use strong database passwords** and change defaults

## Docker/Kubernetes Deployment

### Docker Compose
```yaml
services:
  frontend:
    environment:
      - AUTH_SERVICE_URL=http://auth-service:3001/api/v1
      - PRODUCT_SERVICE_URL=http://product-service:3002/api/v1
      # ... other variables
```

### Kubernetes ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  AUTH_SERVICE_URL: "http://auth-service:3001/api/v1"
  PRODUCT_SERVICE_URL: "http://product-service:3002/api/v1"
  # ... other variables
```

## Troubleshooting

### Issue: "Environment variable X is not defined"
**Solution**: Ensure `.env.local` exists and contains all required variables, then run `node scripts/generate-env.js`

### Issue: Services can't connect to each other
**Solution**: Verify service URLs in environment variables match actual service locations

### Issue: CORS errors in browser
**Solution**: Check `ALLOWED_ORIGINS` in API Gateway includes your frontend URL

### Issue: Database connection failed
**Solution**: Verify database URLs and credentials in service `.env` files

## Migration from Hardcoded Values

All hardcoded values have been removed:

### Before:
```typescript
private apiUrl = 'http://localhost:3001/api/v1';
```

### After:
```typescript
import { environment } from '../environments/environment';
private apiUrl = environment.apiUrls.auth;
```

## Summary

✅ **No hardcoded URLs** - All configuration via environment variables  
✅ **Type-safe** - TypeScript non-null assertions enforce required variables  
✅ **Flexible** - Easy to configure for different environments  
✅ **Secure** - Sensitive data not in source code  
✅ **Production-ready** - Supports runtime configuration  

For questions or issues, refer to the main README.md or create an issue.