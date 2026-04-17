# Product Service

## Overview
Microservice responsible for managing product catalog, categories, and product information.

## Port
**8081**

## Features
- Product CRUD operations
- Category management
- Product search and filtering
- Product inventory tracking
- Redis caching for performance
- Integration with CMS for content
- RESTful API with OpenAPI documentation

## Database Schema

### Products Table
```sql
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category_id BIGINT,
    brand VARCHAR(100),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### Categories Table
```sql
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id BIGINT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);
```

## API Endpoints

### Products

#### Get All Products (Paginated)
```http
GET /products?page=0&size=20&sort=name,asc
```

#### Get Product by ID
```http
GET /products/{id}
```

#### Search Products
```http
GET /products/search?keyword=laptop&category=electronics
```

#### Create Product
```http
POST /products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product Description",
  "sku": "PROD-001",
  "price": 99.99,
  "categoryId": 1,
  "brand": "Brand Name",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Update Product
```http
PUT /products/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 89.99
}
```

#### Delete Product
```http
DELETE /products/{id}
```

### Categories

#### Get All Categories
```http
GET /categories
```

#### Get Category by ID
```http
GET /categories/{id}
```

#### Create Category
```http
POST /categories
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic products",
  "slug": "electronics",
  "parentId": null
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | product_db |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | postgres |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `REDIS_PASSWORD` | Redis password | - |
| `EUREKA_SERVER_URL` | Eureka server URL | http://localhost:8761/eureka/ |

## Running the Service

### Local Development
```bash
# Start PostgreSQL
docker run -d --name postgres \
  -e POSTGRES_DB=product_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Start Redis
docker run -d --name redis \
  -p 6379:6379 \
  redis:7-alpine

# Run the service
mvn spring-boot:run
```

### Docker
```bash
# Build
docker build -t ecommerce/product-service:latest .

# Run
docker run -p 8081:8081 \
  -e DB_HOST=postgres \
  -e REDIS_HOST=redis \
  -e EUREKA_SERVER_URL=http://eureka-server:8761/eureka/ \
  ecommerce/product-service:latest
```

## Caching Strategy

### Cached Operations
- Get product by ID (TTL: 1 hour)
- Get all categories (TTL: 1 hour)
- Product search results (TTL: 30 minutes)

### Cache Invalidation
- Product update/delete → Clear product cache
- Category update/delete → Clear category cache

### Cache Configuration
```yaml
spring:
  cache:
    type: redis
    redis:
      time-to-live: 3600000  # 1 hour
```

## API Documentation

### Swagger UI
```
http://localhost:8081/swagger-ui.html
```

### OpenAPI JSON
```
http://localhost:8081/api-docs
```

## Health Check
```bash
curl http://localhost:8081/actuator/health
```

## Metrics
```bash
curl http://localhost:8081/actuator/metrics
curl http://localhost:8081/actuator/prometheus
```

## Testing

### Run Tests
```bash
mvn test
```

### Run with Coverage
```bash
mvn test jacoco:report
```

### Integration Tests
```bash
mvn verify
```

## Dependencies
- Spring Boot Web
- Spring Data JPA
- Spring Data Redis
- Spring Cloud Eureka Client
- Spring Cloud Config Client
- PostgreSQL Driver
- Lombok
- MapStruct
- SpringDoc OpenAPI
- Common Library

## Performance Considerations

### Database Optimization
- Indexed columns: `sku`, `category_id`, `name`
- Connection pooling with HikariCP
- Batch operations for bulk updates

### Caching
- Redis for frequently accessed data
- Cache-aside pattern
- Automatic cache invalidation

### API Performance
- Pagination for large datasets
- Lazy loading for relationships
- Response compression

## Security
- Input validation on all endpoints
- SQL injection prevention via JPA
- XSS protection
- Rate limiting via API Gateway

## Monitoring
- Prometheus metrics
- Health checks
- Custom business metrics
- Database connection pool monitoring

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL connectivity
psql -h localhost -U postgres -d product_db

# Verify connection pool
curl http://localhost:8081/actuator/metrics/hikaricp.connections
```

### Cache Issues
```bash
# Check Redis connectivity
redis-cli -h localhost ping

# Clear cache
redis-cli FLUSHDB
```

### Service Not Registering with Eureka
- Verify Eureka server is running
- Check network connectivity
- Review application logs
- Verify eureka.client configuration

## Future Enhancements
- Product variants support
- Advanced search with Elasticsearch
- Product recommendations
- Bulk import/export
- Product reviews and ratings
- Multi-language support