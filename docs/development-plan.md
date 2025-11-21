# Development Plan: Electron IMDb Dataset Explorer

This document translates the project plan in `electron-imdb-plan.md` into an actionable development roadmap, milestones, architecture overview, and prioritized tasks.

**Project Goals:** Reliable, fast local querying of IMDb datasets with exportable structured outputs for series, episodes, cast, and crew.

**High-level milestones:**
- Phase 1: Foundation — Electron + React + Vite skeleton, IPC bridge, basic UI shell
- Phase 2: Dataset Integration — download, extract, DuckDB schema and import
- Phase 3: Query Engine — title search, episode mapping, cast & crew resolution, internal views
- Phase 4: Export Engine — CSV/JSON/Markdown/HTML builders and templates
- Phase 5: UI Polishing & Tests — filtering, progress UI, Playwright tests
- Phase 6: Packaging — Windows installer, auto-updater, code signing (optional)

## Tech Stack Recommendations
- Electron (Main + Renderer)
- React + Vite for renderer
- TypeScript for both main and renderer
- DuckDB (native Node bindings) for local database
- Node streams and fast TSV parsing (`fast-csv` or `node-stream-zip` for gz)
- Playwright for UI e2e tests
- Jest/ Vitest for unit/integration tests
- Electron-Builder or electron-updater for packaging and auto-update

## Architecture Overview

Main responsibilities:
- Electron Main: filesystem access, dataset download and extraction, DuckDB initialization and queries, IPC handlers
- Renderer (React): search UI, data selection, previews, export controls
- Shared: IPC channel contracts, TypeScript types, export templates

Suggested IPC surface (from plan):
- `datasets.download` — download and extract official IMDb TSV archives
- `datasets.load` — load TSVs into DuckDB (create/replace tables)
- `query.searchTitles` — search titles by name/filters
- `query.getEpisodes` — list child episodes for a series `tconst`
- `query.getCast` — retrieve cast for a given episode or set of episodes
- `query.getCrew` — retrieve crew details
- `query.getRatings` — ratings lookup
- `export.generateFile` — create CSV/JSON/Markdown/HTML

## DuckDB Schema (initial)
- `title_basics` (from title.basics.tsv)
- `title_episode` (from title.episode.tsv)
- `title_principals` (from title.principals.tsv)
- `name_basics` (from name.basics.tsv)
- `title_crew` (from title.crew.tsv)
- optional `title_ratings`

Create Materialized Views / Convenience Views:
- `series_episodes`, `episode_cast`, `episode_crew`, `episode_metadata`, `episode_ratings`

## Prioritized Task Breakdown (per milestone)

Phase 1 — Foundation (2–4 days)
- Initialize repo with Electron + Vite + React + TypeScript
- Add basic folder layout: `src/main`, `src/renderer`, `src/shared`
- Implement minimal IPC scaffolding and typed channels
- Add a simple first-run wizard UI stub and search input
- Add developer README and `docs/dev-setup.md` (quick start)

Phase 2 — Dataset Integration (3–7 days)
- Implement dataset downloader with progress reporting
- Implement dataset extraction (gunzip streaming TSVs)
- Implement DuckDB connection and synchronous initial schema creation
- Implement TSV-to-DuckDB bulk import with basic validation and row counts
- Add a CLI script `scripts/import-sample.ts` to speed development

Phase 3 — Query Engine (4–8 days)
- Implement `query.searchTitles` with exact/partial matching (SQL + indexes)
- Implement `query.getEpisodes` to retrieve episode list for a series
- Implement `query.getCast` and `query.getCrew` with name resolution
- Build required views in DuckDB for renderer convenience

Phase 4 — Export Engine (3–6 days)
- Design export data model shared between main and renderer
- Implement CSV/JSON builders in main process
- Implement Markdown + HTML templates
- Integrate `export.generateFile` IPC path and add basic export UI

Phase 5 — UI Polishing & Tests (3–6 days)
- Improve search filtering, add year/type filters, fuzzy opt-in
- Implement progress UI for batch exports and imports
- Add unit tests (Vitest/Jest) and Playwright e2e tests for core flows

Phase 6 — Packaging (2–4 days)
- Configure Electron-Builder/electron-updater
- Build Windows installer and test on VM

## Testing Strategy
- Unit tests: parsing, import logic, export formatting, SQL helpers
- Integration tests: DuckDB import → queries → export (use small sample TSVs)
- End-to-end Playwright: first-run wizard, search→select→export

## Development Setup (short)
- Node.js 18+ recommended
- Install dependencies: `npm ci` or `pnpm install`
- Dev run: `npm run dev` (spawns Electron + Vite)
- Import sample dataset script: `node ./scripts/import-sample.js`

Full dev setup details are in `docs/dev-setup.md`.

## Risks & Mitigations
- Large TSV import time: use streaming imports and show progress; provide sample datasets for quick dev
- DuckDB native bindings across OS: pin version and test installer packaging early
- Missing plots/summaries: document limits and allow external import later

## Next Steps (first implementation sprint)
1. Scaffold project (Phase 1 tasks)
2. Implement downloader + sample import script (Phase 2 minimum)
3. Wire a simple search query to confirm DuckDB queries (Phase 3 minimal)

If you'd like, I can scaffold the basic project skeleton and add `docs/dev-setup.md` next.
