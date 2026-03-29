"""
CLI entry point for ingesting recommendation data from a JSON file.

Usage:
    freshly-ingest <file> [--dry-run] [--media-dir <dir>] [--include-media] [--force-media]

Examples:
    freshly-ingest context/data/harvard_after_hours_picks.json --dry-run
    freshly-ingest context/data/harvard_after_hours_picks.json
    freshly-ingest context/data/harvard_after_hours_picks.json --media-dir context/
    freshly-ingest context/data/harvard_after_hours_picks.json --include-media
    freshly-ingest context/data/harvard_after_hours_picks.json --media-dir context/ --include-media
    freshly-ingest context/data/harvard_after_hours_picks.json --include-media --force-media
"""

import argparse
import sys
from pathlib import Path

from app.ingestion.importer import ImportSummary, run_import
from app.ingestion.loader import load_picks


def _print_record(index: int, record) -> None:
    # Display a summary line for each valid record
    print(f"\n  [{index + 1}] {record.recommendation_name}")
    print(f"      Type:    {record.recommendation_type}")
    print(f"      Host:    {record.recommended_by}")
    print(f"      Episode: {record.episode}")
    if record.episode_title:
        print(f"      Title:   {record.episode_title}")
    if record.recommendation_link:
        print(f"      Link:    {record.recommendation_link}")


def _print_invalid(entry: dict) -> None:
    raw = entry["raw"]
    # Show the record name (if present) alongside each validation error
    print(f"\n  [#{entry['index']}] {raw.get('recommendation_name', '<no name>')}")
    for err in entry["errors"]:
        loc = " → ".join(str(l) for l in err["loc"])
        print(f"      ERROR ({loc}): {err['msg']}")


def _print_summary(summary: ImportSummary, dry_run: bool) -> None:
    mode = "[DRY RUN] " if dry_run else ""
    print(f"\n{mode}Import complete")
    print(f"  Created: {summary.created}")
    print(f"  Updated: {summary.updated}")
    print(f"  Skipped: {summary.skipped}")
    if summary.errors:
        print(f"  Errors:  {len(summary.errors)}")
        for entry in summary.errors:
            print(f"    - {entry['record']}: {entry['error']}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Ingest recommendation picks from a JSON file."
    )
    parser.add_argument("file", type=Path, help="Path to the JSON picks file")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse, validate, and simulate writes without touching the database",
    )
    parser.add_argument(
        "--media-dir",
        type=Path,
        default=None,
        help="Directory containing audio/ and images/ subdirs (default: one level above the JSON file)",
    )
    parser.add_argument(
        "--include-media",
        action="store_true",
        help="Upload image and audio files to S3 (skipped by default to keep imports fast)",
    )
    parser.add_argument(
        "--force-media",
        action="store_true",
        help="Re-upload media to S3 even if the key already exists (use to replace updated files)",
    )
    args = parser.parse_args()
    args.file = args.file.resolve()  # absolute path so CWD changes don't affect resolution

    try:
        result = load_picks(args.file)
    except (FileNotFoundError, ValueError) as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

    # Prefix output with [DRY RUN] so it's clear no writes occurred
    mode = "[DRY RUN] " if args.dry_run else ""
    total = len(result.valid) + len(result.invalid)

    print(f"\n{mode}Loaded {total} records from {args.file}")
    print(f"  Valid:   {len(result.valid)}")
    print(f"  Invalid: {len(result.invalid)}")

    if result.valid:
        print(f"\n--- Valid Records ({len(result.valid)}) ---")
        for i, record in enumerate(result.valid):
            _print_record(i, record)

    if result.invalid:
        print(f"\n--- Invalid Records ({len(result.invalid)}) ---")
        for entry in result.invalid:
            # Only warn about skipping when an actual import would happen
            _print_invalid(entry)
        if not args.dry_run:
            print(
                "\nWarning: invalid records will be skipped during import.",
                file=sys.stderr,
            )

    # Resolve media dir — default to one level above the JSON file so that
    # {media_dir}/audio/ and {media_dir}/images/ are the expected subdirectories.
    # Example: JSON at context/data/picks.json → media_dir defaults to context/
    # Resolve to absolute path so relative paths survive virtualenv activation changing CWD.
    media_dir = (args.media_dir or args.file.parent.parent).resolve()

    print(f"\n{mode}Importing {len(result.valid)} records...")
    summary = run_import(result.valid, dry_run=args.dry_run, media_dir=media_dir, include_media=args.include_media, force_media=args.force_media)
    summary.skipped = len(result.invalid)  # invalid records were skipped before import
    _print_summary(summary, dry_run=args.dry_run)

    # Exit with a non-zero code if any records errored so CI can catch failures
    if summary.errors:
        sys.exit(1)

    print()


if __name__ == "__main__":
    main()
