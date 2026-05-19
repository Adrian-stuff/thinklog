# ThinkLog

A centralized developer news platform that aggregates articles from top engineering blogs into a single fast, focused feed with social features.

Built by **BSIT 2-8** students of **Pamantasan ng Lungsod ng Valenzuela** — De Vera, Adrian; Alamer, Justine; Espiritu, Jan Marc — in partial fulfillment of Web Systems and Technologies and Quantitative Methods.

## Features

- **Curated feed** — Articles from dozens of engineering blogs in one place
- **Smart sorting** — Recommended, Latest, Popular, Trending, Discover
- **Reactions** — Like, Love, Insightful with optimistic UI
- **Comments** — Join the discussion on any article
- **Full-text search** — Search across all aggregated content with autocomplete
- **Feed filtering** — Filter articles by source blog
- **Authentication** — Email/password, Google, or GitHub via Supabase Auth
- **Responsive** — Works on desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla JS, Alpine.js, Tailwind CSS |
| Backend | Express.js (Node.js) |
| Database | PostgreSQL (via Supabase) |
| Auth | Supabase Auth |
| RSS | rss-parser |
| Hosting | Vercel (serverless + static) |

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

### Setup

```bash
git clone https://github.com/Adrian-stuff/thinklog.git
cd thinklog
npm install
```

Copy the environment file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
PORT=3000
NODE_ENV=development
CRON_SECRET=your_cron_secret_key_if_using_cron
```

### Database

Run `database/schema.sql` against your Supabase project's SQL editor to create the tables, indexes, and RLS policies. Then seed some RSS feeds:

```bash
psql < database/schema.sql
psql < database/seed_feeds.sql
```

### Run Locally

```bash
npm start
```

Open http://localhost:3000

### Sync RSS Feeds

Trigger a manual sync:

```bash
curl http://localhost:3000/api/cron/sync
```

For production, set up a cron job (Vercel Cron Jobs or external) to hit `GET /api/cron/sync` with the `CRON_SECRET` as a Bearer token.

## Project Structure

```
thinklog/
├── backend/
│   ├── config/
│   │   └── db.js              # Postgres connection
│   ├── routes/
│   │   ├── posts.js            # Post listing & details
│   │   ├── comments.js         # Comment fetching
│   │   ├── reactions.js        # Reaction counts
│   │   ├── search.js           # Full-text search & suggestions
│   │   └── feeds.js            # Feed listing
│   ├── services/
│   │   ├── rssFetcher.js       # RSS fetch + DB insert
│   │   └── feedParser.js       # RSS parsing
│   └── jobs/
│       └── feedSync.js         # Cron job wrapper
├── public/
│   ├── index.html              # SPA shell (Alpine.js + Tailwind)
│   ├── js/
│   │   ├── app.js              # Main Alpine component & routing
│   │   ├── api.js              # API client
│   │   ├── auth.js             # Auth component
│   │   ├── supabase.js         # Supabase client init
│   │   └── components/
│   │       ├── search.js       # Search with autocomplete
│   │       ├── comments.js     # Comment loading/submission
│   │       └── reactions.js    # Reaction toggle with optimistic UI
│   └── css/
├── database/
│   ├── schema.sql              # Full schema (feeds, posts, comments, reactions)
│   ├── seed_feeds.sql          # Initial RSS feed list
│   └── add_search_cache.sql    # Search cache migration
├── index.js                    # Express entry point
├── vercel.json                 # Vercel deployment config
└── .env.example                # Environment variables template
```

## Deployment

The project is deployed on Vercel as a serverless Express function + static files.

```bash
npx vercel --prod
```

The SPA routing is configured in `vercel.json` — all non-API paths serve `public/index.html`.

## License

ISC
