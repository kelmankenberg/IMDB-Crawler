# Next Steps & Recommended Tasks

This file lists immediate actions to begin the first development sprint and recommended CI/config items.

Immediate tasks (sprint 0)
- Create repository skeleton with `src/main`, `src/renderer`, `src/shared`, `scripts/`
- Add TypeScript/ESLint/Prettier configs and `tsconfig.json`
- Create a small sample dataset (10–100 rows) and place in `tests/sample-data/` for CI
- Implement `scripts/import-sample.ts` to quickly load sample TSVs into DuckDB during CI
- Create GitHub Actions workflow:
  - `ci.yml` runs `npm ci`, `npm test`, and `node scripts/import-sample.js` + a few integration queries

CI Recommendations
- Unit tests: run on push and PRs
- Integration import: import sample TSVs and run a few DuckDB queries
- Optional: Playwright e2e on a matrix with a headless environment

Issue Backlog (starter)
- Scaffold project and dev tooling
- Implement dataset downloader and extractor
- Implement DuckDB import pipeline
- Implement basic search UI and IPC
- Implement CSV/JSON export
- Add tests for import and export

If you'd like, I can scaffold the repository skeleton and add initial configs now.
