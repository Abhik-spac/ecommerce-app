# Running All Services in Parallel (Windows)

## Quick Start

### Start All Services
```bash
# Double-click or run from command prompt
start-all-services.bat
```

This will:
1. Build all services with Maven
2. Start services in separate terminal windows in the correct order
3. Wait between each service to ensure proper startup

### Stop All Services
```bash
# Double-click or run from command prompt
stop-all-services.bat
```

This will automatically find and stop all Java processes running on service ports.

## Manual Startup (If Script Fails)

### Prerequisites
Ensure PostgreSQL and Redis are running:

```bash
# Check if PostgreSQL is running
psql -h localhost -U postgres -c "SELECT version();"

# Check if Redis is running
redis-cli ping
```

If not running, start them:
```bash
# PostgreSQL (if installed locally)
# Windows: Start from Services or pgAdmin

# Redis (if installed locally)
# Windows: Start from Services or redis-server.exe
```

### Start Services Manually

Open **5 separate PowerShell/CMD windows** and run these commands:

**Window 1 - Eureka Server:**
```bash
cd eureka-server
mvn spring-boot:run
```
Wait for: `Started EurekaServerApplication` (30-60 seconds)

**Window 2 - Config Server:**
```bash
cd config-server
mvn spring-boot:run
```
Wait for: `Started ConfigServerApplication` (20-30 seconds)

**Window 3 - API Gateway:**
```bash
cd api-gateway
mvn spring-boot:run
```
Wait for: `Started ApiGatewayApplication` (15-20 seconds)

**Window 4 - Product Service:**
```bash
cd product-service
mvn spring-boot:run
```
Wait for: `Started ProductServiceApplication` (10-15 seconds)

**Window 5 - User Service:**
```bash
cd user-service
mvn spring-boot:run
```
Wait for: `Started UserServiceApplication` (10-15 seconds)

## Verification

### Check Service Health

```bash
# Eureka Dashboard
curl http://localhost:8761

# Config Server
curl http://localhost:8888/actuator/health

# API Gateway
curl http://localhost:8080/actuator/health

# Product Service
curl http://localhost:8081/actuator/health

# User Service
curl http://localhost:8084/actuator/health
```

### View Eureka Dashboard
Open browser: http://localhost:8761

You should see all services registered:
- API-GATEWAY
- CONFIG-SERVER
- PRODUCT-SERVICE
- USER-SERVICE

## Troubleshooting

### Port Already in Use Error

**Problem:** `Port XXXX was already in use`

**Solution 1 - Use stop script:**
```bash
stop-all-services.bat
```

**Solution 2 - Manual kill:**
```bash
# Find process using port
netstat -ano | findstr :8761

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Service Not Starting

**Check logs in the terminal window for errors:**

1. **Database Connection Error:**
   - Ensure PostgreSQL is running
   - Check database exists: `product_db`, `user_db`
   - Verify credentials in `application.yml`

2. **Eureka Connection Error:**
   - Ensure Eureka Server started first
   - Wait 30 seconds after Eureka starts
   - Check Eureka URL in `application.yml`

3. **Redis Connection Error:**
   - Ensure Redis is running
   - Test: `redis-cli ping` (should return PONG)

### Build Failures

```bash
# Clean and rebuild
mvn clean install -DskipTests

# If common-lib fails, build it first
cd common-lib
mvn clean install -DskipTests
cd ..
```

### Out of Memory Error

Increase Maven memory:
```bash
set MAVEN_OPTS=-Xmx2048m -XX:MaxPermSize=512m
```

## Service Startup Order (Important!)

Services must start in this order due to dependencies:

1. **Eureka Server** (8761) - Service discovery
2. **Config Server** (8888) - Configuration management
3. **API Gateway** (8080) - Routing and authentication
4. **Business Services** (8081, 8084, etc.) - Can start in parallel

## Service Ports Reference

| Service | Port | URL |
|---------|------|-----|
| Eureka Server | 8761 | http://localhost:8761 |
| Config Server | 8888 | http://localhost:8888 |
| API Gateway | 8080 | http://localhost:8080 |
| Product Service | 8081 | http://localhost:8081 |
| User Service | 8084 | http://localhost:8084 |
| Cart Service | 8082 | http://localhost:8082 |
| Order Service | 8083 | http://localhost:8083 |
| Payment Service | 8085 | http://localhost:8085 |
| Inventory Service | 8086 | http://localhost:8086 |
| CMS Integration | 8087 | http://localhost:8087 |

## Database Setup

If databases don't exist, create them:

```bash
# Connect to PostgreSQL
psql -h localhost -U postgres

# Create databases
CREATE DATABASE product_db;
CREATE DATABASE user_db;
CREATE DATABASE cart_db;
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
CREATE DATABASE inventory_db;
CREATE DATABASE cms_db;

# Exit
\q
```

## Tips for Development

### Hot Reload
Add Spring Boot DevTools to `pom.xml` for automatic restart on code changes:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

### View Logs
Each service logs to its terminal window. To save logs:
```bash
mvn spring-boot:run > service.log 2>&1
```

### Debug Mode
Start service in debug mode:
```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

## Common Issues and Solutions

### Issue: Services start but don't register with Eureka

**Solution:**
1. Check Eureka is running: http://localhost:8761
2. Verify `eureka.client.service-url.defaultZone` in `application.yml`
3. Wait 30-60 seconds for registration
4. Check service logs for connection errors

### Issue: API Gateway returns 503 Service Unavailable

**Solution:**
1. Check target service is running and registered in Eureka
2. Verify route configuration in API Gateway
3. Check service health: `curl http://localhost:8081/actuator/health`

### Issue: Database connection timeout

**Solution:**
1. Verify PostgreSQL is running
2. Check connection settings in `application.yml`
3. Test connection: `psql -h localhost -U postgres -d product_db`
4. Ensure database exists

## Next Steps

After all services are running:

1. **Test APIs through Gateway:**
   ```bash
   curl http://localhost:8080/api/products
   curl http://localhost:8080/api/users
   ```

2. **View API Documentation:**
   - Product Service: http://localhost:8081/swagger-ui.html
   - User Service: http://localhost:8084/swagger-ui.html

3. **Monitor Services:**
   - Eureka Dashboard: http://localhost:8761
   - Service Health: http://localhost:8081/actuator/health

4. **Develop Features:**
   - Make code changes
   - Service auto-restarts (with DevTools)
   - Test through API Gateway