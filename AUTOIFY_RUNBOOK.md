# 🚀 Autoify Platform — Complete Runbook

> **Date created:** 2026-03-19  
> **Stack:** Next.js 16 · NestJS 11 · PostgreSQL · Redis · Prisma · BullMQ · OpenAI  
> **Monorepo tool:** Turborepo + pnpm workspaces

---

## 📋 Table of Contents

1. [Project Structure](#1-project-structure)
2. [Tech Stack Summary](#2-tech-stack-summary)
3. [First-Time Setup (Clean Install)](#3-first-time-setup-clean-install)
4. [Daily Startup Procedure](#4-daily-startup-procedure)
5. [Running Each App Individually](#5-running-each-app-individually)
6. [Swagger API Testing Guide](#6-swagger-api-testing-guide)
7. [Known Issues & Fixes](#7-known-issues--fixes)
8. [Environment Variables Reference](#8-environment-variables-reference)
9. [Future Changes Guide](#9-future-changes-guide)

---

## 1. Project Structure

```
automation-platform/               ← Monorepo root
├── apps/
│   ├── web/                       ← Next.js 16 frontend (port 3000)
│   │   └── src/app/               ← App Router pages & layouts
│   └── api/                       ← NestJS 11 backend (port 4000)
│       └── src/
│           ├── auth/              ← JWT + Google OAuth
│           ├── user/              ← User service
│           ├── tenant/            ← Multi-tenant management
│           ├── workflow/          ← Workflow CRUD & execution
│           ├── execution/         ← Execution logs & monitoring
│           ├── integration/       ← Connected apps (Slack, Gmail...)
│           ├── webhook/           ← Inbound webhook processing
│           ├── ai/                ← OpenAI AI nodes
│           ├── queue/             ← BullMQ Redis job queues
│           ├── prisma/            ← Prisma DB service
│           └── main.ts            ← App bootstrap + Swagger setup
├── .env                           ← Environment variables (DO NOT COMMIT)
├── .env.example                   ← Template for env vars
├── docker-compose.yml             ← PostgreSQL (port 5433) + Redis (port 6379)
├── turbo.json                     ← Turborepo task config
├── pnpm-workspace.yaml            ← pnpm monorepo workspace config
└── package.json                   ← Root scripts
```

---

## 2. Tech Stack Summary

| Layer | Technology | Port |
|-------|-----------|------|
| Frontend | Next.js 16 (App Router, React 19) | 3000 |
| Backend | NestJS 11 | 4000 |
| Database | PostgreSQL 16 (via Docker) | 5433 |
| Cache/Queue | Redis 7 (via Docker) | 6379 |
| ORM | Prisma 6 | — |
| Job Queue | BullMQ | — |
| AI | OpenAI API | — |
| API Docs | Swagger UI | 4000/api/docs |
| Styling | Tailwind CSS 4 + Framer Motion | — |
| State | Zustand + React Query | — |
| Workflow Editor | React Flow | — |

---

## 3. First-Time Setup (Clean Install)

> ⚠️ **Run these steps in your own macOS Terminal (not through an IDE agent) to ensure full user permissions.**

### Step 1 — Prerequisites
```bash
node --version   # Must be v20+
pnpm --version   # Must be v9+
docker --version # Must be installed
```

If pnpm is not installed:
```bash
npm install -g pnpm
```

### Step 2 — Clone & Enter Project
```bash
git clone https://github.com/your-username/automation-platform.git
cd automation-platform
```

### Step 3 — Set Up Environment Variables
```bash
cp .env.example .env
```
Then open [.env](file:///Users/mustakimshaikh/Downloads/automation-platform/.env) and fill in at minimum:
- `DATABASE_URL` (already pre-filled for Docker: `postgresql://autoify:autoify_pass@localhost:5433/autoify_db`)
- `REDIS_URL` (already pre-filled: `redis://localhost:6379`)
- `JWT_SECRET` (change to any long random string)
- `OPENAI_API_KEY` (your OpenAI key)

### Step 4 — Start Docker (Postgres + Redis)
```bash
docker-compose up -d
```
Verify containers are running:
```bash
docker ps
# Should show: autoify_postgres and autoify_redis
```

### Step 5 — Clean Install Dependencies

> ⚠️ **Important:** If you ever see `EPERM: operation not permitted` errors on `node_modules`, do a full clean reinstall:

```bash
rm -rf node_modules apps/api/node_modules apps/web/node_modules
pnpm install
```

### Step 6 — Set Up Database

```bash
# Push schema and generate Prisma client
pnpm --filter api exec prisma db push
pnpm --filter api exec prisma generate
```

### Step 7 — Start Development Servers
```bash
pnpm dev
```

---

## 4. Daily Startup Procedure

Every time you open the project after it was previously set up:

```bash
# Terminal 1 — Start Docker services
cd /Users/mustakimshaikh/Downloads/automation-platform
docker start autoify_postgres autoify_redis

# Terminal 2 — Start all dev servers
cd /Users/mustakimshaikh/Downloads/automation-platform
pnpm dev
```

Wait for these two lines to appear:
- `▲ Next.js 16 — Local: http://localhost:3000` (Web is ready)
- `🚀 Autoify API running on http://localhost:4000` (API is ready)

---

## 5. Running Each App Individually

If you only need one app running:

```bash
# Frontend only
pnpm --filter web dev
# OR from root:
pnpm web

# Backend only
pnpm --filter api dev
# OR from root:
pnpm api
```

---

## 6. Swagger API Testing Guide

> Swagger is only available in `development` mode (disabled in production).

### Access the Swagger UI
👉 Open: **http://localhost:4000/api/docs**

### Step-by-Step Testing Flow

#### Step 1 — Register a user
- Expand the `auth` tag → `POST /api/v1/auth/register`
- Click **Try it out**
- Fill in the body:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Password123!"
}
```
- Click **Execute** → should return `201 Created` with a JWT token.

#### Step 2 — Login & get your JWT
- Expand `POST /api/v1/auth/login`
- Click **Try it out**, enter email + password
- Copy the `accessToken` from the response.

#### Step 3 — Authorize all requests
- Click the green **Authorize 🔓** button at the top of the Swagger page
- Paste your JWT token (without "Bearer " prefix — Swagger adds it)
- Click **Authorize** → **Close**

#### Step 4 — Test Individual Endpoints

| Tag | Endpoint | Purpose |
|-----|----------|---------|
| `auth` | `GET /api/v1/auth/me` | Get logged-in user profile |
| `users` | `GET /api/v1/users` | List all users in tenant |
| `tenants` | `GET /api/v1/tenants/me` | Get current tenant details |
| `workflows` | `POST /api/v1/workflows` | Create a new workflow |
| `workflows` | `GET /api/v1/workflows` | List all workflows |
| `executions` | `GET /api/v1/executions` | View execution history |
| `integrations` | `GET /api/v1/integrations` | List connected integrations |
| [ai](file:///Users/mustakimshaikh/Downloads/automation-platform/apps/api/src/user/user.service.ts#8-11) | `POST /api/v1/ai/summarize` | Summarize text via OpenAI |
| `health` | `GET /api/v1/health` | Check server health |

---

## 7. Known Issues & Fixes

### ❌ Issue: `EPERM: operation not permitted` on node_modules
**Cause:** pnpm uses symlinked node_modules which macOS sometimes blocks.  
**Fix:**
```bash
rm -rf node_modules apps/api/node_modules apps/web/node_modules
pnpm install
```

### ❌ Issue: `PrismaClientInitializationError: Can't reach database server at localhost:5433`
**Cause:** Docker containers are not running.  
**Fix:**
```bash
# If containers exist but are stopped:
docker start autoify_postgres autoify_redis

# If containers don't exist yet:
docker-compose up -d
```

### ❌ Issue: `Module not found: Can't resolve 'lucide-react'` or `react-hot-toast`
**Cause:** Web app `node_modules` not installed (symlinks broken).  
**Fix:** Full clean reinstall (see above).

### ❌ Issue: `apps/api` doesn't start with `pnpm dev` (no `dev` script)
**Cause:** `apps/api/package.json` was missing a `"dev"` script entry for Turborepo.  
**Fix (already applied):** Added `"dev": "nest start --watch"` to `apps/api/package.json` scripts.

### ❌ Issue: `Type '{ email: string; }' is not assignable to UserWhereUniqueInput`
**Cause:** Prisma schema defines `email` as part of a compound unique key `tenantId_email`, so `findUnique({ where: { email } })` is invalid.  
**Fix (already applied):** Changed to `findFirst({ where: { email } })` in `user.service.ts`.

---

## 8. Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | App environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://autoify:autoify_pass@localhost:5433/autoify_db` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your-long-secret` |
| `JWT_EXPIRES_IN` | JWT expiry time | `7d` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `NEXTAUTH_URL` | Frontend URL for NextAuth | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth session secret | `your-secret` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | From Google Console |
| `API_URL` | Backend API URL (server-side) | `http://localhost:4000` |
| `NEXT_PUBLIC_API_URL` | Backend API URL (client-side) | `http://localhost:4000` |
| `WEBHOOK_SECRET` | HMAC secret for webhook validation | `your-secret` |

---

## 9. Future Changes Guide

### Adding a New API Module (NestJS)
```bash
# Generate a new module, controller, and service
cd apps/api
npx nest g module my-feature
npx nest g controller my-feature
npx nest g service my-feature
```
Then:
1. Import the new module in `app.module.ts`
2. Add `@ApiTags('my-feature')` to the controller for Swagger
3. Decorate endpoints with `@ApiBearerAuth()` and `@UseGuards(JwtAuthGuard)`

### Adding a New Database Model (Prisma)
1. Edit `apps/api/prisma/schema.prisma`
2. Run: `pnpm --filter api exec prisma db push`
3. Run: `pnpm --filter api exec prisma generate`

### Adding a New Frontend Page (Next.js App Router)
Create: `apps/web/src/app/your-page/page.tsx`
```tsx
export default function YourPage() {
  return <div>Your Page</div>;
}
```

### Adding a New npm Package
```bash
# Add to web app
pnpm --filter web add package-name

# Add to api
pnpm --filter api add package-name

# Add to root (shared build tools)
pnpm add -w -D package-name
```

### Resetting the Database Completely
```bash
pnpm --filter api exec prisma migrate reset
# Then re-push schema:
pnpm --filter api exec prisma db push
```

### Deploying to Production
1. Set all env vars in your hosting provider (Render, Railway, Vercel, etc.)
2. Set `NODE_ENV=production` (this disables Swagger UI)
3. Build: `pnpm build`
4. Start: `pnpm --filter api start:prod` and `pnpm --filter web start`


complete run 

# 1. Start Docker
docker start autoify_postgres autoify_redis

# 2. Clean reinstall (fixes the EPERM symlink issue)
cd /Users/mustakimshaikh/Downloads/automation-platform
rm -rf node_modules apps/api/node_modules apps/web/node_modules
pnpm install

# 3. Start both servers
pnpm dev
