@echo off
echo ===================================================
echo   Jyotish App - First Time Setup (Non-Coder Friendly)
echo ===================================================
echo.
echo Step 1: Installing dependencies for the main project...
call npm install
if %errorlevel% neq 0 (
    echo Error installing main dependencies.
    pause
    exit /b
)

echo.
echo Step 2: Installing dependencies for Backend...
cd apps\backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies.
    pause
    exit /b
)
cd ..\..

echo.
echo Step 3: Installing dependencies for Frontend...
cd apps\frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies.
    pause
    exit /b
)
cd ..\..

echo.
echo Step 4: Setting up the Database (SQLite)...
call npx prisma generate
call npx prisma migrate dev --name init_auto_setup

echo.
echo ===================================================
echo   Setup Complete! 
echo ===================================================
echo.
echo Launching the application now...
echo.
start_dev.bat
