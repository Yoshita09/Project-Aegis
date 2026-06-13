from pathlib import Path
from fastapi import UploadFile

from app.core.exceptions import FileStorageError, InvalidFileTypeError
from app.core.logging import logger

CHUNK_SIZE = 1024 * 1024


def validate_file(filename: str | None) -> None:
    if not filename:
        raise InvalidFileTypeError("Missing filename.")

    allowed_extensions = (
        ".zip",
        ".fits",
        ".fit",
        ".cdf",
        ".nc"
    )

    if not filename.lower().endswith(allowed_extensions):
        raise InvalidFileTypeError(
            f"Invalid file '{filename}'. Accepted formats: "
            f".zip, .fits, .fit"
        )


async def save_upload(
    upload_file: UploadFile,
    destination_dir: Path
) -> Path:

    validate_file(upload_file.filename)

    destination_dir.mkdir(parents=True, exist_ok=True)

    destination_path = (
        destination_dir / upload_file.filename
    )

    try:
        with destination_path.open("wb") as buffer:
            while chunk := await upload_file.read(CHUNK_SIZE):
                buffer.write(chunk)

    except Exception as exc:
        logger.exception(
            f"Failed to store upload at {destination_path}"
        )
        raise FileStorageError(str(exc)) from exc

    finally:
        await upload_file.close()

    logger.info(f"Stored upload: {destination_path}")

    return destination_path

def latest_payload(destination_dir: Path) -> Path | None:
    if not destination_dir.exists():
        return None

    files = sorted(
        destination_dir.glob("*"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )

    return files[0] if files else None