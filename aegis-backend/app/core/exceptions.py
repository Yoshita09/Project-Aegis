from __future__ import annotations


class AegisException(Exception):
    """Base class for all application-specific exceptions."""

    def __init__(self, message: str, status_code: int = 500) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class InvalidFileTypeError(AegisException):
    """Raised when an uploaded file does not have the expected extension."""

    def __init__(self, message: str = "Only .zip files are accepted.") -> None:
        super().__init__(message, status_code=400)


class FileStorageError(AegisException):
    """Raised when a file cannot be persisted to disk."""

    def __init__(self, message: str = "Failed to store uploaded file.") -> None:
        super().__init__(message, status_code=500)


class MissingPayloadError(AegisException):
    """Raised when /analyze is called before all required uploads exist."""

    def __init__(self, missing: list[str]) -> None:
        self.missing = missing
        message = (
            "Cannot run analysis. Missing required payload(s): "
            f"{', '.join(missing)}"
        )
        super().__init__(message, status_code=409)


class AgentInferenceError(AegisException):
    """Raised when an agent fails during prediction."""

    def __init__(self, agent_name: str, detail: str) -> None:
        self.agent_name = agent_name
        message = f"Agent '{agent_name}' failed during inference: {detail}"
        super().__init__(message, status_code=500)


class AgentNotLoadedError(AegisException):
    """Raised when predict() is called before load() has succeeded."""

    def __init__(self, agent_name: str) -> None:
        self.agent_name = agent_name
        message = f"Agent '{agent_name}' model is not loaded."
        super().__init__(message, status_code=503)
