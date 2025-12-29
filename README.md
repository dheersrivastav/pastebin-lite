# Pastebin-Lite

A simple pastebin-like application where users can create text pastes and share them via links. Pastes can optionally expire based on time-to-live (TTL) or view count limits.

## Project Description

Pastebin-Lite is a web application built with Next.js that allows users to:
- Create text pastes with optional constraints (TTL and/or view limits)
- Share pastes via unique URLs
- View pastes via both API and HTML endpoints
- Automatically expire pastes when constraints are met

## How to Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Set environment variables:**
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL="file:./dev.db"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## Persistence Layer

This application uses **Prisma ORM with SQLite** for persistence. The database schema includes a `Paste` table with the following fields:
- `id`: Unique identifier (UUID)
- `content`: The paste content (text)
- `createdAt`: Timestamp of creation
- `expiresAt`: Optional expiration timestamp
- `maxViews`: Optional maximum view count
- `viewCount`: Current view count (defaults to 0)

For production deployment on Vercel, you can use:
- **Vercel Postgres** (recommended for production)
- **PlanetScale** (MySQL-compatible)
- **Supabase** (PostgreSQL)

To use a different database, update the `DATABASE_URL` in your environment variables and change the `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql` or `mysql`.

## Design Decisions

1. **Atomic View Count Updates**: View counts are incremented atomically using Prisma's `increment` operation to prevent race conditions under concurrent load.

2. **Deterministic Time Testing**: The application supports `TEST_MODE=1` environment variable and `x-test-now-ms` header for deterministic expiry testing, allowing automated tests to control time.

3. **Serverless-Safe**: No global mutable state is used. All state is persisted in the database, making it compatible with serverless environments like Vercel.

4. **Simple Validation**: Input validation is done at the API route level with clear error messages for invalid inputs.

5. **Safe HTML Rendering**: Paste content is rendered using React's built-in escaping, preventing XSS attacks.

6. **Combined Constraints**: When both TTL and max_views are set, the paste expires when the first constraint triggers, as specified in the requirements.

## API Endpoints

- `GET /api/healthz` - Health check endpoint
- `POST /api/pastes` - Create a new paste
- `GET /api/pastes/:id` - Fetch a paste (API)
- `GET /p/:id` - View a paste (HTML)

## Deployment

The application is ready for deployment on Vercel. The build process automatically:
1. Generates Prisma client
2. Runs database migrations
3. Builds the Next.js application

Ensure your `DATABASE_URL` environment variable is set in your Vercel project settings.

