# Deployment Guide (Vercel + Postgres)

Your application is now a Full-Stack Next.js app using Prisma for database management.

## 1. Prerequisites
- A [Vercel Account](https://vercel.com)
- A GitHub Repository for this project

## 2. Setup Database (Vercel Postgres)
1. Go to your Vercel Dashboard.
2. Navigate to "Storage" and create a new **Postgres** database.
3. Accept the default settings.
4. Copy the environment variables snippet (it looks like `.env.local` with `POSTGRES_PRISMA_URL` etc.).

## 3. Deploy Project
1. Import your GitHub repository to Vercel.
2. In the "Configure Project" step, go to **Environment Variables**.
3. Paste the Postgres variables you copied earlier.
4. **Crucial**: Add one more variable to make Prisma work with Vercel Postgres:
   - Key: `POSTGRES_URL_NON_POOLING`
   - Value: (Same as `POSTGRES_URL` but ensure it ends with `?sslmode=require` or similar if provided, usually the "Direct Connection" string)
   - *Note: Vercel's default snippet usually handles this, just ensure `POSTGRES_PRISMA_URL` is set.*

## 4. Update Schema for Production
Before deploying, you must ensure `prisma/schema.prisma` is using `postgresql`.
I have set it to `sqlite` for local dev. **For Vercel, you should change it manually or use an env var.**

**Recommended approach:**
Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma` before pushing to GitHub.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

## 5. Build & Migrate
Vercel will build your app. To ensure the database structure is created:
1. Go to Vercel project "Settings" -> "General".
2. Override the "Build Command" if needed, OR better:
3. Add a `postinstall` script in `package.json`:
   ```json
   "scripts": {
     "postinstall": "prisma generate"
   }
   ```
   *(I have already ensured `prisma generate` runs).*

4. You might need to run migrations manually or add a build command that includes `prisma db push`.
   - Easiest way for first deploy: Connect to Vercel CLI locally and run `npx prisma db push`.

## 6. Access
Once deployed, your app will be live at `https://your-project.vercel.app`.
