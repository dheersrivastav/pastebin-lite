# Deployment Guide

## Step 1: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it: `pastebin-lite`
   - Don't initialize with README
   - Click "Create repository"

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pastebin-lite.git
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your GitHub username)

## Step 2: Deploy to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign up/Login with GitHub

2. **Import your repository:**
   - Click "Add New Project"
   - Select your `pastebin-lite` repository
   - Click "Import"

3. **Set up Environment Variables:**
   - In Vercel project settings, go to "Environment Variables"
   - Add: `DATABASE_URL` (we'll get this from Vercel Postgres)

4. **Add Vercel Postgres:**
   - In your Vercel project, go to "Storage" tab
   - Click "Create Database" → Select "Postgres"
   - Choose free tier
   - Copy the `POSTGRES_PRISMA_URL` or `POSTGRES_URL_NON_POOLING`
   - Add it as `DATABASE_URL` environment variable

5. **Update Prisma Schema for PostgreSQL:**
   - Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
   - Commit and push the change
   - Vercel will automatically rebuild

6. **Deploy:**
   - Vercel will automatically deploy
   - You'll get a URL like: `https://pastebin-lite.vercel.app`

## Step 3: Test Your Deployment

1. Visit your Vercel URL
2. Create a paste
3. Share the link - it should work!

## Notes

- Local development still uses SQLite (for faster testing)
- Production uses PostgreSQL (via Vercel)
- The app automatically detects the environment

