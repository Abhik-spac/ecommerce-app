# Backend & CMS Architecture for E-Commerce Platform

## Executive Summary

This document outlines the complete backend architecture and CMS integration strategy for the Angular microfrontend e-commerce platform. The design follows microservices principles to align with the frontend's microfrontend architecture.

---

## 🎯 Recommended Tech Stack

### Backend Framework: **Spring Boot 3.x (Java 21)**

**Why Spring Boot?**
- ✅ Enterprise-grade, production-ready
- ✅ Excellent microservices support (Spring Cloud)
- ✅ Strong security framework (Spring Security + OAuth2)
- ✅ Rich ecosystem and community
- ✅ Native support for reactive programming (WebFlux)
- ✅ Built-in monitoring and observability
- ✅ Seamless integration with modern CMS platforms

### CMS Platform: **Strapi (Headless CMS)**

**Why Strapi?**
- ✅ Modern headless CMS with REST & GraphQL APIs
- ✅ Flexible content modeling
- ✅ Built-in media library
- ✅ Role-based access control (RBAC)
- ✅ Easy integration with Java backends
- ✅ Self-hosted option for full control
- ✅ Rich plugin ecosystem
- ✅ Developer-friendly with customization options

**Alternative CMS Options:**
1. **Contentful** - Cloud-native, enterprise-grade
2. **Sanity.io** - Real-time collaboration, flexible
3. **Directus** - Open-source, database-first approach

---

## 🏗️ Backend Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway                              │
│                    (Spring Cloud Gateway)                        │
│                         Port: 8080                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Routes & Load Balancing
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   Product    │      │     Cart     │     │   Order      │
│   Service    │      │   Service    │     │   Service    │
│   Port: 8081 │      │  Port: 8082  │     │  Port: 8083  │
└──────────────┘      └──────────────┘     └──────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│     User     │      │   Payment    │     │  Inventory   │
│   Service    │      │   Service    │     │   Service    │
│   Port: 8084 │      │  Port: 8085  │     │  Port: 8086  │
└──────────────┘      └──────────────┘     └──────────────┘
        │                     │                     │
        └─────────────────────┴─────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         Service Discovery               │
        │         (Eureka Server)                 │
        │         Port: 8761                      │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │      Configuration Server               │
        │      (Spring Cloud Config)              │
        │         Port: 8888                      │
        └─────────────────────────────────────────┘
```

### CMS Integration Layer

```
┌─────────────────────────────────────────────────────────────────┐
│                         Strapi CMS                               │
│                         Port: 1337                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Content Types:                                           │  │
│  │  - Products (catalog, descriptions, images)              │  │
│  │  - Categories (taxonomy, navigation)                     │  │
│  │  - Pages (CMS pages, landing pages)                      │  │
│  │  - Banners (promotional content)                         │  │
│  │  - Blog Posts (content marketing)                        │  │
│  │  - SEO Metadata (meta tags, schemas)                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST/GraphQL API
                              ▼
        ┌─────────────────────────────────────────┐
        │      CMS Integration Service            │
        │      (Spring Boot)                      │
        │      Port: 8087                         │
        │  -                   │
        │  - Transforms data for frontend         │
        │  - Handles webhooks from Strapi         │
        └─────────────────────────────────────────┘
```

---

## 📦 Microservices Breakdown

### 1. API Gateway Service (Port: 8080)
**Technology:** Spring Cloud Gateway
**Responsibilities:**
- Route requests to appropriate microservices
- Load balancing
- Rate limiting
- Authentication/Authorization (JWT validation)
- CORS configuration
- Request/Response logging
- Circuit breaker pattern

**Key Dependencies:**
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

### 2. Product Service (Port: 8081)
**Responsibilities:**
- Product CRUD operations
- Product search and filtering
- Category management
- Product variants handling
- Inventory integration
- CMS content synchronization

**Database:** PostgreSQL
**Cache:** Redis

**API Endpoints:**
```
GET    /api/products                    - List products (paginated, filtered)
GET    /api/products/{id}               - Get product details
GET    /api/products/slug/{slug}        - Get product by slug
POST   /api/products                    - Create product (Admin)
PUT    /api/products/{id}               - Update product (Admin)
DELETE /api/products/{id}               - Delete product (Admin)
GET    /api/products/search             - Search products
GET    /api/products/featured           - Get featured products
GET    /api/categories                  - List categories
GET    /api/categories/{id}/products    - Products by category
```

**Domain Model:**
```java
@Entity
@Table(name = "products")
public class Product {
    @Id
    private String id;
    private String sku;
    private String name;
    private String slug;
    private String description;
    private String shortDescription;
    private String categoryId;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private String status;
    private Boolean isFeatured;
    private Boolean isNew;
    private Double rating;
    private Integer reviewCount;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<ProductImage> images;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<ProductVariant> variants;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<ProductAttribute> attributes;
    
    @Embedded
    private ProductInventory inventory;
    
    @ElementCollection
    private List<String> tags;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### 3. Cart Service (Port: 8082)
**Responsibilities:**
- Shopping cart management
- Add/remove/update cart items
- Cart persistence (logged-in users)
- Cart expiration handling
- Price calculation

**Database:** Redis (for session-based carts)
**Persistent Storage:** PostgreSQL (for logged-in users)

**API Endpoints:**
```
GET    /api/cart                        - Get current cart
POST   /api/cart/items                  - Add item to cart
PUT    /api/cart/items/{itemId}         - Update cart item quantity
DELETE /api/cart/items/{itemId}         - Remove item from cart
DELETE /api/cart                         - Clear cart
POST   /api/cart/merge                  - Merge guest cart with user cart
```

**Domain Model:**
```java
@Entity
@Table(name = "carts")
public class Cart {
    @Id
    private String id;
    private String userId;
    private String sessionId;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<CartItem> items;
    
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal total;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime expiresAt;
}

@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    private String id;
    private String cartId;
    private String productId;
    private String name;
    private BigDecimal price;
    private Integer quantity;
    private String image;
    private BigDecimal total;
}
```

### 4. Order Service (Port: 8083)
**Responsibilities:**
- Order creation and management
- Order status tracking
- Order history
- Invoice generation
- Integration with payment service
- Order notifications

**Database:** PostgreSQL
**Message Queue:** RabbitMQ/Kafka (for order events)

**API Endpoints:**
```
POST   /api/orders                      - Create order
GET    /api/orders                      - List user orders
GET    /api/orders/{id}                 - Get order details
PUT    /api/orders/{id}/status          - Update order status (Admin)
PUT    /api/orders/{id}/cancel          - Cancel order
GET    /api/orders/{id}/invoice         - Download invoice
GET    /api/orders/{id}/track           - Track order
POST   /api/orders/{id}/return          - Initiate return
```

**Domain Model:**
```java
@Entity
@Table(name = "orders")
public class Order {
    @Id
    private String id;
    private String orderNumber;
    private String userId;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
    
    @Enumerated(EnumType.STRING)
    private FulfillmentStatus fulfillmentStatus;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<OrderItem> items;
    
    @Embedded
    private OrderPricing pricing;
    
    @Embedded
    private Address shippingAddress;
    
    @Embedded
    private Address billingAddress;
    
    private String paymentMethod;
    private String paymentTransactionId;
    
    @Embedded
    private OrderTimeline timeline;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

public enum OrderStatus {
    PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
}

public enum PaymentStatus {
    PENDING, PAID, FAILED, REFUNDED
}

public enum FulfillmentStatus {
    UNFULFILLED, PARTIALLY_FULFILLED, FULFILLED
}
```

### 5. User Service (Port: 8084)
**Responsibilities:**
- User registration and profile management
- Address management
- User preferences
- Wishlist management
- User activity tracking

**Database:** PostgreSQL

**API Endpoints:**
```
POST   /api/users/register              - Register new user
GET    /api/users/profile               - Get user profile
PUT    /api/users/profile               - Update profile
GET    /api/users/addresses             - List addresses
POST   /api/users/addresses             - Add address
PUT    /api/users/addresses/{id}        - Update address
DELETE /api/users/addresses/{id}        - Delete address
GET    /api/users/wishlist              - Get wishlist
POST   /api/users/wishlist              - Add to wishlist
DELETE /api/users/wishlist/{productId}  - Remove from wishlist
```

**Domain Model:**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String passwordHash;
    private String firstName;
    private String lastName;
    private String phone;
    private String avatar;
    
    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    @Enumerated(EnumType.STRING)
    private UserStatus status;
    
    private Boolean emailVerified;
    private Boolean phoneVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<Address> addresses;
}

@Entity
@Table(name = "addresses")
public class Address {
    @Id
    private String id;
    private String userId;
    
    @Enumerated(EnumType.STRING)
    private AddressType type;
    
    private String fullName;
    private String phone;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private Boolean isDefault;
}
```

### 6. Payment Service (Port: 8085)
**Responsibilities:**
- Payment processing
- Payment gateway integration (Razorpay, Stripe, PayPal)
- Payment verification
- Refund processing
- Payment history

**Database:** PostgreSQL
**External Integrations:** Razorpay, Stripe, PayPal

**API Endpoints:**
```
POST   /api/payments/initiate           - Initiate payment
POST   /api/payments/verify             - Verify payment
POST   /api/payments/refund             - Process refund
GET    /api/payments/{orderId}          - Get payment details
POST   /api/payments/webhook            - Payment gateway webhook
```

**Domain Model:**
```java
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    private String id;
    private String orderId;
    private String userId;
    private BigDecimal amount;
    private String currency;
    
    @Enumerated(EnumType.STRING)
    private PaymentMethod method;
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
    
    private String gatewayTransactionId;
    private String gatewayResponse;
    private LocalDateTime initiatedAt;
    private LocalDateTime completedAt;
    private String failureReason;
}

public enum PaymentMethod {
    CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING, 
    WALLET, COD, EMI
}
```

### 7. Inventory Service (Port: 8086)
**Responsibilities:**
- Stock management
- Inventory tracking
- Low stock alerts
- Stock reservation (during checkout)
- Warehouse management

**Database:** PostgreSQL

**API Endpoints:**
```
GET    /api/inventory/{productId}       - Get stock level
PUT    /api/inventory/{productId}       - Update stock
POST   /api/inventory/reserve           - Reserve stock
POST   /api/inventory/release           - Release reserved stock
GET    /api/inventory/low-stock         - Get low stock items
```

### 8. CMS Integration Service (Port: 8087)
**Responsibilities:**
- Sync content from Strapi CMS
- Cache CMS content
- Transform CMS data for frontend
- Handle Strapi webhooks
- Content versioning

**Database:** Redis (cache)

**API Endpoints:**
```
GET    /api/cms/products/{id}           - Get product content from CMS
GET    /api/cms/categories              - Get categories from CMS
GET    /api/cms/pages/{slug}            - Get CMS page
GET    /api/cms/banners                 - Get promotional banners
POST   /api/cms/webhook                 - Strapi webhook endpoint
POST   /api/cms/sync                    - Manual sync trigger
```

---

## 🗄️ Database Architecture

### Primary Database: PostgreSQL

**Why PostgreSQL?**
- ACID compliance
- JSON support for flexible schemas
- Full-text search capabilities
- Excellent performance
- Strong community support

**Database Schema Design:**

```sql
-- Users Schema
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar VARCHAR(500),
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- Products Schema
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    category_id VARCHAR(36),
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    status VARCHAR(20) NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);

-- Orders Schema
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    fulfillment_status VARCHAR(20) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_method VARCHAR(50),
    payment_transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
```

### Cache Layer: Redis

**Use Cases:**
- Session management
- Cart data (guest users)
- Product catalog cache
- CMS content cache
- Rate limiting
- Real-time inventory

**Redis Data Structures:**
```
# Cart Storage
cart:{sessionId} -> Hash {productId: quantity}
cart:user:{userId} -> Hash {productId: quantity}

# Product Cache
product:{productId} -> JSON
products:featured -> List
products:category:{categoryId} -> List

# CMS Content Cache
cms:page:{slug} -> JSON
cms:banners -> List
cms:categories -> JSON

# Session Management
session:{sessionId} -> JSON
user:session:{userId} -> String (sessionId)
```

---

## 🔐 Authentication & Authorization

### Authentication Strategy: JWT (JSON Web Tokens)

**Flow:**
```
1. User Login → Auth Service validates credentials
2. Auth Service generates JWT token (access + refresh)
3. Frontend stores tokens (httpOnly cookies or localStorage)
4. API Gateway validates JWT on each request
5. Gateway forwards user context to microservices
```

**JWT Structure:**
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "USER",
  "iat": 1234567890,
  "exp": 1234571490
}
```

**Spring Security Configuration:**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/products/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtConverter()))
            );
        return http.build();
    }
}
```

### Authorization Levels:
- **GUEST** - Browse products, view cart
- **USER** - Place orders, manage profile
- **ADMIN** - Manage products, orders, users
- **SUPER_ADMIN** - Full system access

---

## 📡 API Communication Patterns

### 1. Synchronous Communication (REST)
- Frontend ↔ API Gateway
- API Gateway ↔ Microservices
- Microservices ↔ CMS

### 2. Asynchronous Communication (Message Queue)
**Technology:** RabbitMQ or Apache Kafka

**Event-Driven Scenarios:**
```
Order Created Event → 
  - Inventory Service (reserve stock)
  - Payment Service (initiate payment)
  - Notification Service (send confirmation email)

Payment Completed Event →
  - Order Service (update status)
  - Inventory Service (deduct stock)
  - User Service (update order history)

Product Updated Event →
  - Search Service (update index)
  - Cache Service (invalidate cache)
```

---

## 🎨 CMS Integration Strategy

### Strapi Content Types

#### 1. Product Content Type
```javascript
{
  "name": "Product",
  "attributes": {
    "productId": "string",  // Reference to backend product
    "richDescription": "richtext",
    "specifications": "json",
    "seoTitle": "string",
    "seoDescription": "text",
    "seoKeywords": "string",
    "images": "media",  // Multiple images
    "videos": "media",
    "relatedProducts": "relation",
    "faqs": "component",
    "reviews": "component"
  }
}
```

#### 2. Category Content Type
```javascript
{
  "name": "Category",
  "attributes": {
    "categoryId": "string",
    "name": "string",
    "slug": "string",
    "description": "richtext",
    "banner": "media",
    "icon": "media",
    "seoTitle": "string",
    "seoDescription": "text",
    "parentCategory": "relation"
  }
}
```

#### 3. Page Content Type (Landing Pages)
```javascript
{
  "name": "Page",
  "attributes": {
    "title": "string",
    "slug": "string",
    "content": "dynamiczone",  // Flexible content blocks
    "seoTitle": "string",
    "seoDescription": "text",
    "publishedAt": "datetime"
  }
}
```

#### 4. Banner Content Type
```javascript
{
  "name": "Banner",
  "attributes": {
    "title": "string",
    "subtitle": "string",
    "image": "media",
    "mobileImage": "media",
    "ctaText": "string",
    "ctaLink": "string",
    "position": "enumeration",
    "startDate": "datetime",
    "endDate": "datetime",
    "isActive": "boolean"
  }
}
```

### CMS Webhook Integration

**Strapi Webhook Configuration:**
```javascript
// Webhook URL: http://backend-api:8087/api/cms/webhook

// Events to listen:
- entry.create
- entry.update
- entry.delete
- entry.publish
- entry.unpublish
```

**Backend Webhook Handler:**
```java
@RestController
@RequestMapping("/api/cms/webhook")
public class CmsWebhookController {
    
    @PostMapping
    public ResponseEntity<Void> handleWebhook(@RequestBody WebhookPayload payload) {
        switch(payload.getEvent()) {
            case "entry.create":
            case "entry.update":
                cacheService.invalidate(payload.getModel(), payload.getEntry().getId());
                searchService.reindex(payload.getModel(), payload.getEntry());
                break;
            case "entry.delete":
                cacheService.remove(payload.getModel(), payload.getEntry().getId());
                searchService.removeFromIndex(payload.getModel(), payload.getEntry().getId());
                break;
        }
        return ResponseEntity.ok().build();
    }
}
```

### Content Synchronization Strategy

**Approach 1: Real-time Sync (Recommended)**
- Strapi webhook triggers immediate cache invalidation
- Backend fetches fresh content on next request
- Redis cache with TTL (Time To Live)

**Approach 2: Scheduled Sync**
- Cron job runs every 15 minutes
- Fetches all updated content from Strapi
- Updates cache and database

**Approach 3: Hybrid**
- Webhooks for critical content (products, prices)
- Scheduled sync for non-critical content (blog posts, pages)

---

## 🚀 Deployment Architecture

### Containerization: Docker

**Docker Compose Structure:**
```yaml
version: '3.8'

services:
  # API Gateway
  api-gateway:
    build: ./api-gateway
    ports:
      - "8080:8080"
    environment:
      - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka
    depends_on:
      - eureka-server
      - config-server

  # Product Service
  product-service:
    build: ./product-service
    ports:
      - "8081:8081"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ecommerce
      - SPRING_REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
      - eureka-server

  # Cart Service
  cart-service:
    build: ./cart-service
    ports:
      - "8082:8082"
    environment:
      - SPRING_REDIS_HOST=redis
    depends_on:
      - redis
      - eureka-server

  # Order Service
  order-service:
    build: ./order-service
    ports:
      - "8083:8083"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ecommerce
      - SPRING_RABBITMQ_HOST=rabbitmq
    depends_on:
      - postgres
      - rabbitmq
      - eureka-server

  # User Service
  user-service:
    build: ./user-service
    ports:
      - "8084:8084"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ecommerce
    depends_on:
      - postgres
      - eureka-server

  # Payment Service
  payment-service:
    build: ./payment-service
    ports:
      - "8085:8085"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ecommerce
    depends_on:
      - postgres
      - eureka-server

  # Inventory Service
  inventory-service:
    build: ./inventory-service
    ports:
      - "8086:8086"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ecommerce
    depends_on:
      - postgres
      - eureka-server

  # CMS Integration Service
  cms-integration-service:
    build: ./cms-integration-service
    ports:
      - "8087:8087"
    environment:
      - STRAPI_URL=http://strapi:1337
      - SPRING_REDIS_HOST=redis
    depends_on:
      - redis
      - strapi
      - eureka-server

  # Eureka Server
  eureka-server:
    build: ./eureka-server
    ports:
      - "8761:8761"

  # Config Server
  config-server:
    build: ./config-server
    ports:
      - "8888:8888"

  # PostgreSQL
  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=ecommerce
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=admin123
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  # RabbitMQ
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      - RABBITMQ_DEFAULT_USER=admin
      - RABBITMQ_DEFAULT_PASS=admin123

  # Strapi CMS
  strapi:
    image: strapi/strapi:latest
    ports:
      - "1337:1337"
    environment:
      - DATABASE_CLIENT=postgres
      - DATABASE_HOST=postgres
      - DATABASE_PORT=5432
      - DATABASE_NAME=strapi
      - DATABASE_USERNAME=admin
      - DATABASE_PASSWORD=admin123
    volumes:
      - strapi-data:/srv/app
    depends_on:
      - postgres

volumes:
  postgres-data:
  redis-data:
  strapi-data:
```

### Kubernetes Deployment (Production)

**Namespace Structure:**
```
ecommerce-backend/
├── api-gateway/
├── product-service/
├── cart-service/
├── order-service/
├── user-service/
├── payment-service/
├── inventory-service/
├── cms-integration-service/
├── infrastructure/
│   ├── postgres/
│   ├── redis/
│   ├── rabbitmq/
│   └── strapi/
└── monitoring/
    ├── prometheus/
    └── grafana/
```

---

## 📊 Monitoring & Observability

### Tools:
1. **Prometheus** - Metrics collection
2. **Grafana** - Visualization
3. **ELK Stack** - Logging (Elasticsearch, Logstash, Kibana)
4. **Jaeger** - Distributed tracing
5. **Spring Boot Actuator** - Health checks

### Key Metrics to Monitor:
- Request rate and latency
- Error rates
- Database connection pool
- Cache hit/miss ratio
- Message queue depth
- Service availability
- Resource utilization (CPU, memory)

---

## 🔄 CI/CD Pipeline

### Pipeline Stages:
```
1. Code Commit (Git)
   ↓
2. Build (Maven/Gradle)
   ↓
3. Unit Tests
   ↓
4. Integration Tests
   ↓
5. Code Quality (SonarQube)
   ↓
6. Security Scan (OWASP)
   ↓
7. Docker Build
   ↓
8. Push to Registry
   ↓
9. Deploy to Dev
   ↓
10. Deploy to Staging
   ↓
11. Deploy to Production (Manual approval)
```

### Tools:
- **CI/CD:** Jenkins, GitLab CI, GitHub Actions
- **Container Registry:** Docker Hub, AWS ECR, Google GCR
- **Orchestration:** Kubernetes, Docker Swarm

---

## 📝 Project Structure

```
ecommerce-backend/
├── api-gateway/
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── product-service/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/ecommerce/product/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── model/
│   │   │   │       ├── dto/
│   │   │   │       └── config/
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── bootstrap.yml
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
├── cart-service/
├── order-service/
├── user-service/
├── payment-service/
├── inventory-service/
├── cms-integration-service/
├── eureka-server/
├── config-server/
├── common/
│   └── shared-models/
├── docker-compose.yml
├── kubernetes/
│   ├── deployments/
│   ├── services/
│   └── ingress/
└── README.md
```

---

## 🎯 Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up project structure
- [ ] Configure Spring Boot microservices
- [ ] Set up PostgreSQL and Redis
- [ ] Implement API Gateway
- [ ] Set up Eureka Server
- [ ] Configure Spring Cloud Config

### Phase 2: Core Services (Weeks 3-5)
- [ ] Implement Product Service
- [ ] Implement User Service
- [ ] Implement Cart Service
- [ ] Implement Authentication & Authorization
- [ ] Set up database schemas

### Phase 3: Order & Payment (Weeks 6-7)
- [ ] Implement Order Service
- [ ] Implement Payment Service
- [ ] Integrate payment gateways (Razorpay)
- [ ] Implement order workflow

### Phase 4: CMS Integration (Week 8)
- [ ] Set up Strapi CMS
- [ ] Configure content types
- [ ] Implement CMS Integration Service
- [ ] Set up webhooks
- [ ] Implement content caching

### Phase 5: Advanced Features (Weeks 9-10)
- [ ] Implement Inventory Service
- [ ] Set up message queue (RabbitMQ)
- [ ] Implement event-driven architecture
- [ ] Add search functionality (Elasticsearch)

### Phase 6: Testing & Optimization (Weeks 11-12)
- [ ] Unit testing
- [ ] Integration testing
- [ ] Performance testing
- [ ] Security testing
- [ ] Load testing

### Phase 7: Deployment (Weeks 13-14)
- [ ] Containerize all services
- [ ] Set up Kubernetes cluster
- [ ] Configure CI/CD pipeline
- [ ] Set up monitoring and logging
- [ ] Production deployment

---

## 💰 Cost Estimation (Monthly)

### Development Environment:
- **Local Development:** Free
- **Docker Containers:** Free

### Production Environment (AWS):
- **EC2 Instances (t3.medium x 8):** ~$240
- **RDS PostgreSQL (db.t3.medium):** ~$70
- **ElastiCache Redis (cache.t3.micro):** ~$15
- **Application Load Balancer:** ~$20
- **S3 Storage (100GB):** ~$3
- **CloudWatch Monitoring:** ~$10
- **Total:** ~$358/month

### Alternative (Kubernetes on AWS EKS):
- **EKS Cluster:** ~$73
- **Worker Nodes (t3.medium x 3):** ~$90
- **RDS + Redis + S3:** ~$88
- **Total:** ~$251/month

### CMS Hosting:
- **Self-hosted Strapi:** Included in above
- **Strapi Cloud (Alternative):** $99-$499/month

---

## 🔒 Security Best Practices

1. **API Security:**
   - JWT authentication
   - Rate limiting
   - CORS configuration
   - Input validation
   - SQL injection prevention

2. **Data Security:**
   - Encryption at rest
   - Encryption in transit (TLS/SSL)
   - Password hashing (BCrypt)
   - PII data protection

3. **Infrastructure Security:**
   - Network segmentation
   - Firewall rules
   - Security groups
   - Regular security audits

4. **Compliance:**
   - GDPR compliance
   - PCI DSS (for payments)
   - Data retention policies

---

## 📚 Technology Stack Summary

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend Framework | Spring Boot | 3.2.x |
| Language | Java | 21 |
| API Gateway | Spring Cloud Gateway | 4.1.x |
| Service Discovery | Eureka | 4.1.x |
| Config Server | Spring Cloud Config | 4.1.x |
| Database | PostgreSQL | 15 |
| Cache | Redis | 7 |
| Message Queue | RabbitMQ | 3.12 |
| CMS | Strapi | 4.x |
| Container | Docker | 24.x |
| Orchestration | Kubernetes | 1.28 |
| Monitoring | Prometheus + Grafana | Latest |
| Logging | ELK Stack | 8.x |
| CI/CD | Jenkins/GitHub Actions | Latest |

---

## 🤝 Integration with Frontend

### API Base URLs:
```
Development:
- API Gateway: http://localhost:8080
- Strapi CMS: http://localhost:1337

Production:
- API Gateway: https://api.yourdomain.com
- Strapi CMS: https://cms.yourdomain.com
```

### Frontend Environment Configuration:
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  cmsUrl: 'http://localhost:1337/api',
  wsUrl: 'ws://localhost:8080/ws'
};
```

### API Response Format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response Format:
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID 123 not found",
    "details": []
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 📞 Next Steps

1. **Review this architecture** with your team
2. **Clarify requirements** - Any specific features or integrations?
3. **Choose CMS platform** - Strapi vs alternatives
4. **Set up development environment**
5. **Start with Phase 1** of implementation roadmap

---

## 📖 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)
- [Strapi Documentation](https://docs.strapi.io/)
- [Microservices Patterns](https://microservices.io/patterns/)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-17  
**Author:** Backend Architecture Team