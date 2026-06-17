# SpecterBoard

Ghost leaderboard for personal performance tracking.

Built via **War Council** `coding_delivery(ship)` → Cursor reconcile → verify. War Council is dev tooling only.

## Setup

```bash
cd D:/specterboard
cp .env.example .env
npm install
npm run dev
```

## Scripts

- `npm run dev` — http://127.0.0.1:5173
- `npm run test:e2e` — Playwright on port **5181** (mocked Gemini)

## Features

- Past-You, Elite 1%, Custom rival ghosts
- Daily +1 logging, streak flame, Gemini smack talk (cached daily)
- Canvas share card PNG
