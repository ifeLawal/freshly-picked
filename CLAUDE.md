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

- **React native start ios**: `npx expo start --ios` (runs on http://localhost:8080)
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

**IMPORTANT:** DO NOT ADD A REFERENCE TO Claude in any commit messages