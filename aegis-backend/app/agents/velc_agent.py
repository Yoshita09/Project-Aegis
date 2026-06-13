from __future__ import annotations

from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
from astropy.io import fits
from torchvision import transforms
from torchvision.models import vit_b_16

from app.agents.base import BaseAgent
from app.core.logging import logger
from app.schemas.agent_outputs import VelcOutput


# ==========================================================
# MODEL ARCHITECTURE
# MUST MATCH TRAINING/COLAB EXACTLY
# ==========================================================

class VelcViT(nn.Module):

    def __init__(self):
        super().__init__()

        self.backbone = vit_b_16(weights=None)

        in_features = (
            self.backbone.heads.head.in_features
        )

        self.backbone.heads.head = nn.Sequential(
            nn.Linear(in_features, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 3),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.backbone(x)


# ==========================================================
# AGENT
# ==========================================================

class VelcAgent(BaseAgent[VelcOutput]):

    name = "velc"

    # CHANGE IF NEEDED
    model_filename = "agent_1(velc).pth"

    # ------------------------------------------------------
    # LOAD MODEL
    # ------------------------------------------------------

    def load(self) -> None:

        logger.info(
            f"[{self.name}] loading model..."
        )

        weights_path = (
            self.model_dir
            / self.model_filename
        )

        logger.info(
            f"[{self.name}] weights path = "
            f"{weights_path}"
        )

        model = VelcViT()

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

    # ------------------------------------------------------
    # PUBLIC PREDICT API
    # ------------------------------------------------------

    def predict(
        self,
        payload_path: Path
    ) -> VelcOutput:

        self._ensure_loaded()

        return self._run_safely(
            self._infer,
            payload_path
        )

    # ------------------------------------------------------
    # INTERNAL INFERENCE
    # ------------------------------------------------------

    def _infer(
        self,
        payload_path: Path
    ) -> VelcOutput:

        logger.info(
            f"[{self.name}] processing "
            f"{payload_path.name}"
        )

        # --------------------------------------------------
        # LOAD FITS
        # --------------------------------------------------

        with fits.open(
            payload_path,
            mode="readonly",
            memmap=False
        ) as hdul:

            img_data = None

            for hdu in hdul:

                if (
                    hdu.data is not None
                    and len(hdu.data.shape) >= 2
                ):
                    img_data = hdu.data.astype(
                        np.float32
                    )
                    break

            if img_data is None:

                raise RuntimeError(
                    "No image data found in FITS"
                )

        # --------------------------------------------------
        # NORMALIZATION
        # EXACTLY SAME AS COLAB
        # --------------------------------------------------

        img_min = img_data.min()
        img_max = img_data.max()

        if img_max > img_min:

            img_data = (
                img_data - img_min
            ) / (
                img_max - img_min
            )

        else:

            img_data = np.zeros_like(
                img_data
            )

        # --------------------------------------------------
        # CONVERT TO 3 CHANNELS
        # --------------------------------------------------

        img_data = np.stack(
            [img_data] * 3,
            axis=0
        )

        img_tensor = torch.tensor(
            img_data,
            dtype=torch.float32
        )

        # --------------------------------------------------
        # ViT TRANSFORMS
        # EXACTLY SAME AS COLAB
        # --------------------------------------------------

        vit_transforms = transforms.Compose([
            transforms.Resize(
                (224, 224),
                antialias=True
            ),
            transforms.Normalize(
                mean=[
                    0.485,
                    0.456,
                    0.406
                ],
                std=[
                    0.229,
                    0.224,
                    0.225
                ]
            )
        ])

        input_batch = (
            vit_transforms(
                img_tensor
            )
            .unsqueeze(0)
        )

        # --------------------------------------------------
        # PREDICTION
        # --------------------------------------------------

        with torch.no_grad():

            pred = self.model(
                input_batch
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

        # --------------------------------------------------
        # OUTPUT
        # SAME AS COLAB
        # --------------------------------------------------

        return VelcOutput(

            coronal_loop_expansion=round(float(
                pred[0] * 100
            ), 2),

            flux_rope_deformation_risk=round(float(
                pred[1] * 100
            ), 2),

            pre_eruption_signal_strength=round(float(
                pred[2] * 100
            ), 2)
        )