# Freshly Picked Mobile Application — Project Overview

---

# 1. Project Summary

**Freshly Picked** is a mobile application that allows listeners of the After Hours Podcast to browse, rediscover, and explore recommendations mentioned on the show—such as books, articles, restaurants, and cultural references—through a structured and searchable catalog.

The application transforms scattered podcast recommendations into a centralized discovery experience where users can quickly find past suggestions, understand their context, and revisit them later.

The primary users are listeners of the After Hours Podcast who want an easier way to revisit recommendations from past episodes. Secondary users include people seeking curated recommendations across topics.

---

# 2. Problem Definition

Listeners frequently forget recommendations mentioned during episodes and lack a reliable way to track or revisit them.

Current limitations:

* No structured tracking system
* Difficult to recall which episode a recommendation came from
* No way to track what has been tried or saved

The core problem:

**Transforming an unstructured archive of podcast recommendations into a structured, searchable, and trackable discovery experience.**

---

# 3. User Personas

## Primary: Podcast Listener

* Wants to rediscover recommendations
* Wants to track what they've consumed
* Values speed and simplicity

## Secondary: Casual Explorer

* Browses recommendations by category or topic
* Less focused on tracking

### Core Capabilities

* Mark as liked or completed
* Create lists
* Filter by host, category, tags, title

---

# 4. Core Features (MVP)

## Recommendation Catalog

* ~500+ recommendations
* Dynamic backend-driven dataset

## Recommendation Detail

* Title, host, episode
* Why recommended
* External link
* Optional image and audio clip

## Tracking

* Liked
* Completed

## Lists

* Favorites
* Completed
* Custom lists

## Discovery

* Filtering by host, category, tags
* Search (fuzzy + keyword)

---

# 5. Platform Scope

* React Native mobile app (Expo)
* FastAPI backend
* Postgres (Neon)
* AWS S3 (media storage)
* CLI ingestion system

---

# 6. System Architecture

### Components

* Mobile client (React Native)
* FastAPI backend
* Postgres database
* S3 object storage

### Data Ownership

* Backend: catalog data
* Device: user interactions

### Media

* Optional image
* Optional audio clip
* Optional timestamps

---

# 7. Functional Requirements

## Navigation

* Home
* Episodes
* Search
* Lists
* Settings

## Key Behaviors

* Browse all recommendations
* Search and filter
* View recommendation detail
* Track and organize recommendations
* Play audio clips (if available)

## Offline

* Local interactions supported
* Catalog requires network

---

# 8. Data Model

## Core Entities

* Recommendation
* Host
* Episode
* Category
* Tag
* RecommendationTag

## Recommendation Fields

* id
* slug
* external_source_id
* title
* why_recommended
* external_url
* host_id
* episode_id
* category_id
* image_url (optional)
* audio_clip_url (optional)
* audio_start_seconds (optional)
* audio_end_seconds (optional)

---

# 9. API Design

## Core Endpoint

### GET /api/v1/recommendations

Supports:

* host
* category
* tag
* episode
* search
* ids (comma-separated)

### Batch Fetch Example

GET /api/v1/recommendations?ids=12,45,92

## Other Endpoints

* GET /recommendations/{id}
* GET /episodes
* GET /episodes/{id}/recommendations
* GET /hosts
* GET /categories
* GET /tags

---

# 10. Mobile Architecture

## Stack

* Expo
* React Navigation
* React Query
* Zustand
* AsyncStorage
* Expo AV

## Layers

* app
* navigation
* screens
* components
* services
* state
* storage
* hooks
* models

## Data Strategy

* React Query → server data
* Zustand → UI state
* AsyncStorage → persistence

---

# 11. Backend Architecture

## Stack

* FastAPI
* SQLModel
* Alembic
* Postgres
* AWS S3

## Layers

* API
* Services
* Repositories
* Models
* Schemas
* Storage
* Ingestion
* CLI

## Ingestion

* JSON-based
* CLI-driven
* Upsert logic

---

# 12. Ingestion Workflow

## Input

* JSON metadata
* image files
* audio files

## Key Features

* Upsert via external_source_id
* Validation
* Media upload to S3
* Tag creation

## CLI Features

* Dry run
* Confirmation
* Import summary

## Fallback Image

* Global default image

---

# 13. Deployment / Infrastructure

## Stack

* Render (backend)
* Neon (Postgres)
* AWS S3 (media)

## Environments

* local
* production

## Principles

* simple
* low-cost
* minimal ops

---

# 14. Non-Functional Requirements

MVP intentionally excludes:

* performance SLAs
* authentication
* observability systems
* backup strategy
* protected media access

Primary focus:

* maintainability
* simplicity
* correctness

---

# 15. MVP Scope

## Included

* recommendation browsing
* search + filtering
* detail views
* local tracking
* lists
* audio playback
* ingestion pipeline

## Excluded

* user accounts
* social features
* recommendation engine
* admin UI
* offline catalog
* advanced media features
* observability

---

# MVP Philosophy

Build a **clean, functional foundation** that delivers value quickly while enabling future expansion without rework.

---
