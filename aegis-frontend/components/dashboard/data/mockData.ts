export const agents = [
  {
    id: "AGENT 1",
    name: "Solar Vision Agent",
    desc: "Analyzes VELC coronagraph images for coronal loop inflation, arc instability, and flux rope formation.",
    model: "ViT + Temporal Transformer",
    modelColor: "#38bdf8",
    status: "active",
    metrics: [
      { label: "Loop Expansion", value: 82, color: "#ef4444" },
      { label: "Flux Rope Prob.", value: 74, color: "#f59e0b" },
      { label: "Eruption Signal", value: 79, color: "#f59e0b" },
    ],
  },

  {
    id: "AGENT 2",
    name: "Solar Wind Agent",
    desc: "Processes SWIS-ASPEX particle data to detect plasma disturbances and velocity anomalies.",
    model: "LSTM / TFT",
    modelColor: "#38bdf8",
    status: "active",
    metrics: [
      { label: "Plasma Instability", value: 81, color: "#ef4444" },
      { label: "Wind Anomaly", value: 72, color: "#f59e0b" },
    ],
  },

  {
    id: "AGENT 3",
    name: "Magnetic Stress Agent",
    desc: "Analyzes magnetometer Bx/By/Bz/Bt vectors for reconnection and field twisting signatures.",
    model: "Transformer Encoder",
    modelColor: "#38bdf8",
    status: "active",
    metrics: [
      { label: "Magnetic Stress", value: 89, color: "#ef4444" },
      { label: "Reconnection Prob.", value: 84, color: "#ef4444" },
    ],
  },

  {
    id: "AGENT 4",
    name: "Knowledge Agent",
    desc: "Compares current signatures against SOHO CME Catalog, NASA CDAWeb and NOAA SWPC archives.",
    model: "RAG + LLM",
    modelColor: "#38bdf8",
    status: "active",
    metrics: [
      { label: "Historical Match", value: 86, color: "#ef4444" },
      { label: "Pattern Confidence", value: 78, color: "#f59e0b" },
    ],
  },
];
export const solarWindData = [
  { t: "01:05", v: 420 },
  { t: "01:06", v: 390 },
  { t: "01:07", v: 540 },
  { t: "01:08", v: 410 },
  { t: "01:09", v: 510 },
  { t: "01:10", v: 430 },
  { t: "01:11", v: 560 },
];

export const bzData = [
  { t: "01:05", v: -3 },
  { t: "01:06", v: 0 },
  { t: "01:07", v: 4 },
  { t: "01:08", v: -2 },
  { t: "01:09", v: 6 },
  { t: "01:10", v: -1 },
  { t: "01:11", v: 8 },
];

export const protonData = [
  { t: "01:05", v: 5 },
  { t: "01:06", v: 6 },
  { t: "01:07", v: 4 },
  { t: "01:08", v: 10 },
  { t: "01:09", v: 5 },
  { t: "01:10", v: 9 },
  { t: "01:11", v: 11 },
];