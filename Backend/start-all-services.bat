@echo off
echo ========================================
echo Starting E-Commerce Microservices
echo ========================================
echo.

REM Check if Maven is available
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Maven not found in PATH
    echo Please install Maven or use Maven Wrapper (mvnw.cmd)
    pause
    exit /b 1
)

echo Building common library and all services...
echo.
echo [Build 1/6] Building common-lib...
cd common-lib
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: common-lib build failed
    pause
    exit /b 1
)
cd ..

echo [Build 2/6] Building eureka-server...
cd eureka-server
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: eureka-server build failed
    pause
    exit /b 1
)
cd ..

echo [Build 3/6] Building config-server...
cd config-server
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: config-server build failed
    pause
    exit /b 1
)
cd ..

echo [Build 4/6] Building api-gateway...
cd api-gateway
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: api-gateway build failed
    pause
    exit /b 1
)
cd ..

echo [Build 5/6] Building product-service...
cd product-service
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: product-service build failed
    pause
    exit /b 1
)
cd ..

echo [Build 6/6] Building user-service...
cd user-service
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: user-service build failed
    pause
    exit /b 1
)
cd ..

echo.
echo Starting services in order...
echo.

REM Start Eureka Server (must start first)
echo [1/5] Starting Eureka Server on port 8761...
start "Eureka Server" cmd /k "cd eureka-server && mvn spring-boot:run"
timeout /t 30 /nobreak >nul

REM Start Config Server
echo [2/5] Starting Config Server on port 8888...
start "Config Server" cmd /k "cd config-server && mvn spring-boot:run"
timeout /t 20 /nobreak >nul

REM Start API Gateway
echo [3/5] Starting API Gateway on port 8080...
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"
timeout /t 15 /nobreak >nul

REM Start Product Service
echo [4/5] Starting Product Service on port 8081...
start "Product Service" cmd /k "cd product-service && mvn spring-boot:run"
timeout /t 10 /nobreak >nul

REM Start User Service
echo [5/5] Starting User Service on port 8084...
start "User Service" cmd /k "cd user-service && mvn spring-boot:run"

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo.
echo Services will be available at:
echo - Eureka Dashboard: http://localhost:8761
echo - Config Server: http://localhost:8888
echo - API Gateway: http://localhost:8080
echo - Product Service: http://localhost:8081
echo - User Service: http://localhost:8084
echo.
echo Wait 2-3 minutes for all services to fully start.
echo Check each terminal window for startup status.
echo.
echo To stop all services: Close all terminal windows or use stop-all-services.bat
echo.
pause

@REM Made with Bob
