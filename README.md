# Triprodeo

Monorepo with a React (Vite) frontend and an Express + Prisma backend, deployable to Vercel as a single project.

## Layout

```
/                 Vite + React frontend (root)
/api/index.ts     Vercel serverless entrypoint (wraps the Express app)
/backend          Standalone Express + Prisma backend (runs locally on port 5000)
```

Both the frontend and backend are independently installable/runnable packages.

## Local development

```bash
# Install deps for frontend + backend
npm install
npm --prefix backend install

# Run backend (localhost:5000)
npm run dev:backend

# Run frontend (localhost:3000)
npm run dev
```

## Deploy to Vercel

1. Import this repo into Vercel. The framework preset can be left as "Other" — `vercel.json` handles configuration.
2. Set the following environment variables in the Vercel project settings (values from `backend/.env.example`):
   - `DATABASE_URL` — a **pooled** PostgreSQL URL (Supabase pgbouncer, Neon, or Vercel Postgres)
   - `JWT_SECRET`, `JWT_REFRESH_SECRET`
   - `FRONTEND_URL` (your Vercel domain)
   - `ADMIN_DEFAULT_EMAIL`, `ADMIN_DEFAULT_PASSWORD`, `CMS_ADMIN_SECRET`
   - `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`
3. Deploy. The build runs `vite build` → `out/`, and `api/index.ts` is deployed as a Node serverless function that serves `/api/*`, `/health`, `/sitemap.xml`, and `/robots.txt`.

All other routes are rewritten to `index.html` for the React SPA.

## Notes

- `backend/node_modules` and all `.env` files are gitignored.
- The Express app lives in `backend/src/app.ts` (no `listen` — safe to import from serverless). `backend/src/index.ts` is the local-only server that calls `app.listen`.
- `prisma generate` runs automatically via `postinstall`.
