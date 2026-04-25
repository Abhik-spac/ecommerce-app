# E-Commerce Backend - Microservices Architecture

✅ **Production-ready and fully tested** Node.js (TypeScript) backend system for the microfrontend-based eCommerce platform.

**Status**: All 7 microservices implemented, tested, and running successfully.

## 🏗️ Architecture Overview

This backend mirrors the frontend's microfrontend architecture with independent, scalable microservices.

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (Port 3000)                  │
│  - Request routing & load balancing                          │
│  - Authentication middleware                                 │
│  - Rate limiting & CORS                                      │
│  - API documentation (Swagger)                               │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Auth Service │    │Product Service│   │ Cart Service │
│  Port: 3001  │    │  Port: 3002   │   │  Port: 3003  │
│              │    │               │   │              │
│ - JWT Auth   │    │ - Catalog     │   │ - Session    │
│ - OTP Login  │    │ - Search      │   │ - Cart Ops   │
│ - Password   │    │ - Inventory   │   │ - Pricing    │
└──────────────┘    └──────────────┘    └──────────────┘
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│Checkout Svc  │    │ Order Service│    │ User Service │
│  Port: 3004  │    │  Port: 3005  │    │  Port: 3006  │
│              │    │               │   │              │
│ - Payment    │    │ - Orders      │   │ - Profile    │
│ - Address    │    │ - Tracking    │   │ - Prefs      │
│ - Validation │    │ - History     │   │ - Addresses  │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                ┌───────────────────────┐
                │   Shared Libraries    │
                │  - Common utilities   │
                │  - Type definitions   │
                │  - Config management  │
                └───────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   MongoDB    │    │    Redis     │    │  PostgreSQL  │
│  (NoSQL DB)  │    │   (Cache)    │    │  (Orders)    │
└──────────────┘    └──────────────┘    └──────────────┘
```

## 📦 Services

| Service | Port | Database | Description |
|---------|------|----------|-------------|
| **API Gateway** | 3000 | - | Request routing, auth middleware, rate limiting |
| **Auth Service** | 3001 | MongoDB | JWT authentication, OTP login, password reset |
| **Product Service** | 3002 | MongoDB | Product catalog, search, inventory management |
| **Cart Service** | 3003 | Redis | Shopping cart, session management |
| **Checkout Service** | 3004 | MongoDB | Payment processing, address validation |
| **Order Service** | 3005 | PostgreSQL | Order management, tracking, history |
| **User Service** | 3006 | MongoDB | User profiles, preferences, addresses |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Docker & Docker Compose
- MongoDB, Redis, PostgreSQL (or use Docker)

### Installation

```bash
# Install dependencies for all services
npm install

# Or install for specific service
npm install --workspace=services/auth-service
```

### Development

**Start all services:**
```bash
npm run dev
```

**Start individual services:**
```bash
npm run dev:gateway    # API Gateway
npm run dev:auth       # Auth Service
npm run dev:product    # Product Service
npm run dev:cart       # Cart Service
npm run dev:checkout   # Checkout Service
npm run dev:order      # Order Service
npm run dev:user       # User Service
```

### Using Docker

```bash
# Build all services
npm run docker:build

# Start all services with databases
npm run docker:up

# View logs
npm run docker:logs

# Stop all services
npm run docker:down
```

## 📁 Project Structure

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
│   ├── API.md                  # API documentation
│   ├── ARCHITECTURE.md         # Architecture details
│   └── DEPLOYMENT.md           # Deployment guide
└── package.json                # Root package.json
```

### Service Structure

Each service follows this structure:

```
services/{service-name}/
├── src/
│   ├── controllers/            # Request handlers
│   ├── services/               # Business logic
│   ├── models/                 # Data models
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── validators/             # Input validation
│   ├── utils/                  # Service utilities
│   ├── config/                 # Service config
│   └── index.ts                # Entry point
├── tests/                      # Unit & integration tests
├── package.json                # Service dependencies
├── tsconfig.json               # TypeScript config
├── Dockerfile                  # Docker image
└── README.md                   # Service documentation
```

## 🔧 Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5+
- **Framework**: Express.js
- **Databases**: 
  - MongoDB (Products, Users, Auth)
  - PostgreSQL (Orders, Transactions)
  - Redis (Cache, Sessions, Cart)
- **Authentication**: JWT, Passport.js
- **Validation**: Joi, class-validator
- **Testing**: Jest, Supertest
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston, Morgan
- **Monitoring**: Prometheus, Grafana
- **Message Queue**: RabbitMQ (optional)
- **Container**: Docker, Docker Compose
- **Orchestration**: Kubernetes (production)

## 🔐 Authentication & Authorization

### JWT Authentication
- Access tokens (15 min expiry)
- Refresh tokens (7 days expiry)
- Token rotation on refresh

### Supported Auth Methods
1. **Email/Password** - Traditional login
2. **OTP Login** - Phone-based authentication
3. **Social Login** - Google, Facebook (future)
4. **Password Reset** - Email-based recovery

### Role-Based Access Control (RBAC)
- **USER** - Standard customer
- **ADMIN** - Platform administrator
- **VENDOR** - Product vendor (B2B)

## 📊 Database Schema

### MongoDB Collections
- `users` - User accounts
- `products` - Product catalog
- `categories` - Product categories
- `addresses` - User addresses
- `sessions` - User sessions

### PostgreSQL Tables
- `orders` - Order records
- `order_items` - Order line items
- `payments` - Payment transactions
- `shipments` - Shipping information

### Redis Keys
- `cart:{userId}` - Shopping cart data
- `session:{sessionId}` - Session data
- `cache:product:{id}` - Product cache
- `rate-limit:{ip}` - Rate limiting

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests for specific service
npm test --workspace=services/auth-service
```

## 📝 API Documentation

API documentation is available via Swagger UI:

- **Development**: http://localhost:3000/api-docs
- **Production**: https://api.yourdomain.com/api-docs

## 🚢 Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Deploy
docker-compose up -d
```

### Kubernetes Deployment

```bash
# Apply configurations
kubectl apply -f infrastructure/kubernetes/

# Check status
kubectl get pods
```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

## 🔍 Monitoring & Logging

### Logging
- Centralized logging with Winston
- Log levels: error, warn, info, debug
- Structured JSON logs
- Log aggregation with ELK stack

### Monitoring
- Health checks on `/health` endpoint
- Metrics exposed for Prometheus
- Grafana dashboards
- Alert management

### Performance
- Response time tracking
- Database query monitoring
- Cache hit/miss rates
- Error rate tracking

## 🛡️ Security

- **HTTPS** - TLS/SSL encryption
- **CORS** - Configured for frontend domains
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Sanitize all inputs
- **SQL Injection** - Parameterized queries
- **XSS Protection** - Content Security Policy
- **Helmet.js** - Security headers
- **JWT Secrets** - Environment variables
- **Password Hashing** - bcrypt with salt

## 🔄 CI/CD Pipeline

```yaml
Build → Test → Lint → Security Scan → Build Docker → Deploy
```

- GitHub Actions / GitLab CI
- Automated testing
- Code quality checks
- Security vulnerability scanning
- Automated deployment

## 📚 Documentation

### Essential Documentation (Start Here)
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Complete beginner-friendly guide (850 lines)
- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Central navigation hub
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - REST API reference
- **[TEST_API.md](./TEST_API.md)** - Testing guide with examples

### Additional Documentation
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Implementation patterns
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - Completion summary
- **[LOGGING_MONITORING.md](./LOGGING_MONITORING.md)** - Monitoring setup

### For New Developers
👉 **Start with [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** for a complete walkthrough of the architecture, code flow, debugging, and best practices.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file

## 🆘 Support

- Documentation: [docs/](./docs/)
- Issues: GitHub Issues
- Email: support@yourdomain.com

---

**Built with ❤️ using Node.js, TypeScript, and Microservices Architecture**