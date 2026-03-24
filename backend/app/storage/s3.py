import mimetypes
from pathlib import Path

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from app.config import settings

# Initialise the S3 client using credentials from environment variables.
# boto3 reads AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION
# directly from the settings object so credentials are never hardcoded.
_s3_client = boto3.client(
    "s3",
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
    region_name=settings.aws_region,
)


def upload_file(local_path: str, s3_key: str) -> str:
    """
    Upload a local file to S3 and return its public URL.

    Args:
        local_path: Absolute or relative path to the file on disk.
        s3_key:     Destination key (path) within the S3 bucket,
                    e.g. "images/rec-slug.jpg" or "audio/rec-slug.m4a".

    Returns:
        The public HTTPS URL of the uploaded object.

    Raises:
        FileNotFoundError: If local_path does not exist.
        RuntimeError: If the S3 upload fails.
    """
    path = Path(local_path)
    if not path.exists():
        raise FileNotFoundError(f"File not found: {local_path}")

    # Detect content type from file extension so S3 serves the correct MIME type.
    # Falls back to "application/octet-stream" for unknown extensions.
    content_type, _ = mimetypes.guess_type(str(path))
    if content_type is None:
        content_type = "application/octet-stream"

    try:
        _s3_client.upload_file(
            Filename=str(path),
            Bucket=settings.aws_s3_bucket,
            Key=s3_key,
            ExtraArgs={"ContentType": content_type},
        )
    except (BotoCoreError, ClientError) as exc:
        raise RuntimeError(f"S3 upload failed for {s3_key!r}: {exc}") from exc

    return build_public_url(s3_key)


def upload_image(local_path: str, s3_key: str) -> str:
    """
    Upload an image file to S3 under the 'images/' prefix.

    Args:
        local_path: Path to the image file on disk.
        s3_key:     Key within the bucket, e.g. "images/rec-slug.jpg".

    Returns:
        Public URL of the uploaded image.
    """
    return upload_file(local_path, s3_key)


def upload_audio(local_path: str, s3_key: str) -> str:
    """
    Upload an audio file to S3 under the 'audio/' prefix.

    Args:
        local_path: Path to the audio file on disk.
        s3_key:     Key within the bucket, e.g. "audio/rec-slug.m4a".

    Returns:
        Public URL of the uploaded audio clip.
    """
    return upload_file(local_path, s3_key)


def key_exists(s3_key: str) -> bool:
    """Return True if the given key already exists in the S3 bucket."""
    try:
        _s3_client.head_object(Bucket=settings.aws_s3_bucket, Key=s3_key)
        return True
    except ClientError as e:
        if e.response["Error"]["Code"] in ("404", "NoSuchKey"):
            return False
        raise RuntimeError(f"S3 head_object failed for {s3_key!r}: {e}") from e


def build_public_url(s3_key: str) -> str:
    """
    Construct the public HTTPS URL for an object in the configured bucket.

    Format: https://<bucket>.s3.<region>.amazonaws.com/<key>
    """
    return (
        f"https://{settings.aws_s3_bucket}"
        f".s3.{settings.aws_region}.amazonaws.com"
        f"/{s3_key}"
    )
