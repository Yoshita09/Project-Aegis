from __future__ import annotations

from pathlib import Path

import cdflib
import pandas as pd
import torch

from pytorch_forecasting import (
    TimeSeriesDataSet,
)
from pytorch_forecasting.models import (
    TemporalFusionTransformer,
)

from app.agents.base import BaseAgent
from app.core.logging import logger
from app.schemas.agent_outputs import SwisOutput


class SwisAgent(BaseAgent[SwisOutput]):

    name = "swis"
    model_filename = "Agent2_SolarWind.pth"

    def load(self) -> None:

        logger.info(
            f"[{self.name}] loading TFT model"
        )

        self.loaded = True
        self.model = None

        logger.info(
            f"[{self.name}] TFT loader ready"
        )

    def predict(
        self,
        payload_path: Path
    ) -> SwisOutput:

        self._ensure_loaded()

        return self._run_safely(
            self._infer,
            payload_path
        )

    def _infer(
        self,
        payload_path: Path
    ) -> SwisOutput:

        logger.info(
            f"[{self.name}] processing "
            f"{payload_path.name}"
        )

        cdf = cdflib.CDF(
            str(payload_path)
        )

        df = pd.DataFrame({
            "proton_density":
                cdf.varget(
                    "proton_density"
                ),

            "proton_bulk_speed":
                cdf.varget(
                    "proton_bulk_speed"
                ),

            "proton_xvelocity":
                cdf.varget(
                    "proton_xvelocity"
                ),

            "proton_yvelocity":
                cdf.varget(
                    "proton_yvelocity"
                ),

            "proton_zvelocity":
                cdf.varget(
                    "proton_zvelocity"
                ),

            "proton_thermal":
                cdf.varget(
                    "proton_thermal"
                ),

            "alpha_density":
                cdf.varget(
                    "alpha_density"
                ),

            "alpha_bulk_speed":
                cdf.varget(
                    "alpha_bulk_speed"
                ),

            "alpha_thermal":
                cdf.varget(
                    "alpha_thermal"
                ),
        })

        df["density_change"] = (
            df["proton_density"].diff()
        )

        df["thermal_change"] = (
            df["proton_thermal"].diff()
        )

        df["alpha_ratio"] = (
            df["alpha_density"]
            /
            (
                df["proton_density"]
                + 1e-6
            )
        )

        df = df.fillna(0)

        df["time_idx"] = range(
            len(df)
        )

        df["series"] = 0

        df["label"] = 0

        dataset = TimeSeriesDataSet(
            df,
            time_idx="time_idx",
            target="label",
            group_ids=["series"],

            max_encoder_length=48,
            max_prediction_length=1,

            time_varying_known_reals=[
                "time_idx"
            ],

            time_varying_unknown_reals=[
                "proton_density",
                "proton_bulk_speed",
                "proton_xvelocity",
                "proton_yvelocity",
                "proton_zvelocity",
                "proton_thermal",
                "alpha_density",
                "alpha_bulk_speed",
                "alpha_thermal",
                "density_change",
                "thermal_change",
                "alpha_ratio",
            ],

            target_normalizer=None,
        )

        tft = (
            TemporalFusionTransformer
            .from_dataset(
                dataset,

                hidden_size=64,

                attention_head_size=8,

                hidden_continuous_size=32,

                dropout=0.1,

                output_size=2,
            )
        )

        weights_path = (
            self.model_dir
            / self.model_filename
        )

        state = torch.load(
            weights_path,
            map_location="cpu"
        )

        tft.load_state_dict(
            state
        )

        tft.eval()

        loader = (
            dataset.to_dataloader(
                train=False,
                batch_size=1,
                shuffle=False,
            )
        )

        batch = next(iter(loader))

        x, y = batch

        with torch.no_grad():
            raw = tft(x)

        pred = raw["prediction"]

        logger.info(
            f"[swis] prediction shape = {pred.shape}"
        )

        pred = (
            pred
            .squeeze(0)
            .squeeze(0)
            .detach()
            .cpu()
        )

        probs = torch.softmax(
            pred,
            dim=-1
        )

        logger.info(
            f"[swis] probs = {probs}"
        )

        plasma_instability = (
            probs[1].item() * 100
        )

        wind_anomaly = (
            probs[0].item() * 100
        )

        logger.info(
            f"[{self.name}] "
            f"plasma={plasma_instability:.2f} "
            f"wind={wind_anomaly:.2f}"
        )

        return SwisOutput(
            plasma_instability=
                plasma_instability,

            wind_anomaly=
                wind_anomaly,
        )