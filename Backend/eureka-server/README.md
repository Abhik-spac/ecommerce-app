# Eureka Server

## Overview
Netflix Eureka-based service discovery and registration server for microservices architecture.

## Port
**8761**

## Features
- **Service Discovery**: Automatic service registration and discovery
- **Health Monitoring**: Continuous health checks of registered services
- **Load Balancing**: Client-side load balancing support
- **Self-Preservation**: Protects against network partition issues
- **Dashboard**: Web-based UI for monitoring registered services
- **High Availability**: Support for peer-to-peer replication

## Dashboard Access
```
http://localhost:8761
```

Login credentials (if security is enabled):
- Username: `eureka-admin`
- Password: `change-this-password`

## Running the Service

### Local Development
```bash
mvn spring-boot:run
```

### Docker
```bash
# Build
docker build -t ecommerce/eureka-server:latest .

# Run
docker run -p 8761:8761 \
  -e EUREKA_USERNAME=admin \
  -e EUREKA_PASSWORD=secret \
  ecommerce/eureka-server:latest
```

## Client Configuration

Services should include this in their `application.yml`:

```yaml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true
    lease-renewal-interval-in-seconds: 30
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EUREKA_USERNAME` | Dashboard username | eureka-admin |
| `EUREKA_PASSWORD` | Dashboard password | change-this-password |
| `EUREKA_HOSTNAME` | Server hostname | localhost |

## High Availability Setup

### Peer-to-Peer Configuration

**Eureka Server 1** (application-peer1.yml):
```yaml
server:
  port: 8761

eureka:
  instance:
    hostname: eureka-server-1
  client:
    service-url:
      defaultZone: http://eureka-server-2:8762/eureka/
```

**Eureka Server 2** (application-peer2.yml):
```yaml
server:
  port: 8762

eureka:
  instance:
    hostname: eureka-server-2
  client:
    service-url:
      defaultZone: http://eureka-server-1:8761/eureka/
```

## Self-Preservation Mode

Eureka enters self-preservation mode when:
- More than 15% of services fail to renew their leases
- Network issues cause heartbeat failures

**Configuration:**
```yaml
eureka:
  server:
    enable-self-preservation: true
    renewal-percent-threshold: 0.85
```

## Service Registration

Services automatically register with Eureka when they start:

1. Service starts and sends registration request
2. Eureka server stores service metadata
3. Service sends heartbeats every 30 seconds
4. If heartbeats stop, service is removed after 90 seconds

## Health Check
```bash
curl http://localhost:8761/actuator/health
```

## Metrics
Prometheus metrics available at:
```
http://localhost:8761/actuator/prometheus
```

## REST API Endpoints

### Get All Registered Services
```bash
GET http://localhost:8761/eureka/apps
```

### Get Specific Service
```bash
GET http://localhost:8761/eureka/apps/{SERVICE-NAME}
```

### Service Instance Details
```bash
GET http://localhost:8761/eureka/apps/{SERVICE-NAME}/{INSTANCE-ID}
```

## Monitoring

### Dashboard Information
- **Registered Services**: List of all registered microservices
- **Instance Status**: UP, DOWN, STARTING, OUT_OF_SERVICE
- **Lease Information**: Last heartbeat time
- **Metadata**: Service-specific information

### Key Metrics to Monitor
- Number of registered instances
- Renewal rate
- Self-preservation mode status
- Memory and CPU usage

## Troubleshooting

### Service Not Appearing in Dashboard
1. Check service configuration
2. Verify network connectivity
3. Check Eureka server logs
4. Ensure service is sending heartbeats

### Self-Preservation Mode Activated
- Check network stability
- Verify service health
- Review renewal threshold settings
- May be normal during deployment

### Service Shows as DOWN
- Check service health endpoint
- Verify heartbeat configuration
- Review service logs
- Check network connectivity

## Best Practices

1. **High Availability**: Run multiple Eureka servers in production
2. **Security**: Enable authentication for production
3. **Monitoring**: Set up alerts for service registration/deregistration
4. **Network**: Ensure stable network connectivity
5. **Timeouts**: Configure appropriate timeout values
6. **Logging**: Enable detailed logging for troubleshooting

## Configuration Options

### Lease Configuration
```yaml
eureka:
  instance:
    lease-renewal-interval-in-seconds: 30  # Heartbeat interval
    lease-expiration-duration-in-seconds: 90  # Time before removal
```

### Response Cache
```yaml
eureka:
  server:
    response-cache-update-interval-ms: 30000
    response-cache-auto-expiration-in-seconds: 180
```

### Eviction
```yaml
eureka:
  server:
    eviction-interval-timer-in-ms: 60000
```

## Dependencies
- Spring Cloud Netflix Eureka Server
- Spring Boot Actuator
- Spring Security (optional)

## Security Considerations
- Enable authentication in production
- Use HTTPS for communication
- Implement network-level security
- Regular security updates
- Monitor access logs

## Performance Tuning

### For Large Deployments
```yaml
eureka:
  server:
    max-threads-for-peer-replication: 20
    max-elements-in-peer-replication-pool: 10000
    max-time-for-replication: 30000
```

### Cache Settings
```yaml
eureka:
  server:
    use-read-only-response-cache: true
    response-cache-update-interval-ms: 30000