from __future__ import annotations

"""
Inference abstraction layer.

This module is the designated home for future real model-loading and
inference logic (PyTorch `.pth` files, pickled sklearn/xgboost models,
etc.). Agents currently operate in mock mode and do NOT depend on this
module yet, but it is structured so each agent's `load()` /
`_infer()` can delegate here without further restructuring.

Example future usage inside `VelcAgent.load()`:

    from app.services.inference import load_torch_model

    def load(self) -> None:
        self.model = load_torch_model(self.model_dir / self.model_filename)
        self.loaded = True
"""

from pathlib import Path
from typing import Any

from app.core.logging import logger


def load_torch_model(weights_path: Path, map_location: str = "cpu") -> Any:
    """
    Load a PyTorch model checkpoint from disk.

    Args:
        weights_path: Path to a `.pth` file (possibly extracted from a
            `.pth.zip` archive).
        map_location: Device to map tensors to on load.

    Returns:
        The loaded model/state object.

    Raises:
        FileNotFoundError: if `weights_path` does not exist.

    NOTE: This is a thin wrapper placeholder. The actual model class
    must be constructed and have `load_state_dict` called explicitly
    once the architecture for each agent is finalized.
    """
    if not weights_path.exists():
        raise FileNotFoundError(f"Model weights not found at {weights_path}")

    import torch  # local import keeps startup fast when unused

    logger.info(f"Loading torch checkpoint from {weights_path}")
    return torch.load(weights_path, map_location=map_location)


def load_pickle_model(weights_path: Path) -> Any:
    """
    Load a pickled model (e.g. `agent4_complete.pkl`).

    Args:
        weights_path: Path to a `.pkl` file.

    Returns:
        The unpickled object.

    Raises:
        FileNotFoundError: if `weights_path` does not exist.
    """
    if not weights_path.exists():
        raise FileNotFoundError(f"Model file not found at {weights_path}")

    import pickle  # local import keeps startup fast when unused

    logger.info(f"Loading pickle model from {weights_path}")
    with weights_path.open("rb") as f:
        return pickle.load(f)
