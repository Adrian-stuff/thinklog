# Building ThinkLog — A Centralized Hub for Developer Reads

**ThinkLog** is a full-stack web application that aggregates articles from top engineering blogs, community platforms, and individual developer sites into one clean, fast feed. Instead of hopping between a dozen bookmarks, users get a single stream of curated content with social features like reactions, comments, search, and sharing.

Built as a academic project for **Web Systems and Technologies** and **Quantitative Methods** at Pamantasan ng Lungsod ng Valenzuela, ThinkLog demonstrates modern full-stack development using a minimal toolset.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Alpine.js, Tailwind CSS (CDN), Highlight.js |
| Backend | Node.js (Express) |
| Database | PostgreSQL (via Supabase) |
| Auth | Supabase Auth (email/password, Google, GitHub) |
| RSS Processing | Custom parser with article extraction |
| Hosting | Vercel |

## What It Does

### Aggregated Feed
ThinkLog pulls articles from multiple RSS feeds and presents them in a responsive card layout. Users can filter by source feed and sort by **Recommended**, **Latest**, **Popular**, **Trending**, or **Discover**.

### Article Reader
Clicking any article opens a dedicated reader view with the full content, syntax-highlighted code blocks (via Highlight.js with a copy-to-clipboard button), and metadata — author, publication date, and source.

### Social Features
- **Reactions** — Like, Love, or Insightful on any article
- **Comments** — Inline discussion on both the feed cards and the full article view
- **Share** — Native share API with clipboard fallback

### Search
Live search with autocomplete suggestions, powered by PostgreSQL full-text search.

### Authentication
Supabase Auth with email/password, Google OAuth, and GitHub OAuth. Users can update their display name from a settings modal.

---

## Architecture Decisions

### Single HTML File (SPA)
The entire frontend is a single `index.html` with Alpine.js handling reactivity and view switching. No build step, no framework overhead — just CDN-served libraries. Views are toggled via `x-show` based on a `currentView` state variable.

### Why Alpine.js?
For a project of this scope, a full framework like React or Vue would be overkill. Alpine provides just enough reactivity (state management, event handling, transitions) without a build pipeline. It integrates directly into the HTML, keeping the codebase small and readable.

### Server-Side Rendering of Articles
The RSS feed processing happens on the server via a cron job. Articles are fetched, parsed (using `@extractus/article-extractor`), and stored in PostgreSQL. The client simply requests paginated JSON from the API.

### PostgreSQL JSON Aggregation
To avoid N+1 queries, the API uses PostgreSQL's JSON aggregation functions to bundle posts with their associated feed metadata, reaction counts, and comments in a single query. This keeps response times low even as the dataset grows.

---

## Challenges & Solutions

### SPA Routing with Static Hosting
Vercel serves the same `index.html` for all routes using a catch-all rewrite rule. Client-side routing is handled by Alpine + the History API. The `handleRouting()` function reads the URL path and sets the appropriate `currentView`, while `pushState()` updates the URL without a page reload.

### Transition Issues with Alpine
The `x-transition` directive initially used custom CSS classes (`opacity-0 translate-y-6`, etc.) which caused views to get stuck at opacity: 0. Switching to Alpine's **native transition modifiers** (`x-transition:enter.duration.400ms`) resolved the issue by letting Alpine handle the timing internally.

### Image Serving in Vercel
Images in `/public/images/` weren't being served because the `vercel.json` routes only covered `css` and `js` directories. Adding `images` to the static asset pattern fixed it.

### Nested View Bug
A missing `</div>` closing tag in the article view skeleton caused subsequent views (About, Privacy, Terms) to be nested inside the hidden article-view div. Adding the missing closing tag restored visibility.

---

## Database Schema

```
feeds       — id, name, rss_url, website_url, created_at
posts       — id, feed_id, title, url, author, content, excerpt,
              image_url, published_at, created_at
reactions   — id, post_id, user_id, reaction_type, created_at
comments    — id, post_id, user_id, user_name, content, created_at
tags        — id, name
post_tags   — post_id, tag_id
```

The API exposes endpoints at `/api/posts`, `/api/posts/:id/details`, `/api/reactions/:id`, `/api/comments/:id`, `/api/search`, and `/api/feeds`.

---

## Lessons Learned

1. **Alpine.js is great for small-to-medium SPAs** — No build step, intuitive syntax, and sufficient reactivity for most use cases.
2. **Postgres JSON aggregation is powerful** — Combining related data server-side eliminates N+1 queries without an ORM.
3. **CDN dependencies need version pinning** — Using `3.x.x` version ranges can lead to unexpected behavior if a new version ships with breaking changes.
4. **Static hosting has routing quirks** — Every SPA needs a catch-all rewrite, and static asset patterns must be explicitly configured.
5. **Accessibility matters** — Adding `prefers-reduced-motion` support, proper focus states, and semantic HTML improves the experience for all users.

---

## Try It

The live site is available at **[thinklogapp.vercel.app](https://thinklogapp.vercel.app)**. The source code is on GitHub at `github.com/Adrian-stuff/thinklog`.
