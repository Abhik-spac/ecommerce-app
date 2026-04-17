# E-Commerce Backend - Microservices Architecture

## Overview
A comprehensive Spring Boot 3.x microservices-based e-commerce backend system with service discovery, API gateway, centralized configuration, and multiple business services.

## Architecture

### Technology Stack
- **Framework**: Spring Boot 3.2.5
- **Java Version**: 21
- **Build Tool**: Maven
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Configuration**: Spring Cloud Config
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Containerization**: Docker
- **Documentation**: OpenAPI 3.0 (Swagger)

### Microservices

| Service | Port | Description |
|---------|------|-------------|
| **API Gateway** | 8080 | Entry point, routing, authentication, rate limiting |
| **Eureka Server** | 8761 | Service discovery and registration |
| **Config Server** | 8888 | Centralized configuration management |
| **Product Service** | 8081 | Product catalog and category management |
| **User Service** | 8084 | User management and authentication |
| **Cart Service** | 8082 | Shopping cart operations |
| **Order Service** | 8083 | Order processing and management |
| **Payment Service** | 8085 | Payment processing integration |
| **Inventory Service** | 8086 | Stock and inventory management |
| **CMS Integration** | 8087 | Strapi CMS integration for content |

## Project Structure

```
ecommerce-backend/
├── api-gateway/                 # API Gateway service
├── config-server/               # Configuration server
├── eureka-server/               # Service discovery
├── product-service/             # Product management
├── user-service/                # User & authentication
├── cart-service/                # Shopping cart
├── order-service/               # Order processing
├── payment-service/             # Payment handling
├── inventory-service/           # Inventory management
├── cms-integration-service/     # CMS integration
├── common-lib/                  # Shared utilities and DTOs
├── docker-compose/              # Docker orchestration
│   ├── docker-compose.yml
│   └── init-databases.sh
├── pom.xml                      # Parent POM
├── checkstyle.xml              # Code quality rules
└── README.md                    # This file
```

## Quick Start

### Prerequisites
- Java 21 or higher
- Maven 3.8+
- Docker and Docker Compose
- PostgreSQL 15 (if running locally)
- Redis 7 (if running locally)

### Build All Services

```bash
# Build all modules
mvn clean install

# Skip tests for faster build
mvn clean install -DskipTests
```

### Run with Docker Compose

```bash
# Navigate to docker-compose directory
cd docker-compose

# Make init script executable
chmod +x init-databases.sh

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Run Services Individually

#### 1. Start Infrastructure Services

```bash
# Start PostgreSQL
docker run -d --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Start Redis
docker run -d --name redis \
  -p 6379:6379 \
  redis:7-alpine
```

#### 2. Start Core Services (in order)

```bash
# 1. Eureka Server
cd eureka-server
mvn spring-boot:run

# 2. Config Server
cd config-server
mvn spring-boot:run

# 3. API Gateway
cd api-gateway
mvn spring-boot:run
```

#### 3. Start Business Services

```bash
# Product Service
cd product-service
mvn spring-boot:run

# User Service
cd user-service
mvn spring-boot:run

# Other services...
```

## Service URLs

### Infrastructure
- **Eureka Dashboard**: http://localhost:8761
- **API Gateway**: http://localhost:8080
- **Config Server**: http://localhost:8888

### API Documentation
- **Product Service**: http://localhost:8081/swagger-ui.html
- **User Service**: http://localhost:8084/swagger-ui.html
- **Cart Service**: http://localhost:8082/swagger-ui.html
- **Order Service**: http://localhost:8083/swagger-ui.html

### Health Checks
```bash
# Check all services
curl http://localhost:8761  # Eureka Dashboard
curl http://localhost:8080/actuator/health  # API Gateway
curl http://localhost:8081/actuator/health  # Product Service
```

## API Gateway Routes

All business services are accessed through the API Gateway:

```
http://localhost:8080/api/products/**    → Product Service
http://localhost:8080/api/users/**       → User Service
http://localhost:8080/api/auth/**        → User Service (Auth)
http://localhost:8080/api/cart/**        → Cart Service
http://localhost:8080/api/orders/**      → Order Service
http://localhost:8080/api/payments/**    → Payment Service
http://localhost:8080/api/inventory/**   → Inventory Service
http://localhost:8080/api/cms/**         → CMS Integration Service
```

## Authentication

### JWT Token Flow

1. **Register/Login**
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

2. **Use Token**
```bash
GET http://localhost:8080/api/products
Authorization: Bearer <your-jwt-token>
```

## Configuration

### Environment Variables

Create a `.env` file in the docker-compose directory:

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Eureka
EUREKA_SERVER_URL=http://eureka-server:8761/eureka/

# JWT
JWT_SECRET=your-256-bit-secret-key-change-this-in-production

# CMS
STRAPI_URL=http://strapi:1337
STRAPI_API_TOKEN=your-strapi-api-token
```

## Development

### Code Quality

```bash
# Run Checkstyle
mvn checkstyle:check

# Run SpotBugs
mvn spotbugs:check

# Run all quality checks
mvn verify
```

### Testing

```bash
# Run all tests
mvn test

# Run tests with coverage
mvn test jacoco:report

# Integration tests
mvn verify
```

### Adding a New Service

1. Create module directory
2. Add to parent `pom.xml` modules section
3. Create service `pom.xml` with parent reference
4. Implement service following existing patterns
5. Add to `docker-compose.yml`
6. Update this README

## Monitoring

### Prometheus Metrics

All services expose Prometheus metrics:
```
http://localhost:8081/actuator/prometheus
```

### Health Checks

```bash
# Individual service health
curl http://localhost:8081/actuator/health

# Detailed health with dependencies
curl http://localhost:8081/actuator/health | jq
```

## Database Schema

Each service has its own database:
- `product_db` - Product Service
- `user_db` - User Service
- `cart_db` - Cart Service
- `order_db` - Order Service
- `payment_db` - Payment Service
- `inventory_db` - Inventory Service
- `cms_db` - CMS Integration Service

## Common Library

The `common-lib` module provides:
- Standard API response wrappers
- Common DTOs
- Exception handling
- Logging configuration
- Utility classes

## Troubleshooting

### Services Not Registering with Eureka
1. Ensure Eureka Server is running
2. Check network connectivity
3. Verify `eureka.client.service-url.defaultZone` configuration
4. Check service logs for errors

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d product_db

# Check connection pool metrics
curl http://localhost:8081/actuator/metrics/hikaricp.connections
```

### Redis Connection Issues
```bash
# Test Redis connection
redis-cli -h localhost ping

# Check Redis info
redis-cli info
```

### Port Conflicts
```bash
# Check if port is in use
lsof -i :8080

# Kill process using port
kill -9 <PID>
```

## Production Deployment

### Kubernetes

See individual service READMEs for Kubernetes deployment manifests.

### Environment-Specific Configuration

Use Spring profiles:
```bash
# Development
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Production
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## Security Considerations

- Change default passwords in production
- Use environment variables for sensitive data
- Enable HTTPS/TLS
- Implement rate limiting
- Regular security updates
- Use secrets management (e.g., Vault)

## Performance Tuning

- Enable Redis caching
- Configure connection pools
- Use pagination for large datasets
- Implement circuit breakers
- Monitor and optimize database queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow code quality standards
4. Write tests
5. Submit pull request

## License

[Your License Here]

## Support

For issues and questions:
- Create an issue in the repository
- Contact: [your-email@example.com]

## Roadmap

- [ ] Implement message queue (RabbitMQ/Kafka)
- [ ] Add Elasticsearch for product search
- [ ] Implement distributed tracing (Zipkin/Jaeger)
- [ ] Add API versioning
- [ ] Implement GraphQL gateway
- [ ] Add WebSocket support for real-time updates
- [ ] Implement CQRS pattern for order service
- [ ] Add multi-tenancy support

## References

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)
- [Microservices Patterns](https://microservices.io/patterns/)
- [Docker Documentation](https://docs.docker.com/)