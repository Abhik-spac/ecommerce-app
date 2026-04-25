# Backend Architecture Documentation

## Overview

This document describes the architecture of the Node.js microservices backend for the eCommerce platform. The backend mirrors the frontend's microfrontend architecture with independent, scalable services.

## Architecture Principles

### 1. Microservices Architecture
- **Service Independence**: Each service is independently deployable
- **Single Responsibility**: Each service handles one business domain
- **Database per Service**: Services own their data
- **API-First Design**: Well-defined REST APIs
- **Event-Driven Communication**: Async communication via message queues (optional)

### 2. Technology Stack

#### Core Technologies
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5+
- **Framework**: Express.js
- **API Documentation**: Swagger/OpenAPI 3.0

#### Databases
- **MongoDB**: Document store for products, users, auth
- **PostgreSQL**: Relational DB for orders, transactions
- **Redis**: Cache, sessions, cart data

#### Infrastructure
- **Container**: Docker
- **Orchestration**: Kubernetes (production)
- **CI/CD**: GitHub Actions / GitLab CI
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston + ELK Stack

## Service Architecture

### API Gateway (Port 3000)

**Purpose**: Single entry point for all client requests

**Responsibilities**:
- Request routing to appropriate microservices
- Authentication & authorization
- Rate limiting
- Request/response transformation
- API documentation aggregation
- CORS handling
- Load balancing

**Technology**:
- Express.js
- express-rate-limit
- helmet (security)
- cors
- http-proxy-middleware

**Endpoints**:
```
/api/v1/auth/*      → Auth Service (3001)
/api/v1/products/*  → Product Service (3002)
/api/v1/cart/*      → Cart Service (3003)
/api/v1/checkout/*  → Checkout Service (3004)
/api/v1/orders/*    → Order Service (3005)
/api/v1/users/*     → User Service (3006)
```

### Auth Service (Port 3001)

**Purpose**: Authentication and authorization

**Responsibilities**:
- User registration & login
- JWT token generation & validation
- OTP-based authentication
- Password reset flow
- Social login (Google, Facebook)
- Session management
- Email/phone verification

**Database**: MongoDB
- Collections: users, sessions, otp_codes, refresh_tokens

**Key Features**:
- bcrypt password hashing
- JWT with access & refresh tokens
- OTP generation & validation
- Rate limiting on auth endpoints
- Account lockout after failed attempts

**API Endpoints**:
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/otp/send
POST   /api/v1/auth/otp/verify
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/verify-email
```

### Product Service (Port 3002)

**Purpose**: Product catalog management

**Responsibilities**:
- Product CRUD operations
- Category management
- Product search & filtering
- Inventory management
- Product reviews & ratings
- Image management
- SEO metadata

**Database**: MongoDB
- Collections: products, categories, reviews, inventory

**Key Features**:
- Full-text search
- Faceted filtering
- Inventory tracking
- Low stock alerts
- Product variants
- Bulk operations

**API Endpoints**:
```
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id
GET    /api/v1/products/search
GET    /api/v1/products/featured
GET    /api/v1/categories
POST   /api/v1/products/:id/reviews
```

### Cart Service (Port 3003)

**Purpose**: Shopping cart management

**Responsibilities**:
- Add/remove items from cart
- Update item quantities
- Cart persistence
- Guest cart handling
- Cart expiration
- Price calculation
- Coupon application

**Database**: Redis
- Keys: cart:{userId}, cart:guest:{sessionId}

**Key Features**:
- Session-based carts for guests
- User-based carts for authenticated users
- Real-time price updates
- Cart merging on login
- Automatic cart cleanup
- Coupon validation

**API Endpoints**:
```
GET    /api/v1/cart
POST   /api/v1/cart/items
PUT    /api/v1/cart/items/:id
DELETE /api/v1/cart/items/:id
DELETE /api/v1/cart
POST   /api/v1/cart/coupon
GET    /api/v1/cart/summary
```

### Checkout Service (Port 3004)

**Purpose**: Checkout process management

**Responsibilities**:
- Address validation
- Payment processing
- Order creation
- Shipping calculation
- Tax calculation
- Payment gateway integration
- Order confirmation

**Database**: MongoDB
- Collections: addresses, payment_methods, checkouts

**Key Features**:
- Multiple payment gateways
- Address validation
- Shipping cost calculation
- Tax calculation (GST)
- Order preview
- Payment retry logic

**API Endpoints**:
```
POST   /api/v1/checkout/validate
POST   /api/v1/checkout/calculate
POST   /api/v1/checkout/process
GET    /api/v1/checkout/addresses
POST   /api/v1/checkout/addresses
PUT    /api/v1/checkout/addresses/:id
DELETE /api/v1/checkout/addresses/:id
```

### Order Service (Port 3005)

**Purpose**: Order management and tracking

**Responsibilities**:
- Order creation & management
- Order status updates
- Order history
- Invoice generation
- Shipment tracking
- Returns & refunds
- Order analytics

**Database**: PostgreSQL
- Tables: orders, order_items, shipments, refunds, invoices

**Key Features**:
- Order lifecycle management
- Real-time tracking
- Email notifications
- Invoice generation (PDF)
- Return/refund processing
- Order analytics

**API Endpoints**:
```
GET    /api/v1/orders
GET    /api/v1/orders/:id
POST   /api/v1/orders
PUT    /api/v1/orders/:id/status
GET    /api/v1/orders/:id/track
POST   /api/v1/orders/:id/cancel
POST   /api/v1/orders/:id/return
GET    /api/v1/orders/:id/invoice
```

### User Service (Port 3006)

**Purpose**: User profile and preferences management

**Responsibilities**:
- User profile management
- Address management
- Preferences & settings
- Wishlist management
- Order history view
- Notification preferences
- Account settings

**Database**: MongoDB
- Collections: user_profiles, addresses, wishlists, preferences

**Key Features**:
- Profile updates
- Multiple addresses
- Wishlist management
- Notification settings
- Privacy settings
- Account deletion

**API Endpoints**:
```
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
GET    /api/v1/users/addresses
POST   /api/v1/users/addresses
PUT    /api/v1/users/addresses/:id
DELETE /api/v1/users/addresses/:id
GET    /api/v1/users/wishlist
POST   /api/v1/users/wishlist
DELETE /api/v1/users/wishlist/:id
GET    /api/v1/users/preferences
PUT    /api/v1/users/preferences
```

## Data Flow

### Authentication Flow
```
Client → API Gateway → Auth Service
                     ↓
                  MongoDB (users)
                     ↓
                  JWT Token
                     ↓
                  Client (stored)
```

### Product Search Flow
```
Client → API Gateway → Product Service
                     ↓
                  MongoDB (products)
                     ↓
                  Search Results
                     ↓
                  Redis Cache
```

### Add to Cart Flow
```
Client → API Gateway → Cart Service
                     ↓
                  Redis (cart:userId)
                     ↓
                  Product Service (price check)
                     ↓
                  Updated Cart
```

### Checkout Flow
```
Client → API Gateway → Checkout Service
                     ↓
                  Cart Service (get cart)
                     ↓
                  Payment Gateway
                     ↓
                  Order Service (create order)
                     ↓
                  PostgreSQL (orders)
                     ↓
                  Cart Service (clear cart)
                     ↓
                  Email Service (confirmation)
```

## Communication Patterns

### Synchronous (REST APIs)
- Client ↔ API Gateway
- API Gateway ↔ Microservices
- Service-to-Service (when needed)

### Asynchronous (Message Queue - Optional)
- Order Created → Email Service
- Order Shipped → Notification Service
- Inventory Low → Alert Service

## Security

### Authentication
- JWT-based authentication
- Access tokens (15 min expiry)
- Refresh tokens (7 days expiry)
- Token rotation on refresh

### Authorization
- Role-based access control (RBAC)
- Route-level permissions
- Resource-level permissions

### Data Security
- Password hashing (bcrypt)
- HTTPS/TLS encryption
- Input validation & sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### API Security
- Rate limiting
- CORS configuration
- Helmet.js security headers
- API key validation (service-to-service)

## Scalability

### Horizontal Scaling
- Stateless services
- Load balancing
- Container orchestration (K8s)
- Auto-scaling based on metrics

### Caching Strategy
- Redis for frequently accessed data
- Cache invalidation on updates
- Cache warming for popular items
- CDN for static assets

### Database Optimization
- Indexing strategy
- Query optimization
- Connection pooling
- Read replicas
- Sharding (if needed)

## Monitoring & Observability

### Logging
- Centralized logging (ELK)
- Structured JSON logs
- Log levels (error, warn, info, debug)
- Request/response logging
- Error tracking

### Metrics
- Prometheus metrics
- Grafana dashboards
- Service health checks
- Performance metrics
- Business metrics

### Tracing
- Distributed tracing
- Request correlation IDs
- Service dependency mapping

### Alerting
- Error rate alerts
- Performance degradation alerts
- Resource utilization alerts
- Business metric alerts

## Deployment

### Development
```bash
npm run dev  # All services locally
```

### Docker
```bash
docker-compose up  # All services + databases
```

### Kubernetes
```bash
kubectl apply -f infrastructure/kubernetes/
```

### CI/CD Pipeline
```
Code Push → Tests → Build → Docker Image → Deploy → Health Check
```

## Best Practices

1. **API Design**: RESTful, versioned, consistent
2. **Error Handling**: Consistent error responses
3. **Validation**: Input validation at API layer
4. **Testing**: Unit, integration, E2E tests
5. **Documentation**: OpenAPI/Swagger specs
6. **Code Quality**: ESLint, Prettier, TypeScript
7. **Security**: Regular dependency updates
8. **Performance**: Caching, optimization
9. **Monitoring**: Comprehensive observability
10. **Disaster Recovery**: Backups, failover

## Future Enhancements

- GraphQL API layer
- gRPC for service-to-service communication
- Event sourcing for order history
- CQRS pattern for read/write separation
- Service mesh (Istio)
- API versioning strategy
- Multi-region deployment
- Advanced analytics

---

**Last Updated**: 2024
**Version**: 1.0.0