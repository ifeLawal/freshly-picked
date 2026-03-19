# S3 Setup

## Overview
This step wires up AWS S3 as the media storage layer for recommendation images and audio clips. The goal is a configured bucket, working credentials, and a reusable upload helper that returns public URLs — giving the ingestion pipeline a reliable place to store and reference media files.

## Requirements
- AWS S3 bucket created and accessible
- Credentials configured via environment variables (not hardcoded)
- Upload helper function built and importable by the ingestion layer
- Helper supports both image and audio file uploads
- Public URLs returned after successful upload and usable as `image_url` / `audio_clip_url` values on recommendations

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §5 Platform Scope, §6 System Architecture, §11 Backend Architecture, §12 Ingestion Workflow, §13 Deployment / Infrastructure
- @context/audio
- @context/images

---

## Purpose
Enable media storage for images and audio.

## Scope
- AWS S3 bucket
- Upload helper
- URL generation

## Checklist
- [ ] Create S3 bucket
- [ ] Configure credentials
- [ ] Build upload helper
- [ ] Test image upload
- [ ] Test audio upload
- [ ] Return public URLs

## Notes