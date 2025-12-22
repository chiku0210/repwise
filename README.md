
# Repwise 🏋️‍♂️

Every rep counts.  
Repwise is a focused gym-coach PWA for people who care about **progress, not hype**.

- Log every workout with one-hand-friendly controls
- Learn proper form through a clean, distraction-free UI
- Track muscle balance and strength trends over time
- Works great on mobile as an installable PWA

---

## Table of Contents

- [Vision](#vision)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Screens](#screens)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Interview Notes](#interview-notes)

---

## Vision

Repwise treats training like a system:

1. **Record** what you do  
2. **Review** what changes  
3. **Adjust** with intent  

No motivational fluff, no influencer theatrics—just calm, clear feedback so every session moves you closer to your goals.

---

## Core Features

### MVP (implemented / in-progress)

- **Mobile-first PWA**
  - Installable on mobile and desktop
  - Dark, calm UI built for gym environments
- **Email OTP Login**
  - Passwordless sign-in with email-based one-time codes
- **Today Screen**
  - “Start Workout” and “Quick Log” actions
  - Bottom navigation: Today / Log / Learn / Profile
- **Branding**
  - Repwise name & tagline: “Every rep counts. Log your training and build strength with intent.”
  - Consistent dark navy + blue accent theme

### Planned

- **Workout Player**
  - Guided templates (Full Body, Upper/Lower)
  - Fast set logging (weight, reps, RPE)
  - Rest timers, exercise swaps
- **Exercise Library**
  - Curated movement list with muscles worked
  - Variants by equipment: machine / dumbbell / barbell / bodyweight
- **Muscle Balance Analytics**
  - Weekly sets per muscle group
  - Undertrained / on track / overloaded indicators
  - Rules-based “next session” recommendations
- **Offline-First Logging**
  - Log workouts with poor/no connectivity
  - Local persistence + background sync when online

---

## Tech Stack

**Frontend & PWA**

- Next.js (App Router, TypeScript)
- React
- Tailwind CSS

**Auth & Data**

- Supabase (email OTP auth, PostgreSQL)

**Tooling**

- Jest + Testing Library (unit + integration tests)
- GitHub Actions (CI: lint, test, build)
- Vercel (deployment target for the Next.js app)

---

## Architecture

### High-Level Diagram

```
             +----------------------------+
             |        Repwise PWA        |
             |  (Next.js + React + SW)   |
             +-------------+-------------+
                           |
                           | HTTPS (API routes)
                           v
                 +----------------------+
                 |  Next.js API routes  |
                 |  (/api/workouts,     |
                 |   /api/sets, etc.)   |
                 +-----------+----------+
                             |
                             | Supabase client
                             v
                  +--------------------------+
                  |   Supabase (Postgres)   |
                  |   - users               |
                  |   - workouts            |
                  |   - sets                |
                  |   - exercises           |
                  |   - muscles             |
                  +--------------------------+
```

### Key Concepts

- **Event-style logs**  
  Each performed set is an immutable event (exercise, weight, reps, RPE, timestamp). Muscle balance and trends are derived from these events.

- **Exercise Catalog**  
  A versioned exercise table describes muscles worked, equipment variants, and cues. User data never depends on duplicated exercise text.

- **PWA Shell**  
  The app shell (navigation, layout, fonts) is cached so the app remains responsive even with flaky networks.

---

## Screens

- **Today**  
  Landing view with:
  - App title and tagline
  - Primary actions: “Start Workout”, “Quick Log”
  - “Sign in with email” link

- **Log**  
  (Planned) Workout history and calendar view of past sessions.

- **Learn**  
  (Planned) Exercise library with muscles worked and basic form guidance.

- **Profile**  
  (Planned) Goal, experience level, days/week, equipment preferences, and export/delete data.

---

## Local Development

### Prerequisites

- Node.js 18+
- npm
- Supabase project (free tier)

### 1. Clone and install

```
git clone https://github.com/<your-username>/repwise.git
cd repwise
npm install
```

### 2. Configure Supabase

1. Create a new project in Supabase.
2. Enable **Email** auth and email OTP in the dashboard.
3. Copy the **Project URL** and **anon key** from Supabase.

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### 3. Run dev server

```
npm run dev
```

Open `http://localhost:3000` in your browser (mobile viewport recommended).

---

## Environment Variables

| Variable                         | Description                                    |
|----------------------------------|------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key (client-side access)  |

Secrets are not committed; `.env.local` is git-ignored.

---

## Testing

### Run tests

```
npm test
```

(Once tests are added, this will run Jest + Testing Library for components and utilities.)

Planned test coverage:

- OTP login flow (happy path + invalid OTP)
- Workout creation and set logging
- Muscle-balance analytics calculations
- Basic rendering of key pages (Today / Log / Learn / Profile)

---

## CI/CD

GitHub Actions pipeline (planned):

- On every push & pull request:
  - Install dependencies
  - Run `npm run lint`
  - Run `npm test`
  - Run `npm run build`

On push to `main`:

- Deploy to Vercel via GitHub integration.

---

## Deployment

Recommended:

- **Frontend & API**: Vercel (free tier)
- **Database & Auth**: Supabase (free tier)

Basic deployment flow:

1. Push to GitHub (`main` branch).
2. Vercel auto-builds and deploys the Next.js app.
3. Supabase remains the external auth + database layer.

---

## Project Structure

```
repwise/
├── public/
│   ├── manifest.json          # PWA manifest (Repwise name, icons)
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── app/
│   │   ├── page.tsx           # Today screen
│   │   ├── login/page.tsx     # Email OTP login (WIP)
│   │   └── globals.css        # Global styles + dark theme
│   ├── components/
│   │   └── ui/
│   │       ├── bottom-nav.tsx # Bottom navigation
│   │       └── button.tsx     # Reusable button component
│   └── lib/
│       └── supabase.ts        # Supabase client
├── next.config.js             # PWA & Next.js config
├── tailwind.config.ts         # Tailwind theme config
├── postcss.config.mjs         # Tailwind via @tailwindcss/postcss
└── package.json
```

---

## Roadmap

- [ ] Complete OTP login & route protection
- [ ] Design workout templates and workout player UI
- [ ] Implement exercise catalog + Learn tab
- [ ] Implement muscle-balance analytics & charts
- [ ] Local offline queue for workouts (IndexedDB) with sync
- [ ] Push notifications for workout reminders
- [ ] Add Jest test suite & CI pipeline
- [ ] Polish onboarding (goals, experience, equipment)

---

## Interview Notes

Use these points when talking about Repwise:

- **Architectural choices**
  - Event-based workout logging model that makes it easy to add new analytics later without migrations.
  - Clear separation between exercise catalog (content) and user logs (data).
  - PWA-first design to work in low-connectivity gym environments.

- **Why it’s portfolio-worthy**
  - Realistic product: auth, PWA behavior, clean UX, and a clear niche (muscle balance + form understanding).
  - Shows ability to design both product and system architecture, not just CRUD.

- **Scalability & trade-offs**
  - Starts with rules-based muscle-balance logic; can be upgraded to ML recommendations later without changing the data model.
  - Uses managed services (Vercel + Supabase) to keep ops simple while still supporting growth.
  - Offline-first concept using a local store + sync queue is planned to avoid UX breaks in gyms.

---

**Every rep counts.**  
If you build something on top of Repwise, feel free to open issues or PRs.
