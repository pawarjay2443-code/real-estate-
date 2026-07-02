@echo off
title Real Estate Backend Manager

echo ===================================================
echo   Real Estate Backend Service Runner
echo ===================================================
echo.

:: Check for .env file
if not exist .env (
    echo [INFO] .env file not found. Copying from .env.example...
    copy .env.example .env
    echo [SUCCESS] Created .env file. Please customize your keys if needed.
) else (
    echo [INFO] .env file already exists.
)
echo.

:: Ask user for run option
echo How would you like to run the backend?
echo [1] Run inside Docker (Postgres + Redis + API auto-configured)
echo [2] Run locally (requires local Postgres and Redis running)
echo.
set /p opt="Select option [1 or 2]: "

if "%opt%"=="1" (
    echo.
    echo [INFO] Starting services using Docker Compose...
    docker-compose up --build
    goto end
)

if "%opt%"=="2" (
    echo.
    echo [INFO] Installing NPM dependencies...
    call npm install
    
    echo.
    echo [INFO] Running database migrations...
    call npx prisma migrate dev --schema=src/prisma/schema.prisma
    
    echo.
    echo [INFO] Generating Prisma Client...
    call npx prisma generate --schema=src/prisma/schema.prisma
    
    echo.
    echo [INFO] Starting Express API in development mode...
    call npm run server:dev
    goto end
)

echo [ERROR] Invalid selection. Exiting.
:end
pause
