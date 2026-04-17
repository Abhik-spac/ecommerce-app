@echo off
echo ========================================
echo Stopping All E-Commerce Services
echo ========================================
echo.

echo Searching for Java processes on service ports...
echo.

REM Find and kill processes on each port
for %%p in (8761 8888 8080 8081 8084 8082 8083 8085 8086 8087) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p ^| findstr LISTENING') do (
        echo Stopping service on port %%p (PID: %%a)
        taskkill /PID %%a /F >nul 2>nul
    )
)

echo.
echo ========================================
echo All services stopped
echo ========================================
echo.
pause

@REM Made with Bob
