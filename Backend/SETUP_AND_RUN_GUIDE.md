# Setup and Run Guide

## Prerequisites Installation

### 1. Install Java 21
Download and install Java 21 from:
- **Oracle JDK**: https://www.oracle.com/java/technologies/downloads/#java21
- **OpenJDK**: https://adoptium.net/temurin/releases/?version=21

Verify installation:
```bash
java -version
```

### 2. Install Maven
Download Maven from: https://maven.apache.org/download.cgi

**Windows:**
1. Download `apache-maven-3.9.x-bin.zip`
2. Extract to `C:\Program Files\Apache\maven`
3. Add to PATH:
   - System Properties → Environment Variables
   - Add `C:\Program Files\Apache\maven\bin` to PATH
4. Verify: `mvn -version`

**Alternative: Use Maven Wrapper (Included)**
```bash
# Windows
.\mvnw.cmd clean install

# Linux/Mac
./mvnw clean install
```

### 3. Install Docker Desktop
Download from: https://www.docker.com/products/docker-desktop

## Running the Application

### Option 1: Using Docker Compose (Recommended)

This will start all services including databases:

```bash
# Navigate to docker-compose directory
cd docker-compose

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Services will be available at:**
- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8080
- Config Server: http://localhost:8888
- Product Service: http://localhost:8081
- User Service: http://localhost:8084

### Option 2: Running Services Individually

#### Step 1: Start Infrastructure Services

**Start PostgreSQL:**
```bash
docker run -d --name postgres ^
  -e POSTGRES_USER=postgres ^
  -e POSTGRES_PASSWORD=postgres ^
  -p 5432:5432 ^
  postgres:15-alpine
```

**Start Redis:**
```bash
docker run -d --name redis ^
  -p 6379:6379 ^
  redis:7-alpine
```

**Create Databases:**
```bash
docker exec -it postgres psql -U postgres -c "CREATE DATABASE product_db;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE user_db;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE cart_db;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE order_db;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE payment_db;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE inventory_db;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE cms_db;"
```

#### Step 2: Build the Project

```bash
# Build all modules (from root directory)
mvn clean install -DskipTests

# Or build individual modules
cd common-lib
mvn clean install -DskipTests
cd ..

cd eureka-server
mvn clean install -DskipTests
cd ..
```

#### Step 3: Start Services in Order

**Terminal 1 - Eureka Server:**
```bash
cd eureka-server
mvn spring-boot:run
```
Wait for: "Started EurekaServerApplication"

**Terminal 2 - Config Server:**
```bash
cd config-server
mvn spring-boot:run
```
Wait for: "Started ConfigServerApplication"

**Terminal 3 - API Gateway:**
```bash
cd api-gateway
mvn spring-boot:run
```
Wait for: "Started ApiGatewayApplication"

**Terminal 4 - Product Service:**
```bash
cd product-service
mvn spring-boot:run
```

**Terminal 5 - User Service:**
```bash
cd user-service
mvn spring-boot:run
```

### Option 3: Using IDE (IntelliJ IDEA / Eclipse)

1. **Import Project:**
   - File → Open → Select root `pom.xml`
   - Wait for Maven to download dependencies

2. **Run Services:**
   - Right-click on each `*Application.java` file
   - Select "Run" or "Debug"
   - Start in order: Eureka → Config → Gateway → Business Services

## Verification

### Check Service Health

```bash
# Eureka Server
curl http://localhost:8761/actuator/health

# API Gateway
curl http://localhost:8080/actuator/health

# Product Service
curl http://localhost:8081/actuator/health
```

### View Eureka Dashboard
Open browser: http://localhost:8761

You should see all registered services.

### Test API Gateway
```bash
# Get products (through gateway)
curl http://localhost:8080/api/products
```

## Troubleshooting

### Maven Not Found
**Solution:** Install Maven or use Maven Wrapper:
```bash
# Windows
.\mvnw.cmd clean install

# Linux/Mac
./mvnw clean install
```

### Port Already in Use
**Solution:** Check and kill process:
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### Database Connection Failed
**Solution:** Verify PostgreSQL is running:
```bash
docker ps | grep postgres
docker logs postgres
```

### Service Not Registering with Eureka
**Solution:**
1. Ensure Eureka Server is running
2. Check application.yml configuration
3. Verify network connectivity
4. Check service logs for errors

### Out of Memory Error
**Solution:** Increase Maven memory:
```bash
# Windows
set MAVEN_OPTS=-Xmx1024m

# Linux/Mac
export MAVEN_OPTS="-Xmx1024m"
```

## Development Workflow

### 1. Make Code Changes
Edit your service code in `src/main/java`

### 2. Rebuild Module
```bash
cd <service-name>
mvn clean install -DskipTests
```

### 3. Restart Service
- Stop the running service (Ctrl+C)
- Start again: `mvn spring-boot:run`

### 4. Hot Reload (Optional)
Add Spring Boot DevTools to pom.xml:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

## Monitoring

### View Logs
```bash
# Docker Compose
docker-compose logs -f <service-name>

# Individual service logs are in:
logs/<service-name>.log
```

### Prometheus Metrics
```bash
curl http://localhost:8081/actuator/prometheus
```

### Health Checks
```bash
curl http://localhost:8081/actuator/health
```

## Stopping Services

### Docker Compose
```bash
cd docker-compose
docker-compose down

# Remove volumes too
docker-compose down -v
```

### Individual Services
- Press `Ctrl+C` in each terminal
- Or kill Java processes

### Stop Docker Containers
```bash
docker stop postgres redis
docker rm postgres redis
```

## Next Steps

1. **Complete Remaining Services:**
   - Use templates in `SERVICE_TEMPLATES.md`
   - Implement business logic
   - Add tests

2. **Add Features:**
   - Implement REST controllers
   - Add service layer
   - Create repositories
   - Write unit tests

3. **Configure Production:**
   - Update passwords and secrets
   - Configure HTTPS
   - Set up monitoring
   - Configure backups

## Quick Reference

### Service Ports
- API Gateway: 8080
- Product Service: 8081
- Cart Service: 8082
- Order Service: 8083
- User Service: 8084
- Payment Service: 8085
- Inventory Service: 8086
- CMS Integration: 8087
- Config Server: 8888
- Eureka Server: 8761

### Database Ports
- PostgreSQL: 5432
- Redis: 6379

### Default Credentials
- PostgreSQL: postgres/postgres
- Eureka: eureka-admin/change-this-password
- Config Server: config-admin/change-this-password

## Support

For issues:
1. Check service logs
2. Verify all dependencies are running
3. Review configuration files
4. Check network connectivity
5. Consult service-specific README files