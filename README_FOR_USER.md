# Jyotish - Astrotalk Clone

## 🚀 Easy Setup for Local Testing

1. **Double-click** the `setup_and_run.bat` file in this folder.
2. Once the windows open:
   - **Frontend**: http://localhost:3000
   - **Backend**: http://localhost:3000

## 🌐 Deploying to GitHub & Vercel

### 1. Push to GitHub
I have created a helper script for you.
1. Create a new repository on GitHub.
2. Copy the Repository URL (it looks like `https://github.com/username/jyotish.git`).
3. Double-click the `push_to_github.bat` file in this folder.
4. Paste your URL when asked and press Enter.

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
   - `DATABASE_URL`: Your Neon **Pooled** Connection String (starts with `postgres://...` and is found in Neon Dashboard).
   - `DIRECT_URL`: Your Neon **Unpooled** Connection String (needed for migrations).
   - `JWT_SECRET`: Any secret password.
4. **IMPORTANT**: Neon might give you two URLs. Use the one with `?sslmode=require`.

**Note:** The backend is configured to use Prisma to talk to Neon. Prisma is the "bridge" and Neon is the "storage".
