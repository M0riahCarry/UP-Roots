# UP Roots

A plant search app for cold-climate gardeners. Search plants, see whether they'll
survive your USDA hardiness zone, save favorites to "My Garden," and check whether
a species has actually been recorded growing in your region.

Built with **React + Vite** on the frontend and a small **Express** API on the
backend. The backend holds the Perenual API key so it never reaches the browser,
and normalizes plant data into one shape the frontend understands.

## Project layout

```
.            React + Vite frontend
  src/
    pages/        screens (Home, PlantDetail, Garden)
    components/   reusable UI (PlantCard, badges, leaves, ...)
    services/     talks to our backend + keyless public APIs (GBIF, ZIP zones)
    context/      saved-garden state
server/      Express backend (proxies + normalizes plant data)
```

## Running it locally

You need **two** processes: the backend API and the frontend dev server.

### 1. Backend (first terminal)

```bash
cd server
npm install
cp .env.example .env      # then edit .env and add your Perenual API key
npm run dev               # starts the API on http://localhost:3001
```

Get a free key at https://perenual.com/docs/api and put it in `server/.env` as
`PERENUAL_API_KEY=...`.

### 2. Frontend (second terminal)

```bash
npm install
npm run dev               # starts the app on http://localhost:5173
```

The frontend calls `/api/...`, which Vite forwards to the backend on port 3001
(see the proxy in `vite.config.js`), so you don't deal with CORS in development.

## Useful checks

- `curl http://localhost:3001/api/health` → `{"ok":true}` confirms the API is up.
- `npm run lint` and `npm run build` (in the project root) check the frontend.
