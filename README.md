# AstroTalk Clone

## Project Structure
- `apps/frontend`: Next.js 14 Web Application
- `apps/backend`: NestJS Backend API
- `prisma`: Database Schema and Migrations

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   cd apps/frontend && npm install
   cd ../backend && npm install
   ```

2. **Database Setup**
   - Ensure PostgreSQL is running
   - Update `.env` with your DATABASE_URL
   - Run migrations:
     ```bash
     npx prisma migrate dev
     ```

3. **Running the App**
   - Backend:
     ```bash
     cd apps/backend
     npm run start:dev
     ```
   - Frontend:
     ```bash
     cd apps/frontend
     npm run dev
     ```

## Features
- Audio/Video Calling (Agora)
- Real-time Chat (Socket.io)
- Wallet System (Razorpay)
- User, Astrologer, Admin Roles
