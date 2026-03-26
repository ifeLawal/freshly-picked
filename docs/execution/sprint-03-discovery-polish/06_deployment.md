# Deployment

## Overview
This step takes the completed backend and connects it to the production infrastructure — deploying the FastAPI service to Render, wiring it to the Neon database and S3 bucket, and updating the mobile app to point at the production API URL. The goal is a fully working production environment validated end-to-end, following the project's simple, low-cost, minimal-ops deployment principles.

## Requirements
- FastAPI backend deployed to Render and publicly accessible
- All environment variables configured in Render (database URL, S3 credentials, etc.)
- Neon Postgres database connected and migrations confirmed to have run in production
- S3 bucket access confirmed working from the deployed backend
- Mobile app API base URL updated to point at the Render deployment
- End-to-end production flow tested: ingest data → API returns it → mobile app displays it

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §5 Platform Scope, §13 Deployment / Infrastructure, §14 Non-Functional Requirements

---

## Purpose
Deploy backend and connect mobile app.

## Scope
- Render deployment
- Neon DB
- S3

## Checklist
- [ ] Deploy FastAPI to Render
- [ ] Configure environment variables
- [ ] Connect Neon database
- [ ] Configure S3 access
- [ ] Update mobile API URL
- [ ] Test production flow

## Notes
🧠 Optional Add-On (Highly Recommended)
