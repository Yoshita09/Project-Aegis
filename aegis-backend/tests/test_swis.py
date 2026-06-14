import torch
import pandas as pd
import cdflib

from pytorch_forecasting import TimeSeriesDataSet
from pytorch_forecasting.models import TemporalFusionTransformer

# yahan apni real CDF file ka path daalna
cdf = cdflib.CDF(
    "/Users/yoshitasinghal/Downloads/swis_2026Jun09T210408548/AL1_ASW91_L2_BLK_20260607_UNP_9999_999999_V02.cdf"
)

# dataframe create
df = pd.DataFrame({
    "proton_density": cdf.varget("proton_density"),
    "proton_bulk_speed": cdf.varget("proton_bulk_speed"),
    "proton_xvelocity": cdf.varget("proton_xvelocity"),
    "proton_yvelocity": cdf.varget("proton_yvelocity"),
    "proton_zvelocity": cdf.varget("proton_zvelocity"),
    "proton_thermal": cdf.varget("proton_thermal"),
    "alpha_density": cdf.varget("alpha_density"),
    "alpha_bulk_speed": cdf.varget("alpha_bulk_speed"),
    "alpha_thermal": cdf.varget("alpha_thermal"),
})

df["density_change"] = df["proton_density"].diff()
df["thermal_change"] = df["proton_thermal"].diff()
df["alpha_ratio"] = (
    df["alpha_density"] /
    (df["proton_density"] + 1e-6)
)

df = df.fillna(0)

df["time_idx"] = range(len(df))
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

    target_normalizer=None
)

tft = TemporalFusionTransformer.from_dataset(
    dataset,
    hidden_size=64,
    attention_head_size=8,
    hidden_continuous_size=32,
    dropout=0.1,
    output_size=2,
)

state = torch.load(
    "../app/models/Agent2_SolarWind.pth",
    map_location="cpu"
)

missing, unexpected = tft.load_state_dict(
    state,
    strict=False
)

print("MODEL LOADED SUCCESSFULLY")

print("Missing:")
print(missing)

print("Unexpected:")
print(unexpected)