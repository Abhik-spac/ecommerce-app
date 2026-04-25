# Getting Started with eCommerce Backend

This guide will help you set up and run the eCommerce backend microservices system.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm 9+
- **Docker** and Docker Compose (for containerized setup)
- **MongoDB** 7.0+ (if running locally)
- **PostgreSQL** 16+ (if running locally)
- **Redis** 7+ (if running locally)
- **Git**

## Quick Start (Docker - Recommended)

The fastest way to get started is using Docker Compose:

### 1. Clone the Repository

```bash
cd Js-Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start All Services with Docker

```bash
npm run docker:up
```

This will start:
- MongoDB (Port 27017)
- PostgreSQL (Port 5432)
- Redis (Port 6379)
- API Gateway (Port 3000)
- Auth Service (Port 3001)
- Product Service (Port 3002)
- Cart Service (Port 3003)
- Checkout Service (Port 3004)
- Order Service (Port 3005)
- User Service (Port 3006)

### 4. Verify Services

Check if all services are running:

```bash
# Check API Gateway health
curl http://localhost:3000/health

# View logs
npm run docker:logs
```

### 5. Access API Documentation

Open your browser and navigate to:
```
http://localhost:3000/api-docs
```

### 6. Stop Services

```bash
npm run docker:down
```

## Local Development Setup

For development without Docker:

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install dependencies for all services
npm install --workspaces
```

### 2. Set Up Databases

#### MongoDB
```bash
# Start MongoDB
mongod --dbpath /path/to/data

# Create database
mongosh
> use ecommerce
> db.createUser({
    user: "admin",
    pwd: "password123",
    roles: ["readWrite"]
  })
```

#### PostgreSQL
```bash
# Start PostgreSQL
pg_ctl start

# Create database
createdb ecommerce_orders

# Run migrations (once implemented)
npm run db:migrate --workspace=services/order-service
```

#### Redis
```bash
# Start Redis
redis-server
```

### 3. Configure Environment Variables

Each service needs its own `.env` file. Copy the example files:

```bash
# API Gateway
cp services/api-gateway/.env.example services/api-gateway/.env

# Auth Service
cp services/auth-service/.env.example services/auth-service/.env

# Repeat for other services...
```

Edit each `.env` file with your local configuration.

### 4. Build Shared Libraries

```bash
# Build types library
npm run build --workspace=shared/types

# Build common library
npm run build --workspace=shared/common
```

### 5. Start Services

#### Option A: Start All Services
```bash
npm run dev
```

#### Option B: Start Individual Services
```bash
# Terminal 1 - API Gateway
npm run dev:gateway

# Terminal 2 - Auth Service
npm run dev:auth

# Terminal 3 - Product Service
npm run dev:product

# Terminal 4 - Cart Service
npm run dev:cart

# Terminal 5 - Checkout Service
npm run dev:checkout

# Terminal 6 - Order Service
npm run dev:order

# Terminal 7 - User Service
npm run dev:user
```

## Project Structure

```
Js-Backend/
├── services/                    # Microservices
│   ├── api-gateway/            # API Gateway (Port 3000)
│   ├── auth-service/           # Authentication (Port 3001)
│   ├── product-service/        # Products (Port 3002)
│   ├── cart-service/           # Shopping Cart (Port 3003)
│   ├── checkout-service/       # Checkout (Port 3004)
│   ├── order-service/          # Orders (Port 3005)
│   └── user-service/           # Users (Port 3006)
├── shared/                      # Shared libraries
│   ├── common/                 # Common utilities
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Helper functions
│   └── config/                 # Configuration
├── infrastructure/              # Infrastructure as Code
│   ├── docker/                 # Docker configs
│   ├── kubernetes/             # K8s manifests
│   └── monitoring/             # Monitoring setup
├── docs/                        # Documentation
└── package.json                # Root package.json
```

## API Endpoints

### API Gateway (http://localhost:3000)

All requests go through the API Gateway:

```
GET  /                          # API information
GET  /health                    # Health check
GET  /api-docs                  # API documentation
```

### Auth Service (via /api/v1/auth)

```
POST /api/v1/auth/register      # Register new user
POST /api/v1/auth/login         # Login with email/password
POST /api/v1/auth/logout        # Logout
POST /api/v1/auth/refresh       # Refresh access token
POST /api/v1/auth/otp/send      # Send OTP to phone
POST /api/v1/auth/otp/verify    # Verify OTP
POST /api/v1/auth/forgot-password   # Request password reset
POST /api/v1/auth/reset-password    # Reset password
```

### Product Service (via /api/v1/products)

```
GET    /api/v1/products         # List products
GET    /api/v1/products/:id     # Get product details
POST   /api/v1/products         # Create product (admin)
PUT    /api/v1/products/:id     # Update product (admin)
DELETE /api/v1/products/:id     # Delete product (admin)
GET    /api/v1/products/search  # Search products
GET    /api/v1/categories       # List categories
```

### Cart Service (via /api/v1/cart)

```
GET    /api/v1/cart             # Get cart
POST   /api/v1/cart/items       # Add item to cart
PUT    /api/v1/cart/items/:id   # Update cart item
DELETE /api/v1/cart/items/:id   # Remove cart item
DELETE /api/v1/cart             # Clear cart
POST   /api/v1/cart/coupon      # Apply coupon
```

### Checkout Service (via /api/v1/checkout)

```
POST   /api/v1/checkout/validate    # Validate checkout
POST   /api/v1/checkout/calculate   # Calculate totals
POST   /api/v1/checkout/process     # Process checkout
GET    /api/v1/checkout/addresses   # Get addresses
POST   /api/v1/checkout/addresses   # Add address
```

### Order Service (via /api/v1/orders)

```
GET    /api/v1/orders           # List orders
GET    /api/v1/orders/:id       # Get order details
POST   /api/v1/orders           # Create order
PUT    /api/v1/orders/:id/status    # Update order status
GET    /api/v1/orders/:id/track     # Track order
POST   /api/v1/orders/:id/cancel    # Cancel order
```

### User Service (via /api/v1/users)

```
GET    /api/v1/users/profile    # Get user profile
PUT    /api/v1/users/profile    # Update profile
GET    /api/v1/users/addresses  # Get addresses
POST   /api/v1/users/addresses  # Add address
GET    /api/v1/users/wishlist   # Get wishlist
POST   /api/v1/users/wishlist   # Add to wishlist
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests for Specific Service

```bash
npm test --workspace=services/auth-service
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

## Common Tasks

### Add a New Service

1. Create service directory:
```bash
mkdir -p services/new-service/src
```

2. Create package.json:
```bash
cd services/new-service
npm init -y
```

3. Add dependencies and implement service

4. Update root package.json scripts

5. Add to docker-compose.yml

### Update Shared Libraries

```bash
# Make changes to shared/types or shared/common
cd shared/types
npm run build

# Services will automatically use updated types
```

### Database Migrations

```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### View Logs

```bash
# Docker logs
npm run docker:logs

# Service logs (local)
tail -f logs/combined.log
tail -f logs/error.log
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Check if PostgreSQL is running
pg_isready

# Check if Redis is running
redis-cli ping
```

### Service Not Starting

1. Check logs for errors
2. Verify environment variables
3. Ensure dependencies are installed
4. Check if required ports are available

### Clear All Data

```bash
# Stop and remove Docker volumes
npm run docker:down
docker volume prune

# Clear local databases
# MongoDB: drop database
# PostgreSQL: drop database
# Redis: FLUSHALL
```

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/new-feature
```

### 2. Make Changes

Edit code in the appropriate service

### 3. Test Changes

```bash
npm test --workspace=services/your-service
```

### 4. Lint and Format

```bash
npm run lint:fix
npm run format
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

### 6. Push and Create PR

```bash
git push origin feature/new-feature
```

## Production Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for production deployment instructions.

## Additional Resources

- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Security Best Practices](./docs/SECURITY.md)

## Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Documentation: [docs/](./docs/)
- Email: support@yourdomain.com

## License

MIT License - see [LICENSE](./LICENSE) file

---

**Happy Coding! 🚀**