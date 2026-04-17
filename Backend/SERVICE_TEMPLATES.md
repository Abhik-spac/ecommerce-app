# Service Templates for Remaining Microservices

This document provides templates for creating the remaining microservices. Each service follows the same structure.

## Services to Create

1. **cart-service** (Port: 8082, DB: cart_db)
2. **order-service** (Port: 8083, DB: order_db)
3. **payment-service** (Port: 8085, DB: payment_db)
4. **inventory-service** (Port: 8086, DB: inventory_db)
5. **cms-integration-service** (Port: 8087, DB: cms_db)

## Standard Service Structure

```
{service-name}/
├── src/
│   ├── main/
│   │   ├── java/com/ecommerce/{servicename}/
│   │   │   └── {ServiceName}Application.java
│   │   └── resources/
│   │       └── application.yml
│   └── test/
│       └── java/com/ecommerce/{servicename}/
├── Dockerfile
├── pom.xml
└── README.md
```

## Template: pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.ecommerce</groupId>
        <artifactId>ecommerce-backend</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>{service-name}</artifactId>
    <packaging>jar</packaging>

    <name>{Service Name}</name>
    <description>{Service description}</description>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
        </dependency>
        <dependency>
            <groupId>com.ecommerce</groupId>
            <artifactId>common-lib</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

## Template: application.yml

```yaml
spring:
  application:
    name: {service-name}
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:{db_name}}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
  cache:
    type: redis

server:
  port: {port}

eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka/}
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always

springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html

logging:
  level:
    root: INFO
    com.ecommerce: DEBUG
```

## Template: Application.java

```java
package com.ecommerce.{packagename};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * {ServiceName} Application
 * {Description}
 */
@SpringBootApplication(scanBasePackages = {"com.ecommerce.{packagename}", "com.ecommerce.common"})
@EnableDiscoveryClient
public class {ServiceName}Application {

    public static void main(String[] args) {
        SpringApplication.run({ServiceName}Application.class, args);
    }
}
```

## Template: Dockerfile

```dockerfile
FROM eclipse-temurin:21-jre-alpine

LABEL maintainer="ecommerce-team"
LABEL service="{service-name}"

WORKDIR /app

COPY target/{service-name}-*.jar app.jar

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

EXPOSE {port}

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:{port}/actuator/health || exit 1

ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", \
    "app.jar"]
```

## Template: README.md

```markdown
# {Service Name}

## Overview
{Service description}

## Port
**{port}**

## Database
**{db_name}**

## Features
- RESTful API endpoints
- PostgreSQL database integration
- Redis caching support
- Service discovery with Eureka
- OpenAPI documentation
- Health checks and metrics

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | {db_name} |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | postgres |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `EUREKA_SERVER_URL` | Eureka server URL | http://localhost:8761/eureka/ |

## Running the Service

### Local Development
\`\`\`bash
mvn spring-boot:run
\`\`\`

### Docker
\`\`\`bash
docker build -t ecommerce/{service-name}:latest .
docker run -p {port}:{port} \
  -e DB_HOST=postgres \
  -e REDIS_HOST=redis \
  ecommerce/{service-name}:latest
\`\`\`

## API Documentation
- Swagger UI: http://localhost:{port}/swagger-ui.html
- OpenAPI JSON: http://localhost:{port}/api-docs

## Health Check
\`\`\`bash
curl http://localhost:{port}/actuator/health
\`\`\`
```

## Service-Specific Details

### Cart Service (8082)
- **Purpose**: Shopping cart management
- **Key Features**: Add/remove items, cart persistence, cart expiration
- **Dependencies**: Product Service, User Service

### Order Service (8083)
- **Purpose**: Order processing and management
- **Key Features**: Order creation, status tracking, order history
- **Dependencies**: Cart Service, Payment Service, Inventory Service

### Payment Service (8085)
- **Purpose**: Payment processing
- **Key Features**: Payment gateway integration, transaction management
- **Dependencies**: Order Service

### Inventory Service (8086)
- **Purpose**: Stock and inventory management
- **Key Features**: Stock tracking, inventory updates, low stock alerts
- **Dependencies**: Product Service

### CMS Integration Service (8087)
- **Purpose**: Strapi CMS integration
- **Key Features**: Content synchronization, webhook handling
- **Additional Config**:
  ```yaml
  strapi:
    url: ${STRAPI_URL:http://localhost:1337}
    api-token: ${STRAPI_API_TOKEN:your-token}
  ```

## Quick Setup Commands

For each service, create the directory structure and copy the templates:

```bash
# Example for cart-service
mkdir -p cart-service/src/main/java/com/ecommerce/cart
mkdir -p cart-service/src/main/resources
mkdir -p cart-service/src/test/java/com/ecommerce/cart

# Copy and customize templates
# - pom.xml
# - application.yml
# - CartServiceApplication.java
# - Dockerfile
# - README.md
```

## Next Steps

1. Create directory structure for each service
2. Copy and customize templates
3. Implement domain models and repositories
4. Create service layer
5. Implement REST controllers
6. Add unit and integration tests
7. Update docker-compose.yml (already done)
8. Test service integration

## Notes

- All services are already configured in docker-compose.yml
- Database initialization script is in docker-compose/init-databases.sh
- Common library provides shared DTOs and utilities
- Follow the product-service implementation as a reference