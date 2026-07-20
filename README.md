# SnapLink

A production-ready URL shortener — custom aliases, QR codes, click analytics, password-protected links, an admin panel, and a REST API — built to run **entirely on free infrastructure** (Render free tier + MongoDB Atlas free tier).

```
Frontend  → React 19 + Vite + TypeScript + Tailwind, deployed as a Render static site
Backend   → Node.js + Express + MongoDB/Mongoose, deployed as a Render free web service
Database  → MongoDB Atlas M0 (512MB, free forever)
```

---

## 1. Project structure

```
snaplink/
├── server/                # Express API
│   └── src/
│       ├── config/        # env + db connection
│       ├── constants/
│       ├── models/        # User, Link, Analytics (Mongoose)
│       ├── controllers/
│       ├── services/      # business logic
│       ├── routes/
│       ├── middlewares/   # auth, rate limiting, error handling
│       ├── validators/    # express-validator schemas
│       ├── docs/          # openapi.json (served at /api/docs)
│       ├── database/      # seed.js
│       ├── app.js
│       └── server.js
├── client/                 # React SPA
│   └── src/
│       ├── components/     # ui/, layout/, landing/, dashboard/
│       ├── pages/
│       ├── contexts/       # AuthContext, ThemeContext
│       ├── services/       # axios API clients
│       └── types/
├── render.yaml              # one-file Render Blueprint (both services)
└── README.md
```

---

## 2. Local development

### Prerequisites
- Node.js 18+
- A MongoDB connection string — either:
  - **Local**: `docker run -d -p 27017:27017 mongo:7` (or install MongoDB Community locally), or
  - **Free cloud**: a [MongoDB Atlas](https://www.mongodb.com/atlas) M0 cluster (see §4)

### Backend

```bash
cd server
cp .env.example .env       # fill in MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET
npm install
npm run seed                # optional: creates demo data (see credentials below)
npm run dev                  # http://localhost:5000
```

Generate strong secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Seeded demo accounts (only after `npm run seed`):
| Email | Password | Role |
|---|---|---|
| `admin@snaplink.dev` | `Password123` | admin |
| `demo@snaplink.dev` | `Password123` | user |

### Frontend

```bash
cd client
cp .env.example .env        # VITE_API_URL=http://localhost:5000
npm install
npm run dev                  # http://localhost:5173
```

Open `http://localhost:5173` — the landing page, auth flow, and dashboard are all live against your local API.

---

## 3. Deploying to Render (100% free)

### Option A — Blueprint (recommended, one click)
1. Push this repo to GitHub.
2. In Render: **New → Blueprint**, point it at your repo. Render reads `render.yaml` and creates both services (`snaplink-api` web service + `snaplink` static site) automatically.
3. Render will prompt you to fill in the vars marked `sync: false`:
   - `snaplink-api`: `MONGODB_URI`, `BASE_URL` (fill in *after* the first deploy once Render assigns the URL), `CLIENT_URL`
   - `snaplink`: `VITE_API_URL` (the `snaplink-api` URL)
4. Redeploy both services once the URLs are known so `BASE_URL`/`CLIENT_URL`/`VITE_API_URL` are correct — short links and CORS depend on these being accurate.

### Option B — Manual setup
**Backend (Web Service)**
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`
- Add the env vars listed in `server/.env.example`

**Frontend (Static Site)**
- Root directory: `client`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Add a rewrite rule: `/*` → `/index.html` (required for React Router)
- Env var: `VITE_API_URL` = your backend's Render URL

### 4. MongoDB Atlas (free tier) setup
1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create an **M0** cluster (512MB, free forever).
3. Database Access → add a user with a strong password.
4. Network Access → add `0.0.0.0/0` (Render's outbound IPs are dynamic on the free plan, so IP allow-listing isn't practical here — access is still gated by your DB user/password).
5. Copy the connection string into `MONGODB_URI`.

---

## 5. Why this runs comfortably on Render's free tier

- **No cron jobs** — link expiry uses a MongoDB **TTL index** (`Link.expiresAt`), so expired links are deleted by the database itself.
- **No Redis** — rate limiting uses in-memory `express-rate-limit`, sufficient for a single free-tier instance.
- **No file storage** — QR codes are generated on-demand as data URIs/SVG strings; nothing is written to disk, which matters because Render's free-tier disk is ephemeral and wiped on every redeploy.
- **No WebSockets** — the dashboard polls via React Query instead of holding persistent connections, which free-tier instances aren't well suited for anyway.
- **Small connection pool** (`maxPoolSize: 5`) — plays well with Atlas M0's connection limits.
- **Graceful cold starts** — the server boots and passes Render's health check even if MongoDB hasn't connected yet; DB-dependent routes return a clear error instead of hanging, and the free web service can sleep/wake without breaking the boot sequence.

The trade-off: Render's free web services sleep after ~15 minutes of inactivity and take up to a minute to wake on the next request. The `/status` page in the app surfaces this so it isn't a mystery.

---

## 6. Feature checklist (maps to the original PRD)

| Feature | Status |
|---|---|
| Shorten URLs, custom alias, expiry | ✅ |
| Password-protected links | ✅ |
| QR codes (PNG + SVG, no disk writes) | ✅ |
| Auth (JWT access + refresh, httpOnly cookies) | ✅ |
| Dashboard (stats, charts, recent links) | ✅ |
| Analytics (country, device, browser, referrer, timeline) | ✅ |
| Link management (edit/delete/duplicate/favorite/disable/search/export CSV) | ✅ |
| REST API + API keys + OpenAPI docs at `/api/docs` | ✅ |
| Admin panel (users, links, ban/unban) | ✅ |
| Dark mode | ✅ |
| Rate limiting, Helmet, Mongo sanitization, hashed IPs | ✅ |
| Responsive landing page (hero, features, pricing, FAQ) | ✅ |
| Email verification / password-reset email delivery | ⚠️ Structured but **not wired to a real SMTP provider** — reset tokens are returned directly in non-production so the flow is testable. Plug in [Resend](https://resend.com)'s free tier (see `.env.example`) to send real emails. |
| PWA / offline support | 🚧 Not implemented — see Roadmap |
| Team workspaces, branded domains, Zapier | 🚧 Roadmap only, per the original PRD |

---

## 7. API quick reference

Full interactive docs: `GET /api/docs` (Swagger UI, backed by `server/src/docs/openapi.json`).

```bash
# Register
curl -X POST https://snaplink-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ava","email":"ava@example.com","password":"Password123"}'

# Shorten a link (with an API key from Settings → API key)
curl -X POST https://snaplink-api.onrender.com/api/links \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_KEY" \
  -d '{"originalUrl":"https://example.com/very/long/path","customAlias":"launch"}'
```

---

## 8. Troubleshooting

| Symptom | Likely cause |
|---|---|
| Frontend shows network errors on every page | `VITE_API_URL` doesn't match the deployed backend URL, or the backend hasn't redeployed after you set `CLIENT_URL`/CORS |
| First request after idle takes ~30–60s | Expected — Render free web services sleep after inactivity |
| "Operation buffering timed out" errors | `MONGODB_URI` is missing/incorrect, or Atlas network access doesn't allow the connection |
| Short links 404 instead of redirecting | Make sure you're hitting the **backend's** domain (`snaplink-api.onrender.com/code`), not the frontend's — the static site doesn't handle redirects |
| Custom alias rejected as "reserved" | Certain words (`api`, `admin`, `login`, etc.) are reserved — see `server/src/constants/index.js` |

---

## 9. Roadmap
- Team workspaces & shared link libraries
- Custom/branded domains
- Link-in-bio pages
- Browser extension
- Native mobile apps
- Webhooks + Zapier integration
- AI-generated analytics summaries

---

Built as a complete, deployable reference implementation — not a toy demo. Swap in real SMTP credentials and an Atlas cluster and it's ready for actual traffic.
