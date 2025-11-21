# Developer Setup: IMDB-Crawler (Windows)

This file describes how to get the project running locally for development on Windows (PowerShell).

Prerequisites
- Node.js 18+ (LTS) installed
- Git
- Optional: `pnpm` or `npm` (examples use `npm`)

Clone and install

```powershell
git clone <repo-url> .
npm ci
```

Start development

```powershell
# Start renderer dev server and Electron in dev mode
npm run dev
```

Import sample datasets (fast path for development)

```powershell
# Run an included script to import a small sample of IMDb TSVs into DuckDB
node ./scripts/import-sample.js
```

Testing

```powershell
# Install dependencies
npm ci

# Run unit tests
npm test

# Run Playwright e2e tests (after starting dev server)
npx playwright test
```

Packaging (Windows)

```powershell
# Build installer using electron-builder
npm run build
```

Notes
- If DuckDB native bindings fail to install, ensure build tools are present and that Node.js version is supported. Prefer prebuilt binaries where available.
- For working with full IMDb datasets, expect multi-GB downloads and long import times. Use the sample scripts for fast iteration.
