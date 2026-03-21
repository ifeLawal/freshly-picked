# Ingestion CLI (Base)

## Overview
This step creates the CLI entry point for importing recommendation data from JSON. The goal is a working script that can load a JSON file, validate its structure, and print parsed records — establishing the foundation the full ingestion pipeline (database writes, media uploads) will build on in later steps.

## Requirements
- CLI script created with a clearly defined entry point
- Loads a JSON file passed as an argument
- Validates the structure of each record against expected fields
- Prints parsed records to stdout for inspection
- Dry-run flag implemented that parses and validates without writing anything

## References
- Project Overview: `freshly-picked-project-overview.md`
- Relevant sections: §11 Backend Architecture, §12 Ingestion Workflow
- @context/audio
- @context/images
- @context/data/harvard_after_hours_picks.json

---

## Purpose
Create CLI entry point for importing recommendation data.

## Scope
- CLI command
- JSON parsing
- Basic validation

## Checklist
- [ ] Create CLI script
- [ ] Load JSON file
- [ ] Validate structure
- [ ] Print parsed records
- [ ] Add dry-run flag

## Notes