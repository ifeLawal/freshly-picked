"""
CLI entry point for ingesting recommendation data from a JSON file.

Usage:
    freshly-ingest <file> [--dry-run]

Examples:
    freshly-ingest context/data/harvard_after_hours_picks.json
    freshly-ingest context/data/harvard_after_hours_picks.json --dry-run
"""

import argparse
import sys
from pathlib import Path

from app.ingestion.loader import load_picks


def print_record(index: int, record) -> None:
    # Display a summary line for each valid record
    print(f"\n  [{index + 1}] {record.recommendation_name}")
    print(f"      Type:    {record.recommendation_type}")
    print(f"      Host:    {record.recommended_by}")
    print(f"      Episode: {record.episode}")
    if record.episode_title:
        print(f"      Title:   {record.episode_title}")
    if record.recommendation_link:
        print(f"      Link:    {record.recommendation_link}")


def print_invalid(entry: dict) -> None:
    raw = entry["raw"]
    # Show the record name (if present) alongside each validation error
    print(f"\n  [#{entry['index']}] {raw.get('recommendation_name', '<no name>')}")
    for err in entry["errors"]:
        loc = " → ".join(str(l) for l in err["loc"])
        print(f"      ERROR ({loc}): {err['msg']}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Ingest recommendation picks from a JSON file."
    )
    parser.add_argument("file", type=Path, help="Path to the JSON picks file")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse and validate without writing anything",
    )
    args = parser.parse_args()

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
            print_record(i, record)

    if result.invalid:
        print(f"\n--- Invalid Records ({len(result.invalid)}) ---")
        for entry in result.invalid:
            print_invalid(entry)
        # Only warn about skipping when an actual import would happen
        if not args.dry_run:
            print(
                "\nWarning: invalid records will be skipped during import.",
                file=sys.stderr,
            )

    print()


if __name__ == "__main__":
    main()
