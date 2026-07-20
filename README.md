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


## 3. Feature checklist (maps to the original PRD)

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


## 4. Troubleshooting

| Symptom | Likely cause |
|---|---|
| Frontend shows network errors on every page | `VITE_API_URL` doesn't match the deployed backend URL, or the backend hasn't redeployed after you set `CLIENT_URL`/CORS |
| First request after idle takes ~30–60s | Expected — Render free web services sleep after inactivity |
| "Operation buffering timed out" errors | `MONGODB_URI` is missing/incorrect, or Atlas network access doesn't allow the connection |
| Short links 404 instead of redirecting | Make sure you're hitting the **backend's** domain (`snaplink-api.onrender.com/code`), not the frontend's — the static site doesn't handle redirects |
| Custom alias rejected as "reserved" | Certain words (`api`, `admin`, `login`, etc.) are reserved — see `server/src/constants/index.js` |

---

## 5. Roadmap
- Team workspaces & shared link libraries
- Custom/branded domains
- Link-in-bio pages
- Browser extension
- Native mobile apps
- Webhooks + Zapier integration
- AI-generated analytics summaries

---

Built as a complete, deployable reference implementation — not a toy demo.
BUILD by SHUBHAM SHUKLA
