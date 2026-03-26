# FreshlyPicked

A mobile application that allows listeners of the After Hours Podcast to browse, rediscover, and explore recommendations mentioned on the show—such as books, articles, restaurants, and cultural references—through a structured and searchable catalog.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards-backend.md
- @context/coding-standards-frontend.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands Frontend

- **React native start**: `npm start` (need to select the simulator)
- **React native start ios**: `npm ios` or `npx expo start --ios` (runs on http://localhost:8080)
- **Build**: 
```bash
eas build:configure
eas build --profile development-simulator --platform ios
```

## Commands Backend

- **Activate virtualenv**: `workon freshly-picked`
- **Run dev server**: `cd backend && uvicorn app.main:app --reload --port 8000`
- **Health check**: `curl http://localhost:8000/api/v1/health`
- **Install dependencies**: `pip install -e ".[dev]"`
- **New migration**: `cd backend && alembic revision --autogenerate -m "<description>"`
- **Run migrations**: `cd backend && alembic upgrade head`
- **Rollback migration**: `cd backend && alembic downgrade -1`
- **Run ingestion (dry run)**: `cd backend && freshly-ingest <path-to-json> --dry-run`
  - Example: `freshly-ingest ../context/data/harvard_after_hours_picks.json --dry-run`
- **Run ingestion**: `cd backend && freshly-ingest <path-to-json>`
  - Example: `freshly-ingest ../context/data/harvard_after_hours_picks.json`

**IMPORTANT:** DO NOT ADD A REFERENCE TO Claude in any commit messages