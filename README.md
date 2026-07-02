# UP Roots

A plant search app for cold-climate gardeners. Search plants, see whether they'll
survive your USDA hardiness zone, save favorites to "My Garden," and check whether
a species has actually been recorded growing in your region.

Built with **React + Vite** on the frontend and a small **Express** API on the
backend. The backend holds the Perenual API key so it never reaches the browser,
normalizes plant data from multiple sources (Perenual + Wikipedia) into one shape,
caches responses to disk, and falls back to a **built-in library of ~35 curated
cold-climate plants** when the external API is rate-limited — so the app keeps
working even with no API key at all.

## Project layout

```
.            React + Vite frontend
  src/
    pages/        screens (Home, PlantDetail, Garden, NotFound)
    components/   reusable UI (PlantCard, badges, leaves, ...)
    services/     talks to our backend + keyless public APIs (GBIF, ZIP zones)
    context/      saved-garden state
    utils/        pure logic (zone survival)
server/      Express backend
  adapters/       one translator per data source (Perenual, Wikipedia)
  data/           curated seed plant library + persisted response cache
```

## Running it locally

You need **two** processes in development: the backend API and the frontend dev server.

### 1. Backend (first terminal)

```bash
cd server
npm install
cp .env.example .env      # then edit .env and add your Perenual API key
npm run dev               # starts the API on http://localhost:3001
```

Get a free key at https://perenual.com/docs/api and put it in `server/.env` as
`PERENUAL_API_KEY=...`.

> No key? The app still runs in demo mode using the built-in plant library —
> search for things like "milkweed", "maple", or "lilac".

### 2. Frontend (second terminal)

```bash
npm install
npm run dev               # starts the app on http://localhost:5173
```

The frontend calls `/api/...`, which Vite forwards to the backend on port 3001
(see the proxy in `vite.config.js`), so you don't deal with CORS in development.

## Tests

```bash
npm test
```

Covers the core pure logic: zone-survival rules, the Perenual adapter,
the TTL cache, and validity guardrails on the curated seed library.

## Deploying

In production the Express server serves the built frontend too, so the whole app
deploys as **one service** (and React Router deep links work on refresh):

```bash
npm run build             # builds the frontend into dist/
cd server && npm start    # serves the API and the app on one port
```

The repo includes a `render.yaml` blueprint for [Render](https://render.com):
create a new Blueprint service pointing at this repo, set `PERENUAL_API_KEY`
in the dashboard, and deploy.

## Useful checks

- `curl http://localhost:3001/api/health` → `{"ok":true}` confirms the API is up.
- `npm run lint`, `npm test`, and `npm run build` (in the project root) check the frontend.
