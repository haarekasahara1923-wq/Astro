@echo off
set /p repo_url="Paste your GitHub Repository URL here: "
git remote add origin %repo_url%
git branch -M main
git push -u origin main
pause
