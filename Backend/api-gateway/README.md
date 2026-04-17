# API Gateway Service

## Overview
Spring Cloud Gateway-based API Gateway for routing, load balancing, and authentication.

## Port
**8080**

## Features
- **Dynamic Routing**: Routes requests to appropriate microservices
- **Load Balancing**: Distributes traffic across service instances
- **JWT Authentication**: Validates JWT tokens for protected endpoints
- **Circuit Breaker**: Resilience4j-based circuit breaker pattern
- **Rate Limiting**: Redis-based rate limiting
- **CORS Configuration**: Cross-origin resource sharing support
- **Fallback Responses**: Graceful degradation when services are down

## Routes

### Public Endpoints (No Authentication)
- `POST /api/auth/login` → User Service
- `POST /api/auth/register` → User Service
- `GET /api/products` → Product Service (read-only)

### Protected Endpoints (Requires JWT)
- `/api/products/**` → Product Service
- `/api/users/**` → User Service
- `/api/cart/**` → Cart Service
- `/api/orders/**` → Order Service
- `/api/payments/**` → Payment Service
- `/api/inventory/**` → Inventory Service
- `/api/cms/**` → CMS Integration Service

## Configuration

### Environment Variables
```bash
JWT_SECRET=your-256-bit-secret-key
EUREKA_SERVER_URL=http://localhost:8761/eureka/
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Circuit Breaker Settings
- Sliding Window Size: 10 requests
- Failure Rate Threshold: 50%
- Wait Duration in Open State: 5 seconds
- Timeout Duration: 3 seconds

### Rate Limiting
- Replenish Rate: 10 requests/second
- Burst Capacity: 20 requests

## Running the Service

### Local Development
```bash
mvn spring-boot:run
```

### Docker
```bash
# Build
docker build -t ecommerce/api-gateway:latest .

# Run
docker run -p 8080:8080 \
  -e EUREKA_SERVER_URL=http://eureka-server:8761/eureka/ \
  -e REDIS_HOST=redis \
  ecommerce/api-gateway:latest
```

## Health Check
```bash
curl http://localhost:8080/actuator/health
```

## Metrics
Prometheus metrics available at:
```
http://localhost:8080/actuator/prometheus
```

## JWT Token Format
The gateway expects JWT tokens in the Authorization header:
```
Authorization: Bearer <token>
```

The gateway extracts and forwards these headers to downstream services:
- `X-User-Id`: User ID from JWT subject
- `X-User-Email`: User email from JWT claims
- `X-User-Role`: User role from JWT claims

## Dependencies
- Spring Cloud Gateway
- Spring Cloud Netflix Eureka Client
- Spring Cloud Config Client
- Resilience4j Circuit Breaker
- Spring Data Redis (for rate limiting)
- JJWT (for JWT validation)
- Spring Boot Actuator
- Micrometer Prometheus

## Testing
```bash
# Run tests
mvn test

# Run with coverage
mvn test jacoco:report
```

## Troubleshooting

### Service Not Found
- Verify Eureka server is running
- Check service registration in Eureka dashboard
- Ensure service names match in configuration

### JWT Validation Fails
- Verify JWT_SECRET matches across services
- Check token expiration
- Ensure token format is correct

### Circuit Breaker Opens
- Check downstream service health
- Review failure rate threshold
- Monitor service response times