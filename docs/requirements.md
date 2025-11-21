# Requirements: Electron IMDb Dataset Explorer

This document summarizes functional and non-functional requirements extracted from `electron-imdb-plan.md`.

## Purpose
Build a desktop Electron + React application that allows users to query IMDb datasets locally (no scraping), store them in DuckDB, and export structured deliverables (CSV, HTML, Markdown, JSON) about series, episodes, cast and crew.

## Functional Requirements
- Auto-download IMDb dataset TSVs on first run and on-demand re-downloads
- Supported datasets: `title.basics.tsv.gz`, `title.episode.tsv.gz`, `title.principals.tsv.gz`, `title.crew.tsv.gz`, `name.basics.tsv.gz`, optional `title.ratings.tsv.gz`, `title.akas.tsv.gz`
- Extract and load datasets into DuckDB tables with a stable schema
- Provide title search (exact, partial; fuzzy optional) with filters (year, type)
- Allow user to select a title (`tconst`) and choose data categories to export (episodes, full cast, crew, ratings, metadata)
- Resolve cast and crew names by joining with `name_basics`
- Produce exports: CSV, Markdown, HTML, JSON
- UI: First-run wizard for dataset download, main search panel, data selection panel, results preview, export panel
- IPC API between Electron main and renderer exposing dataset/download/query/export operations

## Non-Functional Requirements
- Fast local queries using DuckDB
- Reliable dataset integrity validation during import
- Reasonable first-run import time (progress indicators)
- Cross-platform packaging (Phase 6 targets Windows installer first)
- Test coverage: unit, integration, end-to-end (Playwright)

## Constraints and Open Questions
- IMDb datasets do not include plot summaries; external import optional
- Fuzzy search: enable or opt-in?
- Include images/posters in exports?
- Allow custom DuckDB queries?

## Acceptance Criteria (examples)
- Given a downloaded dataset, searching "Columbo" returns `tt1466074` among results
- Exporting full cast for a selected episode produces a CSV with performer names, character lists, and ordering
- First-run wizard downloads datasets and imports into DuckDB with progress feedback
