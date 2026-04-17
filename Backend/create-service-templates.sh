#!/bin/bash

# Script to create template structures for remaining microservices
# This creates the basic structure with pom.xml, application.yml, main class, Dockerfile, and README

create_service() {
    local SERVICE_NAME=$1
    local PORT=$2
    local DESCRIPTION=$3
    local DB_NAME=$4
    
    echo "Creating $SERVICE_NAME..."
    
    # Create directory structure
    mkdir -p "$SERVICE_NAME/src/main/java/com/ecommerce/${SERVICE_NAME//-/}"
    mkdir -p "$SERVICE_NAME/src/main/resources"
    mkdir -p "$SERVICE_NAME/src/test/java/com/ecommerce/${SERVICE_NAME//-/}"
    
    # Create application.yml
    cat > "$SERVICE_NAME/src/main/resources/application.yml" <<EOF
spring:
  application:
    name: $SERVICE_NAME
  datasource:
    url: jdbc:postgresql://\${DB_HOST:localhost}:\${DB_PORT:5432}/\${DB_NAME:$DB_NAME}
    username: \${DB_USERNAME:postgres}
    password: \${DB_PASSWORD:postgres}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  data:
    redis:
      host: \${REDIS_HOST:localhost}
      port: \${REDIS_PORT:6379}

server:
  port: $PORT

eureka:
  client:
    service-url:
      defaultZone: \${EUREKA_SERVER_URL:http://localhost:8761/eureka/}
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
EOF

    # Create Main Application Class
    local CLASS_NAME=$(echo $SERVICE_NAME | sed -r 's/(^|-)([a-z])/\U\2/g')
    local PACKAGE_NAME=$(echo $SERVICE_NAME | tr '-' '')
    
    cat > "$SERVICE_NAME/src/main/java/com/ecommerce/$PACKAGE_NAME/${CLASS_NAME}Application.java" <<EOF
package com.ecommerce.$PACKAGE_NAME;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * $CLASS_NAME Application
 * $DESCRIPTION
 */
@SpringBootApplication(scanBasePackages = {"com.ecommerce.$PACKAGE_NAME", "com.ecommerce.common"})
@EnableDiscoveryClient
public class ${CLASS_NAME}Application {

    public static void main(String[] args) {
        SpringApplication.run(${CLASS_NAME}Application.class, args);
    }
}
EOF

    # Create Dockerfile
    cat > "$SERVICE_NAME/Dockerfile" <<EOF
FROM eclipse-temurin:21-jre-alpine

LABEL maintainer="ecommerce-team"
LABEL service="$SERVICE_NAME"

WORKDIR /app

COPY target/$SERVICE_NAME-*.jar app.jar

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

EXPOSE $PORT

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT/actuator/health || exit 1

ENTRYPOINT ["java", \\
    "-XX:+UseContainerSupport", \\
    "-XX:MaxRAMPercentage=75.0", \\
    "-Djava.security.egd=file:/dev/./urandom", \\
    "-jar", \\
    "app.jar"]
EOF

    # Create README
    cat > "$SERVICE_NAME/README.md" <<EOF
# $CLASS_NAME

## Overview
$DESCRIPTION

## Port
**$PORT**

## Database
**$DB_NAME**

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
| \`DB_HOST\` | PostgreSQL host | localhost |
| \`DB_PORT\` | PostgreSQL port | 5432 |
| \`DB_NAME\` | Database name | $DB_NAME |
| \`DB_USERNAME\` | Database username | postgres |
| \`DB_PASSWORD\` | Database password | postgres |
| \`REDIS_HOST\` | Redis host | localhost |
| \`REDIS_PORT\` | Redis port | 6379 |
| \`EUREKA_SERVER_URL\` | Eureka server URL | http://localhost:8761/eureka/ |

## Running the Service

### Local Development
\`\`\`bash
mvn spring-boot:run
\`\`\`

### Docker
\`\`\`bash
# Build
docker build -t ecommerce/$SERVICE_NAME:latest .

# Run
docker run -p $PORT:$PORT \\
  -e DB_HOST=postgres \\
  -e REDIS_HOST=redis \\
  -e EUREKA_SERVER_URL=http://eureka-server:8761/eureka/ \\
  ecommerce/$SERVICE_NAME:latest
\`\`\`

## API Documentation
- Swagger UI: http://localhost:$PORT/swagger-ui.html
- OpenAPI JSON: http://localhost:$PORT/api-docs

## Health Check
\`\`\`bash
curl http://localhost:$PORT/actuator/health
\`\`\`

## Metrics
\`\`\`bash
curl http://localhost:$PORT/actuator/prometheus
\`\`\`
EOF

    echo "$SERVICE_NAME created successfully!"
}

# Create all remaining services
create_service "cart-service" "8082" "Shopping cart management service" "cart_db"
create_service "order-service" "8083" "Order processing and management service" "order_db"
create_service "payment-service" "8085" "Payment processing and integration service" "payment_db"
create_service "inventory-service" "8086" "Inventory and stock management service" "inventory_db"
create_service "cms-integration-service" "8087" "CMS integration service for content management" "cms_db"

echo "All service templates created successfully!"
echo "Note: You still need to add pom.xml files for each service."

# Made with Bob
