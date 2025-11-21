# Project Plan: Electron/React IMDb Dataset Explorer

## 1. Purpose and Vision

Build a desktop application (Electron + React) that allows users to
query IMDb's official datasets locally and export rich, structured data
about TV shows, movies, and episodes. The app will: - Auto-download IMDb
datasets on first run - Store datasets in DuckDB for fast local
querying - Let users search for a title, choose the correct match, and
select what data to retrieve - Produce structured deliverables (CSV,
HTML, Markdown, JSON) - Support full cast lists, crew, episode metadata,
ratings, and more

The aim is reliability, speed, and completeness without scraping or API
rate limits.

------------------------------------------------------------------------

## 2. Core Features

### 2.1 Dataset Handling

-   Auto-download IMDb dataset TSVs on first launch
-   Allow manual re-download/update anytime
-   Supported datasets:
    -   `title.basics.tsv.gz`
    -   `title.episode.tsv.gz`
    -   `title.principals.tsv.gz`
    -   `title.crew.tsv.gz`
    -   `name.basics.tsv.gz`
    -   Optional: `title.ratings.tsv.gz`, `title.akas.tsv.gz`
-   Extract and load into DuckDB
-   Incremental updates supported in future versions

### 2.2 Title Search

-   User enters a title name
-   The app queries DuckDB:
    -   Exact title matches
    -   Partial title matches (fuzzy optional)
    -   Filter by year or type
-   Display search results with:
    -   Title
    -   Year range
    -   Type (TV Series, Movie)
    -   tconst

User selects the correct title (e.g., Columbo → `tt1466074`).

### 2.3 Data Selection Options

Users choose which information to retrieve: - Episode list\
- Full cast per episode\
- Crew (directors, writers, etc.)\
- Ratings\
- Summary/plot (from IMDb basics)\
- Characters\
- Season metadata\
- Runtime\
- Release dates

Checkbox approach: users select any or all.

### 2.4 Output Deliverables

-   CSV (table-form)
-   Markdown (human-readable report)
-   HTML (browser-friendly)
-   JSON (data pipeline--ready)

Deliverables include: - Series overview - Episode list - Full cast -
Crew - Metadata sections

------------------------------------------------------------------------

## 3. Data Architecture

### 3.1 DuckDB Schema Overview

**Tables from IMDb datasets:**

  DuckDB Table       IMDb Source
  ------------------ -------------------------
  title_basics       title.basics.tsv.gz
  title_episode      title.episode.tsv.gz
  title_principals   title.principals.tsv.gz
  name_basics        name.basics.tsv.gz
  title_crew         title.crew.tsv.gz
  title_ratings      title.ratings.tsv.gz

### 3.2 Internal Views for App Logic

-   `series_episodes`: All episodes linked to a parent series
-   `episode_cast`: Joined full cast information
-   `episode_crew`: Director + writers with names resolved
-   `episode_metadata`: Runtime, genres, air date
-   `episode_ratings`: IMDb ratings
-   `episode_characters`: parsed characters field

------------------------------------------------------------------------

## 4. Query Pipeline

### 4.1 Title → Episodes

1.  User selects `tconst` for the series\
2.  Query `title_episode` to get all episodes (child tconsts)
3.  Join `title_basics` to get metadata
4.  Store episode list

### 4.2 Cast Extraction

-   Query `title_principals` for each episode
-   Join with `name_basics` for performer names
-   Include:
    -   Category (actor, actress, guest, self)
    -   Characters list
    -   Ordering (IMDb's cast order)

### 4.3 Crew Extraction

-   Query `title_crew` for each episode
-   Join director IDs → names
-   Join writer IDs → names

### 4.4 Ratings

-   Fetch from `title_ratings` if present

### 4.5 Summaries / Plots

IMDb datasets do not contain plot summaries.\
Fallback strategies: - Use minimal "plot outline" from `title_basics`
(if available) - Allow user to import external summaries (future
feature)

------------------------------------------------------------------------

## 5. UX Specification

### 5.1 First Run Wizard

1.  Welcome
2.  Download IMDb datasets (progress bar)
3.  Validate dataset integrity
4.  Load into DuckDB
5.  Finish → Launch main UI

### 5.2 Main UI Sections

-   **Search panel**
    -   Title input
    -   Search results list
-   **Data selection panel**
    -   Checkboxes for data categories
-   **Results pane**
    -   Episode table preview
    -   Cast preview
-   **Export panel**
    -   File format selection
    -   Export button
    -   Path selector

------------------------------------------------------------------------

## 6. App Architecture

### 6.1 High-Level Structure

    Electron Main
     ├─ Handles filesystem, dataset downloads, DuckDB initialization
     ├─ Exposes IPC API to Renderer
    Electron Renderer (React)
     ├─ UI/UX
     ├─ Search + options
     ├─ Result preview
    DuckDB Backend
     ├─ Stores IMDb data
     ├─ Executes queries

### 6.2 IPC Channels

-   `datasets.download`
-   `datasets.load`
-   `query.searchTitles`
-   `query.getEpisodes`
-   `query.getCast`
-   `query.getCrew`
-   `query.getRatings`
-   `export.generateFile`

------------------------------------------------------------------------

## 7. Development Milestones

### **Phase 1: Foundation**

-   Set up Electron + React + Vite project
-   Implement IPC bridge
-   Set up auto-update downloader
-   Basic UI shell

### **Phase 2: Dataset Integration**

-   Download IMDb datasets
-   Extract TSVs
-   Build DuckDB schema
-   Load TSVs into tables
-   Validate record counts

### **Phase 3: Query Engine**

-   Title search
-   Episode mapping
-   Cast resolution
-   Crew joins
-   Ratings lookups
-   Metadata aggregation
-   Create internal views

### **Phase 4: Export Engine**

-   CSV generation
-   Markdown generation
-   HTML template system
-   JSON builder
-   Unified export API

### **Phase 5: UI + Polishing**

-   Improved search filtering
-   Batch export progress UI
-   Error handling
-   Loading indicators

### **Phase 6: Packaging for Windows**

-   Build installer
-   Auto-updater config
-   Code signing (optional)

------------------------------------------------------------------------

## 8. Testing Strategy

### 8.1 Unit Tests

-   Parsing TSVs
-   DuckDB queries
-   IPC endpoints
-   Export format functions

### 8.2 Integration Tests

-   Full pipeline: search → retrieve → export
-   Dataset reload workflow
-   Episode/cast/crew resolution

### 8.3 UI Tests (Playwright)

-   Search workflow
-   Result previews
-   Export dialogs

### 8.4 Performance Testing

-   Query execution time
-   First-run dataset import
-   Large export operations

### 8.5 Regression Tests

-   Against specific known titles:
    -   Columbo
    -   Star Trek TNG
    -   A sample movie with no episodes

------------------------------------------------------------------------

## 9. Future Enhancements

-   Multi-series batch export
-   Offline caching of user-prepared summaries
-   Timeline visualization of cast appearances
-   Show similarity engine
-   Local plugin system for data transformers

------------------------------------------------------------------------

## 10. Questions Remaining (to clarify for final design)

1.  Should fuzzy search be enabled or opt-in?\
2.  Should users be able to import *additional* metadata (e.g.,
    Wikipedia plots)?\
3.  Should exports include images (e.g., posters via URL metadata)?\
4.  Should the app allow merging of multiple series into one output?\
5.  Should the app allow custom DuckDB queries?