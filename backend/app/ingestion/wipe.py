"""
CLI script to wipe all ingested data from the database.

Truncates all tables in FK-safe order and resets identity sequences.
Useful for a clean re-import when source data has changed significantly.

Usage:
    freshly-wipe [--confirm]

Examples:
    freshly-wipe --confirm
"""

import argparse
import asyncio
import sys

from sqlalchemy import text

from app.db import AsyncSessionLocal


async def _run() -> None:
    async with AsyncSessionLocal() as session:
        await session.execute(
            text(
                "TRUNCATE recommendation_tags, recommendations, tags, episodes, hosts, categories "
                "RESTART IDENTITY CASCADE"
            )
        )
        await session.commit()
        print("All tables wiped and sequences reset.")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Wipe all ingested data from the database."
    )
    parser.add_argument(
        "--confirm",
        action="store_true",
        help="Required flag to confirm the destructive operation",
    )
    args = parser.parse_args()

    if not args.confirm:
        print("Error: pass --confirm to proceed. This will delete all data.", file=sys.stderr)
        sys.exit(1)

    asyncio.run(_run())


if __name__ == "__main__":
    main()
