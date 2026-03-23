"""
CLI script to remove orphaned rows left behind after re-ingestion.

Orphaned recommendations: rows whose external_source_id no longer matches
any record in the source JSON (e.g. after a field correction shifts the hash).

Orphaned episodes: episode rows that have no recommendations pointing to them
after orphaned recommendations are removed.

Usage:
    freshly-cleanup <path-to-json> [--dry-run]

Examples:
    freshly-cleanup context/data/harvard_after_hours_picks.json --dry-run
    freshly-cleanup context/data/harvard_after_hours_picks.json
"""

import argparse
import asyncio
import hashlib
import json
import sys
from pathlib import Path

from sqlalchemy import select

from app.db import AsyncSessionLocal
from app.models.episode import Episode
from app.models.recommendation import Recommendation


def _build_external_source_id(rec: dict) -> str:
    # Must match the same derivation used in importer.py
    key = ":".join([
        rec["recommendation_name"].strip().lower(),
        rec["recommended_by"].strip().lower(),
        rec["episode"].strip().lower(),
    ])
    return hashlib.sha256(key.encode()).hexdigest()[:16]


async def _run(json_path: Path, dry_run: bool) -> None:
    with open(json_path, "r", encoding="utf-8") as f:
        records = json.load(f)

    # Build the set of external_source_ids that are valid in the current JSON
    valid_ids = {_build_external_source_id(r) for r in records}

    async with AsyncSessionLocal() as session:
        # --- Orphaned recommendations ---
        all_recs = (await session.execute(select(Recommendation))).scalars().all()
        orphaned_recs = [r for r in all_recs if r.external_source_id not in valid_ids]

        print(f"\nOrphaned recommendations: {len(orphaned_recs)}")
        for r in orphaned_recs:
            print(f"  - [{r.external_source_id}] {r.title}")

        if not dry_run:
            for r in orphaned_recs:
                await session.delete(r)
            await session.flush()

        # --- Orphaned episodes (no remaining recommendations) ---
        # Re-check after flush so deletions above are reflected
        episode_ids_with_recs = set(
            (await session.execute(select(Recommendation.episode_id).distinct())).scalars().all()
        )
        all_episodes = (await session.execute(select(Episode))).scalars().all()
        orphaned_eps = [e for e in all_episodes if e.id not in episode_ids_with_recs]

        print(f"\nOrphaned episodes: {len(orphaned_eps)}")
        for e in orphaned_eps:
            print(f"  - {e.slug}")

        if not dry_run:
            for e in orphaned_eps:
                await session.delete(e)
            await session.commit()
            print("\nCleanup complete.")
        else:
            await session.rollback()
            print("\n[DRY RUN] No changes written.")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Remove orphaned recommendations and episodes from the database."
    )
    parser.add_argument("file", type=Path, help="Path to the source JSON picks file")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be deleted without writing anything",
    )
    args = parser.parse_args()
    args.file = args.file.resolve()

    if not args.file.exists():
        print(f"Error: file not found: {args.file}", file=sys.stderr)
        sys.exit(1)

    asyncio.run(_run(args.file, args.dry_run))


if __name__ == "__main__":
    main()
