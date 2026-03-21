import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from pydantic import ValidationError

from app.ingestion.schemas import PickRecord


@dataclass
class LoadResult:
    # Successfully validated records ready for further processing
    valid: list[PickRecord] = field(default_factory=list)
    # Records that failed validation, kept for reporting — each entry holds the original index, raw dict, and Pydantic errors
    invalid: list[dict[str, Any]] = field(default_factory=list) # {"index": int, "raw": dict, "errors": list}


def load_picks(file_path: Path) -> LoadResult:
    """Load and validate recommendation records from a JSON file."""
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    with open(file_path, "r", encoding="utf-8") as f:
        try:
            raw_records = json.load(f)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in {file_path}: {e}")

    # The source file must be a top-level array of record objects
    if not isinstance(raw_records, list):
        raise ValueError(f"Expected a JSON array at the top level, got {type(raw_records).__name__}")

    result = LoadResult()

    for i, raw in enumerate(raw_records):
        try:
            # Validate each record against the PickRecord schema
            record = PickRecord.model_validate(raw)
            result.valid.append(record)
        except ValidationError as e:
            # Store the original index so the CLI can report which record failed
            result.invalid.append({
                "index": i,
                "raw": raw,
                "errors": e.errors(include_url=False),
            })

    return result
