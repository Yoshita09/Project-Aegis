from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from netCDF4 import Dataset

from app.agents.base import BaseAgent
from app.core.logging import logger
from app.schemas.agent_outputs import MagOutput


SEQ_LENGTH = 120


# =====================================================
# MODEL
# =====================================================

class MagneticTransformer(nn.Module):

    def __init__(self):
        super().__init__()

        self.input_projection = nn.Linear(
            4,
            64
        )

        self.pos_encoder = nn.Parameter(
            torch.zeros(
                1,
                SEQ_LENGTH,
                64
            )
        )

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=64,
            nhead=4,
            dim_feedforward=256,
            dropout=0.1,
            batch_first=True,
            norm_first=True
        )

        self.transformer_encoder = nn.TransformerEncoder(
            encoder_layer,
            num_layers=2
        )

        self.regression_head = nn.Sequential(
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 2),
            nn.Sigmoid()
        )

    def forward(self, x):

        x = (
            self.input_projection(x)
            + self.pos_encoder
        )

        x = self.transformer_encoder(x)

        x = torch.mean(
            x,
            dim=1
        )

        return self.regression_head(x)


# =====================================================
# AGENT
# =====================================================

class MagAgent(BaseAgent[MagOutput]):

    name = "mag"

    model_filename = (
        "agent_3(magnetic).pth"
    )

    # -------------------------------------------------
    # LOAD MODEL
    # -------------------------------------------------

    def load(self) -> None:

        logger.info(
            f"[{self.name}] loading model"
        )

        weights_path = (
            self.model_dir
            / self.model_filename
        )

        logger.info(
            f"[{self.name}] weights path = "
            f"{weights_path}"
        )

        model = MagneticTransformer()

        state_dict = torch.load(
            weights_path,
            map_location="cpu"
        )

        model.load_state_dict(
            state_dict
        )

        model.eval()

        self.model = model
        self.loaded = True

        logger.info(
            f"[{self.name}] model loaded"
        )

    # -------------------------------------------------
    # PUBLIC API
    # -------------------------------------------------

    def predict(
        self,
        payload_path: Path
    ) -> MagOutput:

        self._ensure_loaded()

        return self._run_safely(
            self._infer,
            payload_path
        )

    # -------------------------------------------------
    # INFERENCE
    # -------------------------------------------------

    def _infer(
        self,
        payload_path: Path
    ) -> MagOutput:

        logger.info(
            f"[{self.name}] processing "
            f"{payload_path.name}"
        )

        with Dataset(
            payload_path,
            mode="r"
        ) as nc_file:

            raw_keys = list(
                nc_file.variables.keys()
            )

            # SAME LOGIC AS COLAB

            bx_key = next(
                (
                    k for k in raw_keys
                    if "bx" in k.lower()
                ),
                None
            )

            by_key = next(
                (
                    k for k in raw_keys
                    if "by" in k.lower()
                ),
                None
            )

            bz_key = next(
                (
                    k for k in raw_keys
                    if "bz" in k.lower()
                ),
                None
            )

            if (
                bx_key is None
                or by_key is None
                or bz_key is None
            ):
                raise RuntimeError(
                    "Could not locate BX/BY/BZ variables"
                )

            bx = np.array(
                nc_file.variables[bx_key][:]
            ).astype(np.float32)

            by = np.array(
                nc_file.variables[by_key][:]
            ).astype(np.float32)

            bz = np.array(
                nc_file.variables[bz_key][:]
            ).astype(np.float32)

        # =================================================
        # SAME FEATURE ENGINEERING AS COLAB
        # =================================================

        bt = np.sqrt(
            bx**2 +
            by**2 +
            bz**2
        )

        df = pd.DataFrame({
            "bx": bx,
            "by": by,
            "bz": bz,
            "bt": bt
        })

        # SAME NORMALIZATION AS TEST CELL

        for col in [
            "bx",
            "by",
            "bz",
            "bt"
        ]:

            cmin = df[col].min()
            cmax = df[col].max()

            df[col] = (
                df[col] - cmin
            ) / (
                cmax - cmin + 1e-8
            )

        features = df[
            [
                "bx",
                "by",
                "bz",
                "bt"
            ]
        ].values

        # SAME AS COLAB

        if len(features) < SEQ_LENGTH:

            pad = np.zeros(
                (
                    SEQ_LENGTH
                    - len(features),
                    4
                ),
                dtype=np.float32
            )

            features = np.vstack([
                features,
                pad
            ])

        sequence = features[
            :SEQ_LENGTH
        ]

        x = torch.tensor(
            sequence,
            dtype=torch.float32
        ).unsqueeze(0)

        # =================================================
        # PREDICTION
        # =================================================

        with torch.no_grad():

            pred = self.model(
                x
            )

        pred = (
            pred.squeeze()
            .cpu()
            .numpy()
        )

        logger.info(
            f"[{self.name}] RAW PRED = "
            f"{pred}"
        )
        
        # =================================================
        # OUTPUT
        # =================================================

        return MagOutput(
            magnetic_stress=float(pred[0]),
            reconnection_probability=float(pred[1]),
        )
        