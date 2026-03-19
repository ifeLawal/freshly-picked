# Database Setup

## Overview
This step establishes the Postgres connection and sets up the foundational database tooling the rest of the backend depends on. The goal is a working Neon connection, a configured SQLModel engine, and Alembic initialized with a first successful migration — giving every subsequent step a reliable place to read and write data.

## Requirements
- Neon Postgres instance provisioned and connection string available
- SQLModel engine configured and connected
- Alembic initialized with `env.py` pointing at SQLModel metadata
- First migration created and confirmed to run without error
- Database session exposed as a FastAPI dependency for use in routes

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §5 Platform Scope, §11 Backend Architecture, §13 Deployment / Infrastructure

---

## Purpose
Set up Postgres connection and initial schema using SQLModel + Alembic.

## Scope
- Neon connection
- SQLModel config
- Alembic setup

## Checklist
- [ ] Connect to Neon Postgres
- [ ] Configure SQLModel engine
- [ ] Initialize Alembic
- [ ] Create first migration
- [ ] Validate migration runs successfully
- [ ] Add DB session dependency

## Notes