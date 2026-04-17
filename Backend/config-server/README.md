# Config Server

## Overview
Centralized configuration management server for all microservices using Spring Cloud Config.

## Port
**8888**

## Features
- **Centralized Configuration**: Single source of truth for all service configurations
- **Environment-Specific Configs**: Support for dev, staging, and production profiles
- **Git Integration**: Store configurations in Git repository (optional)
- **Native File System**: Store configurations locally (default)
- **Dynamic Refresh**: Update configurations without service restart
- **Security**: Basic authentication for config access
- **Encryption**: Support for encrypted properties

## Configuration Sources

### Native File System (Default)
Configurations stored in:
- `classpath:/config`
- `file:./config`

### Git Repository
Configure Git URI in application.yml:
```yaml
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/your-org/config-repo
          default-label: main
```

## Configuration Structure

### File Naming Convention
```
config/
├── application.yml              # Common properties for all services
├── application-dev.yml          # Development environment
├── application-staging.yml      # Staging environment
├── application-prod.yml         # Production environment
├── product-service.yml          # Product service specific
├── product-service-dev.yml      # Product service dev config
├── user-service.yml             # User service specific
└── ...
```

### Example Configuration Files

**application.yml** (Common)
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics

logging:
  level:
    root: INFO
```

**product-service.yml**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/product_db
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
```

## Running the Service

### Local Development
```bash
mvn spring-boot:run
```

### Docker
```bash
# Build
docker build -t ecommerce/config-server:latest .

# Run
docker run -p 8888:8888 \
  -e CONFIG_SERVER_USERNAME=admin \
  -e CONFIG_SERVER_PASSWORD=secret \
  ecommerce/config-server:latest
```

## Accessing Configurations

### Endpoints
```bash
# Get configuration for a service
GET http://localhost:8888/{service-name}/{profile}

# Examples:
GET http://localhost:8888/product-service/dev
GET http://localhost:8888/user-service/prod
GET http://localhost:8888/application/default
```

### Authentication
```bash
curl -u config-admin:change-this-password \
  http://localhost:8888/product-service/dev
```

## Client Configuration

Services should include this in their `bootstrap.yml`:

```yaml
spring:
  cloud:
    config:
      uri: http://localhost:8888
      username: config-admin
      password: change-this-password
      fail-fast: true
      retry:
        max-attempts: 6
        initial-interval: 1000
```

## Refreshing Configuration

### Manual Refresh
```bash
# Trigger refresh on a specific service
POST http://service-url/actuator/refresh
```

### Using Spring Cloud Bus (Advanced)
Broadcast configuration changes to all services:
```bash
POST http://localhost:8888/actuator/bus-refresh
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CONFIG_SERVER_USERNAME` | Basic auth username | config-admin |
| `CONFIG_SERVER_PASSWORD` | Basic auth password | change-this-password |
| `CONFIG_GIT_URI` | Git repository URI | - |
| `EUREKA_SERVER_URL` | Eureka server URL | http://localhost:8761/eureka/ |

## Encryption

### Encrypt a Property
```bash
curl -u config-admin:password \
  -d "mysecret" \
  http://localhost:8888/encrypt
```

### Decrypt a Property
```bash
curl -u config-admin:password \
  -d "{cipher}encrypted-value" \
  http://localhost:8888/decrypt
```

### Use in Configuration
```yaml
spring:
  datasource:
    password: '{cipher}AQA...'
```

## Health Check
```bash
curl http://localhost:8888/actuator/health
```

## Best Practices

1. **Use Git for Production**: Store production configs in a private Git repository
2. **Encrypt Sensitive Data**: Always encrypt passwords, API keys, and secrets
3. **Environment Variables**: Use environment variables for deployment-specific values
4. **Version Control**: Track configuration changes in Git
5. **Access Control**: Secure the config server with strong authentication
6. **Backup**: Regularly backup configuration files
7. **Documentation**: Document all configuration properties

## Troubleshooting

### Service Cannot Connect
- Verify config server is running
- Check network connectivity
- Verify credentials
- Check service bootstrap.yml configuration

### Configuration Not Updating
- Ensure `/actuator/refresh` endpoint is enabled
- Trigger manual refresh
- Check for configuration errors
- Verify file changes are committed (if using Git)

### Git Authentication Issues
- Use SSH keys or personal access tokens
- Configure Git credentials in application.yml
- Check repository permissions

## Dependencies
- Spring Cloud Config Server
- Spring Cloud Netflix Eureka Client
- Spring Boot Actuator
- Spring Security

## Security Considerations
- Change default username/password
- Use HTTPS in production
- Implement proper access controls
- Encrypt sensitive properties
- Regular security audits