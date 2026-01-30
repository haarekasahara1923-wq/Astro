@echo off
echo --- Starting GitHub Push ---

:: Change to the current directory
cd /d "%~dp0"

:: Check if origin exists, if not add it
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo Adding remote origin...
    git remote add origin https://github.com/haarekasahara1923-wq/Astro.git
)

:: Add all changes
echo Adding files...
git add .

:: Commit changes
echo Committing changes...
git commit -m "Integrated Razorpay, PayPal and Subscription Plans"

:: Push to main branch
echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo --- Done! You can close this window ---
pause
