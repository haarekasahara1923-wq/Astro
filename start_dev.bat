@echo off
start cmd /k "cd apps/backend && npm run start:dev"
start cmd /k "cd apps/frontend && npm run dev"
echo Servers are starting...
echo Frontend: http://localhost:3001 (or 3000)
echo Backend: http://localhost:3000
