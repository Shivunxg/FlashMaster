# FlashMaster

Spaced-repetition flashcards for language learning and exam prep. Free-text decks and cards (no fixed language list), SM-2 scheduling, daily streaks, and a premium tier for unlimited decks + AI card generation (not yet built).

## Stack

- Next.js 16 (App Router, Server Actions)
- Tailwind CSS v4
- Prisma + SQLite (swap `DATABASE_URL` for Postgres in production)
- Cookie session auth (scrypt password hashing, no third-party auth provider)

## Getting started

```bash
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

Open http://localhost:3000 — you'll land on `/login`. Sign up to get started.

## What's built

- Auth: signup, login, logout (httpOnly session cookie)
- Decks: create, free-tier limit of 3 decks
- Cards: add front/back/example, keep adding in a loop
- Study: flip-card review with real SM-2 scheduling (Again/Hard/Good/Easy), daily streak tracking
- Session-complete summary (retention, streak, grade breakdown)
- Stats: retention rate, weekly activity, cards learned
- Settings: notification/sound toggles, logout
- Premium: plan comparison UI — "Continue to Secure Checkout" currently lands on a placeholder (`/premium/checkout`) with a dev-only unlock button, since no Stripe keys are configured yet

## Not built yet

- Real Stripe Checkout integration (`STRIPE_SECRET_KEY` / `STRIPE_PRICE_ID` in `.env.example` are placeholders)
- AI flashcard generation from text/PDF (premium feature, listed but not implemented)
- CSV export
- Push notifications for the daily reminder toggle (the toggle persists a preference but doesn't send anything yet)
- Deck editing/deletion, card editing/deletion
