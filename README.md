# RoleRadar

Tracks support and solutions engineering roles across company career pages and alerts on new matches.

> **Status:** In active development. Phase 1 (job collector and listing page) is underway. See the [roadmap](#roadmap).

## Why

Support and solutions engineering roles are spread across hundreds of company career pages, and general job boards miss many of them or list them late. RoleRadar watches the sources directly, normalizes every posting into one format, and flags new matches by role, region and time zone.

## How it works

1. **Collect:** A scheduled collector reads public job-board endpoints (Greenhouse, Lever, Ashby), falling back to HTML scraping only where no endpoint exists and the site permits it.
2. **Normalize:** Each posting is converted into one typed `Job` shape and stored in Postgres, de-duplicated by source and posting ID.
3. **Browse:** A React dashboard lists and filters jobs.
4. **Alert:** New matches are sent to Slack or Discord via webhooks, exactly once per posting.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend (planned) | Hono, TypeScript |
| Database (planned) | PostgreSQL with Drizzle ORM |
| Infrastructure (planned) | Docker, GitHub Actions |

## Roadmap

- [x] Project scaffold: React, TypeScript, ESLint
- [ ] Collector for Greenhouse, Lever and Ashby job boards
- [ ] Postgres storage with de-duplication
- [ ] Job list page with filters (role, region, time zone)
- [ ] Slack and Discord alerts, sent once per posting
- [ ] Rate limiting with exponential backoff and `Retry-After` support
- [ ] User accounts and saved searches
- [ ] Deployment

## Engineering notes

Every real issue hit during development gets a short postmortem in [`incidents/`](incidents/): symptom, evidence, root cause, fix and prevention.

| # | Incident |
|---|---|
| [001](incidents/001-npm-econnreset.md) | `ECONNRESET` while scaffolding the project |
| [002](incidents/002-wrong-vite-template.md) | Scaffold generated without React |

## Running locally

Requires Node.js 22 or later.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Responsible collection

RoleRadar is designed to read public job-board APIs and respect robots.txt and site terms. It does not scrape sites that prohibit automated access.