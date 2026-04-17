# User Service

## Overview
Microservice responsible for user management, authentication, and authorization using JWT tokens.

## Port
**8084**

## Database
**user_db**

## Features
- User registration and authentication
- JWT token generation and validation
- Password encryption with BCrypt
- Role-based access control (RBAC)
- User profile management
- Redis session management
- OAuth2 integration support

## API Endpoints

### Authentication
```http
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
```

### User Management
```http
GET /users
GET /users/{id}
PUT /users/{id}
DELETE /users/{id}
GET /users/profile
PUT /users/profile
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | user_db |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | postgres |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `JWT_SECRET` | JWT secret key | your-256-bit-secret |
| `EUREKA_SERVER_URL` | Eureka server URL | http://localhost:8761/eureka/ |

## Running the Service

### Local Development
```bash
mvn spring-boot:run
```

### Docker
```bash
docker build -t ecommerce/user-service:latest .
docker run -p 8084:8084 \
  -e DB_HOST=postgres \
  -e REDIS_HOST=redis \
  -e JWT_SECRET=your-secret-key \
  ecommerce/user-service:latest
```

## API Documentation
- Swagger UI: http://localhost:8084/swagger-ui.html
- OpenAPI JSON: http://localhost:8084/api-docs

## Security
- Passwords hashed with BCrypt
- JWT tokens for stateless authentication
- Role-based authorization
- Session management with Redis