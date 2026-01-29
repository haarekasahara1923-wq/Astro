# Jyotish - Astrotalk Clone

## 🚀 Easy Setup for Local Testing

1. **Double-click** the `setup_and_run.bat` file in this folder.
2. Once the windows open:
   - **Frontend**: http://localhost:3000
   - **Backend**: http://localhost:3000

## 🌐 Deploying to GitHub & Vercel

### 1. Push to GitHub
Run these commands in terminal:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy Frontend to Vercel
1. Go to [Vercel.com](https://vercel.com) -> New Project.
2. Import `jyotish`.
3. **Root Directory**: `apps/frontend`.
4. **Env Variables**: 
   - `NEXT_PUBLIC_API_URL`: Your Backend URL (e.g., `https://jyotish-backend.vercel.app`).

### 3. Deploy Backend to Vercel
1. **New Project** -> Import `jyotish` again.
2. **Root Directory**: `apps/backend`.
3. **Env Variables**:
   - `DATABASE_URL`: Your production Postgres URL (from Neon.tech or similar).
   - `JWT_SECRET`: Any secret password.
4. **IMPORTANT**: If you get a 404, check:
   - Did you set Root Directory to `apps/backend`?
   - Did you add the Environment Variables?

**Note:** The backend is configured to run as a serverless function. It might take a moment to wake up on first request.
