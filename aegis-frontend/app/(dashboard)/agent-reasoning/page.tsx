"use client";

import Topbar from "@/components/Topbar";
import { Panel, ProgressBar } from "@/components/ui";
import {
  Eye,
  Wind,
  Magnet,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Database,
  Image as ImageIcon,
  SlidersHorizontal,
  Box,
  Brain,
  ScanSearch,
  BarChart3,
  Target,
  LucideIcon,
} from "lucide-react";

interface AgentOutput {
  label: string;
  value: number;
}

interface Agent {
  name: string;
  sub: string;
  icon: LucideIcon;
  color: string;
  dataSource: string;
  purpose: string;
  detects: string[];
  outputs: AgentOutput[];
  tagColor: string;
  barColor: string;
}

const agents: Agent[] = [
  {
    name: "Solar Wind Agent",
    sub: "LSTM + Temporal Fusion Transformer (TFT)",
    icon: Wind,
    color: "text-cyan-400 border-cyan-500/30",
    dataSource: "SWIS-ASPEX Particle Analyzer",
    purpose:
      "Processes time-series particle data to identify plasma disturbances preceding CME eruptions.",
    detects: [
      "Plasma disturbances",
      "Velocity spikes",
      "Density enhancement",
      "Proton flux surges",
    ],
    outputs: [
      { label: "Plasma Instability", value: 78 },
      { label: "Wind Anomaly", value: 78 },
    ],
    tagColor:
      "bg-cyan-950/30 border-cyan-500/30 text-cyan-400",
    barColor: "bg-cyan-400",
  },

  {
    name: "Magnetic Stress Agent",
    sub: "Transformer Encoder",
    icon: Magnet,
    color: "text-purple-400 border-purple-500/30",
    dataSource: "Aditya-L1 Magnetometer",
    purpose:
      "Analyzes magnetic field vector components to detect reconnection events and flux rope signatures.",
    detects: [
      "Magnetic reconnection",
      "Flux rope signatures",
      "Field line twisting",
      "Southward Bz excursion",
    ],
    outputs: [
      { label: "Magnetic Stress", value: 92 },
      { label: "Reconnection Prob.", value: 87 },
    ],
    tagColor:
      "bg-purple-950/30 border-purple-500/30 text-purple-400",
    barColor: "bg-purple-400",
  },

  {
    name: "Knowledge Agent",
    sub: "RAG (Retrieval-Augmented Generation) + LLM",
    icon: BookOpen,
    color: "text-emerald-400 border-emerald-500/30",
    dataSource:
      "SOHO CME Catalog · NASA CDAWeb · NOAA SWPC · Aditya-L1 Archives",
    purpose:
      "Compares current multi-sensor signatures against historical CME events to compute similarity scores.",
    detects: [
      "Historical pattern matching",
      "Event classification",
      "Severity estimation",
      "Contextual reasoning",
    ],
    outputs: [{ label: "Historical Match", value: 82 }],
    tagColor:
      "bg-emerald-950/30 border-emerald-500/30 text-emerald-400",
    barColor: "bg-emerald-400",
  },
];

const pipelineSteps = [
  {
    name: "VELC ZIP",
    icon: Database,
    color: "text-amber-400",
  },
  {
    name: "Extract Solar Images",
    icon: ImageIcon,
    color: "text-emerald-400",
  },
  {
    name: "Preprocess + Resize + Normalize",
    icon: SlidersHorizontal,
    color: "text-cyan-400",
  },
  {
    name: "ViT Patch Embedding",
    icon: Box,
    color: "text-purple-400",
  },
  {
    name: "Transformer Encoder",
    icon: Brain,
    color: "text-purple-400",
  },
  {
    name: "Self-Attention",
    icon: ScanSearch,
    color: "text-cyan-400",
  },
  {
    name: "Feature Extraction",
    icon: BarChart3,
    color: "text-blue-400",
  },
  {
    name: "Prediction Head",
    icon: Target,
    color: "text-red-400",
  },
  {
    name: "VELC Results",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
];

const formulas = [
  {
    number: "01",
    title: "Coronal Loop Expansion Rate",
    formula: "CLE = (ΔA_loop / A₀) × 100",
    where: [
      "A₀ = Initial coronal-loop area",
      "ΔA_loop = Change in loop area",
      "CLE = Percentage of loop expansion",
    ],
    explanation:
      "Measures how much coronal loops expand over time.",
    color: "amber",
  },
  {
    number: "02",
    title: "Flux Rope Deformation Risk",
    formula: "FRD = (Δκ_rope / κ₀) × 100",
    where: [
      "κ₀ = Initial flux-rope curvature",
      "Δκ_rope = Change in flux-rope curvature",
      "FRD = Deformation-risk score",
    ],
    explanation:
      "Quantifies the deformation risk due to changes in flux-rope curvature.",
    color: "red",
  },
  {
    number: "03",
    title: "Pre-Eruption Signal Strength",
    formula: "PSS = (ΔI / I_base) × 100",
    where: [
      "I_base = Baseline image intensity",
      "ΔI = Change in observed intensity",
      "PSS = Pre-eruption signal strength",
    ],
    explanation:
      "Indicates the intensity of pre-eruption signals from changes in image brightness.",
    color: "purple",
  },
];

function colorClasses(color: string) {
  const map: Record<
    string,
    {
      border: string;
      text: string;
      bg: string;
      softBorder: string;
    }
  > = {
    amber: {
      border: "border-amber-500/30",
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      softBorder: "border-amber-500/20",
    },

    cyan: {
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      bg: "bg-cyan-500/10",
      softBorder: "border-cyan-500/20",
    },

    red: {
      border: "border-red-500/30",
      text: "text-red-400",
      bg: "bg-red-500/10",
      softBorder: "border-red-500/20",
    },

    purple: {
      border: "border-purple-500/30",
      text: "text-purple-400",
      bg: "bg-purple-500/10",
      softBorder: "border-purple-500/20",
    },

    emerald: {
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      softBorder: "border-emerald-500/20",
    },
  };

  // Prevent undefined crashes during hot reload / unexpected color values
  return (
    map[color] ?? {
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      bg: "bg-cyan-500/10",
      softBorder: "border-cyan-500/20",
    }
  );
}

function SolarVisionAgent() {
  return (
    <div className="rounded-2xl border border-amber-500/20 bg-[#080f1d] overflow-hidden">
      {/* ================= AGENT HEADER ================= */}
      <div className="px-6 py-5 border-b border-slate-800/80">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-amber-400" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-amber-400">
                  Solar Vision Agent
                </h2>

                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1">
                Vision Transformer (ViT) + CNN + Temporal Transformer
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-[9px] tracking-[0.2em] text-slate-600">
              DATA SOURCE
            </p>

            <p className="text-sm text-slate-300 mt-1">
              VELC Coronagraph Images
            </p>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-6">

        {/* PURPOSE */}
        <div className="mb-6">
          <p className="text-[10px] tracking-[0.18em] text-slate-500 mb-2">
            PURPOSE
          </p>

          <p className="text-sm leading-6 text-slate-400">
            Analyzes high-resolution coronagraph images to detect visual
            precursors of CME formation.
          </p>
        </div>


        {/* =====================================================
            PIPELINE + METRICS
        ====================================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-[0.58fr_1.48fr] gap-6 items-stretch">


          {/* ================= PROCESSING PIPELINE ================= */}
          <div className="rounded-xl border border-slate-800 bg-[#060c18] p-5 h-full flex flex-col">

            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold tracking-wide text-cyan-400">
                  PROCESSING PIPELINE
                </h3>

                <p className="text-[10px] text-slate-600 mt-1">
                  VELC image intelligence flow
                </p>
              </div>

              <span className="text-[9px] px-2 py-1 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                ONLINE
              </span>
            </div>


            {/* Pipeline */}
            <div className="flex-1 flex flex-col justify-between">

              {pipelineSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.name}>

                    {/* Step */}
                    <div
                      className="
                        flex items-center gap-3
                        min-h-[42px]
                        px-3
                        rounded-lg
                        border border-slate-800
                        bg-[#091221]
                        hover:border-slate-700
                        transition-all
                      "
                    >

                      {/* Icon */}
                      <div
                        className={`
                          w-7 h-7
                          shrink-0
                          rounded-md
                          bg-slate-900
                          border border-slate-800
                          flex items-center justify-center
                          ${step.color}
                        `}
                      >
                        <Icon size={15} />
                      </div>


                      {/* Name */}
                      <span className="text-xs text-slate-300">
                        {step.name}
                      </span>


                      {/* Ready */}
                      {index === pipelineSteps.length - 1 && (
                        <span className="ml-auto text-[9px] text-emerald-400">
                          READY
                        </span>
                      )}

                    </div>


                    {/* Connector */}
                    {index !== pipelineSteps.length - 1 && (
                      <div className="flex justify-center h-4">
                        <div className="w-px bg-cyan-500/30 relative">

                          <span className="absolute -bottom-1 -left-[3px] text-[8px] text-cyan-500">
                            ↓
                          </span>

                        </div>
                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          </div>


          {/* ================= OUTPUT METRICS ================= */}
          <div className="rounded-xl border border-slate-800 bg-[#060c18] p-5 h-full flex flex-col">

            {/* Header */}
            <div className="mb-5">
              <h3 className="text-sm font-bold tracking-wide text-cyan-400">
                OUTPUT METRICS & FORMULAS
              </h3>

              <p className="text-[10px] text-slate-600 mt-1">
                Derived explainable indicators from VELC observations
              </p>
            </div>


            {/* Formula cards */}
            <div className="flex-1 flex flex-col justify-between gap-4">

              {formulas.map((item) => {
                const c = colorClasses(item.color);

                return (
                  <div
                    key={item.number}
                    className={`
                      flex-1
                      rounded-xl
                      border
                      ${c.softBorder}
                      bg-[#09111f]
                      overflow-hidden
                    `}
                  >

                    <div
                      className="
                        grid
                        grid-cols-1
                        lg:grid-cols-[1.05fr_0.85fr_1fr]
                        h-full
                      "
                    >

                      {/* ================= METRIC ================= */}
                      <div
                        className="
                          p-5
                          border-b
                          lg:border-b-0
                          lg:border-r
                          border-slate-800/80
                          flex
                          flex-col
                          justify-center
                        "
                      >

                        <div>
  <div className="flex items-center gap-3">
    <span
      className={`
        inline-flex
        items-center
        justify-center
        min-w-[30px]
        h-6
        px-2
        rounded-md
        border
        text-[10px]
        font-bold
        font-mono
        ${c.text}
        ${c.border}
        ${c.bg}
      `}
    >
      {item.number}
    </span>

    <h4
      className={`
        text-[15px]
        font-bold
        leading-5
        ${c.text}
      `}
    >
      {item.title}
    </h4>
  </div>

  <p
    className="
      text-[12px]
      text-slate-400
      mt-4
      leading-5
    "
  >
    {item.explanation}
  </p>
</div>

                      </div>


                      {/* ================= FORMULA ================= */}
                      <div
                        className="
                          p-5
                          border-b
                          lg:border-b-0
                          lg:border-r
                          border-slate-800/80
                          flex
                          flex-col
                          justify-center
                        "
                      >

                        <p
                          className="
                            text-[9px]
                            tracking-[0.18em]
                            text-slate-500
                            mb-3
                          "
                        >
                          FORMULA
                        </p>


                        <div
                          className={`
                            ${c.bg}
                            ${c.border}
                            rounded-lg
                            px-3
                            py-4
                            text-center
                            font-mono
                            text-[13px]
                            ${c.text}
                            whitespace-nowrap
                          `}
                        >
                          {item.formula}
                        </div>

                      </div>


                      {/* ================= WHERE ================= */}
                      <div
                        className="
                          p-5
                          flex
                          flex-col
                          justify-center
                        "
                      >

                        <p
                          className="
                            text-[9px]
                            tracking-[0.18em]
                            text-slate-500
                            mb-3
                          "
                        >
                          WHERE
                        </p>


                        <div className="space-y-2.5">

                          {item.where.map((line) => (
                            <div
                              key={line}
                              className="
                                flex
                                gap-2
                                text-[12px]
                                leading-5
                                text-slate-400
                              "
                            >
                              <span className={c.text}>
                                •
                              </span>

                              <span>
                                {line}
                              </span>
                            </div>
                          ))}

                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
function SolarWindAgent() {
  const solarWindPipeline = [
    {
      name: "SWIS-ASPEX Data",
      icon: Database,
      color: "text-cyan-400",
    },
    {
      name: "Data Cleaning",
      icon: SlidersHorizontal,
      color: "text-emerald-400",
    },
    {
      name: "Feature Engineering",
      icon: BarChart3,
      color: "text-blue-400",
    },
    {
      name: "48-Step Time Window",
      icon: ScanSearch,
      color: "text-purple-400",
    },
    {
      name: "Temporal Fusion Transformer",
      icon: Brain,
      color: "text-purple-400",
    },
    {
      name: "Anomaly Probability",
      icon: Target,
      color: "text-red-400",
    },
    {
      name: "Plasma Instability Analysis",
      icon: Wind,
      color: "text-cyan-400",
    },
    {
      name: "Disturbance Classification",
      icon: BarChart3,
      color: "text-blue-400",
    },
    {
      name: "Agent 2 Results",
      icon: CheckCircle2,
      color: "text-emerald-400",
    },
  ];

  const solarWindFormulas = [
    {
      number: "01",
      title: "Solar-Wind Anomaly Score",
      formula: "WA = P(Anomaly)",
      where: [
        "P(Anomaly) = AI-estimated probability of abnormal solar-wind behavior",
        "WA = Wind Anomaly Score",
      ],
      explanation:
        "Shows how strongly the AI detects unusual solar-wind activity.",
      color: "cyan",
    },
    {
      number: "02",
      title: "Plasma Instability",
      formula: "PI = (D + T + A) / 3",
      where: [
        "D = Density variation",
        "T = Thermal variation",
        "A = Particle-composition variation",
        "PI = Plasma Instability Score",
      ],
      explanation:
        "Combines changes in density, thermal state, and alpha/proton composition to estimate how disturbed the plasma is.",
      color: "purple",
    },
    {
      number: "03",
      title: "Speed-Change Anomaly",
      formula:
        "|ΔV| > Average(|ΔV|) + 1.5 × Variation(|ΔV|)",
      where: [
        "ΔV = Change in proton bulk speed",
        "Average = Normal average speed variation",
        "Variation = Standard deviation of speed variation",
        "Anomaly = Unusually large solar-wind speed change",
      ],
      explanation:
        "Detects sudden speed changes that are significantly different from normal solar-wind behavior.",
      color: "red",
    },
  ];

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-[#080f1d] overflow-hidden">
      {/* ================= AGENT HEADER ================= */}
      <div className="px-6 py-5 border-b border-slate-800/80">
        <div className="flex items-center justify-between gap-6">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-lg border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center">
              <Wind className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-cyan-400">
                  Solar Wind Agent
                </h2>

                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1">
                LSTM + Temporal Fusion Transformer (TFT)
              </p>
            </div>
          </div>

          {/* Data Source */}
          <div className="text-right shrink-0">
            <p className="text-[9px] tracking-[0.2em] text-slate-600">
              DATA SOURCE
            </p>

            <p className="text-sm text-slate-300 mt-1">
              SWIS-ASPEX Particle Analyzer
            </p>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-6">
        {/* PURPOSE */}
        <div className="mb-6">
          <p className="text-[10px] tracking-[0.18em] text-slate-500 mb-2">
            PURPOSE
          </p>

          <p className="text-sm leading-6 text-slate-400">
            Processes time-series particle data to identify plasma
            disturbances preceding CME eruptions.
          </p>
        </div>

        {/* =====================================================
            PIPELINE + METRICS
        ====================================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-[0.58fr_1.48fr] gap-6 items-stretch">

          {/* ================= PROCESSING PIPELINE ================= */}
          <div className="rounded-xl border border-slate-800 bg-[#060c18] p-5 h-full flex flex-col">

            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold tracking-wide text-cyan-400">
                  PROCESSING PIPELINE
                </h3>

                <p className="text-[10px] text-slate-600 mt-1">
                  SWIS-ASPEX temporal intelligence flow
                </p>
              </div>

              <span className="text-[9px] px-2 py-1 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                ONLINE
              </span>
            </div>

            {/* Pipeline */}
            <div className="flex-1 flex flex-col justify-between">

              {solarWindPipeline.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.name}>

                    {/* Step */}
                    <div
                      className="
                        flex items-center gap-3
                        min-h-[42px]
                        px-3
                        rounded-lg
                        border border-slate-800
                        bg-[#091221]
                        hover:border-slate-700
                        transition-all
                      "
                    >
                      {/* Icon */}
                      <div
                        className={`
                          w-7 h-7
                          shrink-0
                          rounded-md
                          bg-slate-900
                          border border-slate-800
                          flex items-center justify-center
                          ${step.color}
                        `}
                      >
                        <Icon size={15} />
                      </div>

                      {/* Name */}
                      <span className="text-xs text-slate-300">
                        {step.name}
                      </span>

                      {/* Ready */}
                      {index === solarWindPipeline.length - 1 && (
                        <span className="ml-auto text-[9px] text-emerald-400">
                          READY
                        </span>
                      )}
                    </div>

                    {/* Connector */}
                    {index !== solarWindPipeline.length - 1 && (
                      <div className="flex justify-center h-4">
                        <div className="w-px bg-cyan-500/30 relative">
                          <span className="absolute -bottom-1 -left-[3px] text-[8px] text-cyan-500">
                            ↓
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

            </div>
          </div>

          {/* ================= OUTPUT METRICS ================= */}
          <div className="rounded-xl border border-slate-800 bg-[#060c18] p-5 h-full flex flex-col">

            {/* Header */}
            <div className="mb-5">
              <h3 className="text-sm font-bold tracking-wide text-cyan-400">
                OUTPUT METRICS & FORMULAS
              </h3>

              <p className="text-[10px] text-slate-600 mt-1">
                Derived explainable indicators from SWIS-ASPEX observations
              </p>
            </div>

            {/* Formula cards */}
            <div className="flex-1 flex flex-col gap-4">

              {solarWindFormulas.map((item) => {
                const c = colorClasses(item.color);

                return (
                  <div
  key={item.number}
  className={`
    rounded-xl
    border
    ${c.softBorder}
    bg-[#09111f]
    overflow-hidden
  `}
>
                    <div
                      className="
                        grid
                        grid-cols-1
                        lg:grid-cols-[1.05fr_0.85fr_1fr]
                        h-full
                      "
                    >

                      {/* ================= METRIC ================= */}
                      <div
                        className="
                          p-5
                          border-b
                          lg:border-b-0
                          lg:border-r
                          border-slate-800/80
                          flex
                          flex-col
                          justify-center
                        "
                      >
                        <div>

                          {/* Number + Title */}
                          <div className="flex items-center gap-3">

                            <span
                              className={`
                                inline-flex
                                items-center
                                justify-center
                                min-w-[30px]
                                h-6
                                px-2
                                rounded-md
                                border
                                text-[10px]
                                font-bold
                                font-mono
                                ${c.text}
                                ${c.border}
                                ${c.bg}
                              `}
                            >
                              {item.number}
                            </span>

                            <h4
                              className={`
                                text-[15px]
                                font-bold
                                leading-5
                                ${c.text}
                              `}
                            >
                              {item.title}
                            </h4>

                          </div>

                          {/* Explanation */}
                          <p
                            className="
                              text-[12px]
                              text-slate-400
                              mt-4
                              leading-5
                            "
                          >
                            {item.explanation}
                          </p>

                        </div>
                      </div>

                      {/* ================= FORMULA ================= */}
                      <div
                        className="
                          p-5
                          border-b
                          lg:border-b-0
                          lg:border-r
                          border-slate-800/80
                          flex
                          flex-col
                          justify-center
                        "
                      >
                        <p
                          className="
                            text-[9px]
                            tracking-[0.18em]
                            text-slate-500
                            mb-3
                          "
                        >
                          FORMULA
                        </p>

                        <div
  className={`
    ${c.bg}
    ${c.border}
    rounded-lg
    px-3
    py-4
    text-center
    font-mono
    text-[13px]
    leading-6
    ${c.text}
    whitespace-normal
    break-words
  `}
>
  {item.formula}
</div>
                      </div>

                      {/* ================= WHERE ================= */}
                      <div
                        className="
                          p-5
                          flex
                          flex-col
                          justify-center
                        "
                      >
                        <p
                          className="
                            text-[9px]
                            tracking-[0.18em]
                            text-slate-500
                            mb-3
                          "
                        >
                          WHERE
                        </p>

                        <div className="space-y-2.5">
                          {item.where.map((line) => (
                            <div
                              key={line}
                              className="
                                flex
                                gap-2
                                text-[12px]
                                leading-5
                                text-slate-400
                              "
                            >
                              <span className={c.text}>
                                •
                              </span>

                              <span>
                                {line}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function MagneticStressAgent() {
  const magneticPipeline = [
    {
      name: "MAG ZIP",
      icon: Database,
      color: "text-purple-400",
    },
    {
      name: "Extract Magnetometer Files",
      icon: SlidersHorizontal,
      color: "text-emerald-400",
    },
    {
      name: "Preprocess + Clean Noise",
      icon: ScanSearch,
      color: "text-cyan-400",
    },
    {
      name: "Normalize + Windowing",
      icon: BarChart3,
      color: "text-blue-400",
    },
    {
      name: "Transformer Encoder (Time Series)",
      icon: Brain,
      color: "text-purple-400",
    },
    {
      name: "Self-Attention (Temporal)",
      icon: ScanSearch,
      color: "text-cyan-400",
    },
    {
      name: "Feature Extraction",
      icon: BarChart3,
      color: "text-blue-400",
    },
    {
      name: "Prediction Head",
      icon: Target,
      color: "text-red-400",
    },
    {
      name: "MAG Results",
      icon: CheckCircle2,
      color: "text-emerald-400",
    },
  ];

  const magneticFormulas = [
    {
      number: "01",
      title: "Magnetic Stress Index",
      formula: "MSI = (|Bt|max / Bn) × 100",
      where: [
        "|Bt|max = Maximum transverse magnetic field",
        "Bn = Background (normal) magnetic field",
        "MSI = Magnetic Stress Index",
      ],
      explanation:
        "Indicates the level of magnetic stress accumulated in the region.",
      color: "purple",
    },
    {
      number: "02",
      title: "Magnetic Reconnection Probability",
      formula: "MRP = (J / Jc) × θ × 100",
      where: [
        "J = Current density",
        "θ = Shear angle between magnetic fields",
        "Jc = Critical current density",
        "MRP = Reconnection probability",
      ],
      explanation:
        "Estimates the likelihood of magnetic reconnection events.",
      color: "red",
    },
  ];

  return (
    <div className="rounded-2xl border border-purple-500/20 bg-[#080f1d] overflow-hidden">
      {/* ================= AGENT HEADER ================= */}
      <div className="px-6 py-5 border-b border-slate-800/80">
        <div className="flex items-center justify-between gap-6">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-lg border border-purple-500/30 bg-purple-500/10 flex items-center justify-center">
              <Magnet className="w-5 h-5 text-purple-400" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-purple-400">
                  Magnetic Stress Agent
                </h2>

                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1">
                Transformer Encoder + Temporal Self-Attention
              </p>
            </div>
          </div>

          {/* Data Source */}
          <div className="text-right shrink-0">
            <p className="text-[9px] tracking-[0.2em] text-slate-600">
              DATA SOURCE
            </p>

            <p className="text-sm text-slate-300 mt-1">
              Aditya-L1 Magnetometer
            </p>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-6">
        {/* PURPOSE */}
        <div className="mb-6">
          <p className="text-[10px] tracking-[0.18em] text-slate-500 mb-2">
            PURPOSE
          </p>

          <p className="text-sm leading-6 text-slate-400">
            Analyzes magnetic field time-series data to detect magnetic stress,
            reconnection signatures, and flux-rope related disturbances.
          </p>
        </div>

        {/* ================= PIPELINE + METRICS ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-[0.58fr_1.48fr] gap-6 items-stretch">

          {/* ================= PROCESSING PIPELINE ================= */}
          <div className="rounded-xl border border-slate-800 bg-[#060c18] p-5 h-full flex flex-col">

            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold tracking-wide text-cyan-400">
                  PROCESSING PIPELINE
                </h3>

                <p className="text-[10px] text-slate-600 mt-1">
                  MAG temporal intelligence flow
                </p>
              </div>

              <span className="text-[9px] px-2 py-1 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                ONLINE
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              {magneticPipeline.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.name}>
                    {/* Step */}
                    <div
                      className="
                        flex items-center gap-3
                        min-h-[42px]
                        px-3
                        rounded-lg
                        border border-slate-800
                        bg-[#091221]
                        hover:border-slate-700
                        transition-all
                      "
                    >
                      <div
                        className={`
                          w-7 h-7
                          shrink-0
                          rounded-md
                          bg-slate-900
                          border border-slate-800
                          flex items-center justify-center
                          ${step.color}
                        `}
                      >
                        <Icon size={15} />
                      </div>

                      <span className="text-xs text-slate-300">
                        {step.name}
                      </span>

                      {index === magneticPipeline.length - 1 && (
                        <span className="ml-auto text-[9px] text-emerald-400">
                          READY
                        </span>
                      )}
                    </div>

                    {/* Connector */}
                    {index !== magneticPipeline.length - 1 && (
                      <div className="flex justify-center h-4">
                        <div className="w-px bg-cyan-500/30 relative">
                          <span className="absolute -bottom-1 -left-[3px] text-[8px] text-cyan-500">
                            ↓
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= OUTPUT METRICS ================= */}
          <div className="rounded-xl border border-slate-800 bg-[#060c18] p-5 h-full flex flex-col">

            <div className="mb-5">
              <h3 className="text-sm font-bold tracking-wide text-cyan-400">
                OUTPUT METRICS & FORMULAS
              </h3>

              <p className="text-[10px] text-slate-600 mt-1">
                Derived explainable indicators from MAG observations
              </p>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {magneticFormulas.map((item) => {
                const c = colorClasses(item.color);

                return (
                  <div
                    key={item.number}
                    className={`
                      rounded-xl
                      border
                      ${c.softBorder}
                      bg-[#09111f]
                      overflow-hidden
                    `}
                  >
                    <div
                      className="
                        grid
                        grid-cols-1
                        lg:grid-cols-[1.05fr_0.85fr_1fr]
                        h-full
                      "
                    >

                      {/* ================= METRIC ================= */}
                      <div
                        className="
                          p-5
                          border-b
                          lg:border-b-0
                          lg:border-r
                          border-slate-800/80
                          flex
                          flex-col
                          justify-center
                        "
                      >
                        <div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`
                                inline-flex
                                items-center
                                justify-center
                                min-w-[30px]
                                h-6
                                px-2
                                rounded-md
                                border
                                text-[10px]
                                font-bold
                                font-mono
                                ${c.text}
                                ${c.border}
                                ${c.bg}
                              `}
                            >
                              {item.number}
                            </span>

                            <h4
                              className={`
                                text-[15px]
                                font-bold
                                leading-5
                                ${c.text}
                              `}
                            >
                              {item.title}
                            </h4>
                          </div>

                          <p
                            className="
                              text-[12px]
                              text-slate-400
                              mt-4
                              leading-5
                            "
                          >
                            {item.explanation}
                          </p>
                        </div>
                      </div>

                      {/* ================= FORMULA ================= */}
                      <div
                        className="
                          p-5
                          border-b
                          lg:border-b-0
                          lg:border-r
                          border-slate-800/80
                          flex
                          flex-col
                          justify-center
                        "
                      >
                        <p
                          className="
                            text-[9px]
                            tracking-[0.18em]
                            text-slate-500
                            mb-3
                          "
                        >
                          FORMULA
                        </p>

                        <div
                          className={`
                            ${c.bg}
                            ${c.border}
                            rounded-lg
                            px-3
                            py-4
                            text-center
                            font-mono
                            text-[13px]
                            leading-6
                            ${c.text}
                            whitespace-normal
                            break-words
                          `}
                        >
                          {item.formula}
                        </div>
                      </div>

                      {/* ================= WHERE ================= */}
                      <div
                        className="
                          p-5
                          flex
                          flex-col
                          justify-center
                        "
                      >
                        <p
                          className="
                            text-[9px]
                            tracking-[0.18em]
                            text-slate-500
                            mb-3
                          "
                        >
                          WHERE
                        </p>

                        <div className="space-y-2.5">
                          {item.where.map((line) => (
                            <div
                              key={line}
                              className="
                                flex
                                gap-2
                                text-[12px]
                                leading-5
                                text-slate-400
                              "
                            >
                              <span className={c.text}>•</span>

                              <span>{line}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function KnowledgeAgent() {
  const knowledgePipeline = [
    {
      name: "Historical CME Database",
      icon: Database,
      color: "text-emerald-400",
    },
    {
      name: "Multi-Sensor Signature Collection",
      icon: ScanSearch,
      color: "text-cyan-400",
    },
    {
      name: "Feature Normalization",
      icon: SlidersHorizontal,
      color: "text-blue-400",
    },
    {
      name: "Historical Event Retrieval",
      icon: Database,
      color: "text-purple-400",
    },
    {
      name: "Embedding Generation",
      icon: Brain,
      color: "text-purple-400",
    },
    {
      name: "Similarity Matching",
      icon: Target,
      color: "text-amber-400",
    },
    {
      name: "CME Event Classification",
      icon: BarChart3,
      color: "text-cyan-400",
    },
    {
      name: "Severity Estimation",
      icon: Target,
      color: "text-red-400",
    },
    {
      name: "Contextual Reasoning",
      icon: Brain,
      color: "text-emerald-400",
    },
    {
      name: "Knowledge Agent Results",
      icon: CheckCircle2,
      color: "text-emerald-400",
    },
  ];

  const knowledgeFormulas = [
    {
      number: "01",
      title: "Historical Match Score",
      formula:
        "HMS = Similarity(Current, Historical Events) × 100",
      where: [
        "Similarity = Similarity between current sensor signatures and historical CME events",
        "HMS = Historical Match Score",
      ],
      explanation:
        "Measures how closely the current multi-sensor observations match previously recorded CME events.",
      color: "emerald",
    },

    {
      number: "02",
      title: "Event Severity Score",
      formula: "ESS = Σ(wᵢ × fᵢ)",
      where: [
        "fᵢ = Individual event-severity feature",
        "wᵢ = Weight assigned to each feature",
        "ESS = Event Severity Score",
      ],
      explanation:
        "Combines multiple observed CME characteristics to estimate the potential severity of the detected event.",
      color: "amber",
    },

    {
      number: "03",
      title: "Contextual Confidence",
      formula:
        "CC = Historical Evidence × Pattern Confidence",
      where: [
        "Historical Evidence = Strength of supporting historical matches",
        "Pattern Confidence = Confidence of the detected event pattern",
        "CC = Contextual Confidence Score",
      ],
      explanation:
        "Indicates how confidently the Knowledge Agent supports the current CME assessment using historical evidence and recognized patterns.",
      color: "purple",
    },
  ];

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-[#080f1d] overflow-hidden">

      {/* =====================================================
          AGENT HEADER
      ====================================================== */}
      <div className="px-6 py-5 border-b border-slate-800/80">
        <div className="flex items-center justify-between gap-6">

          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">

            <div className="w-9 h-9 shrink-0 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-3">

                <h2 className="text-lg font-bold text-emerald-400">
                  Knowledge Agent
                </h2>

                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE
                </span>

              </div>

              <p className="text-xs text-slate-500 mt-1">
                RAG (Retrieval-Augmented Generation) + LLM
              </p>

            </div>
          </div>

          {/* Data Source */}
          <div className="text-right shrink-0">

            <p className="text-[9px] tracking-[0.2em] text-slate-600">
              DATA SOURCE
            </p>

            <p className="text-sm text-slate-300 mt-1">
              SOHO CME Catalog · NASA CDAWeb · NOAA SWPC · Aditya-L1 Archives
            </p>

          </div>

        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="p-6">

        {/* PURPOSE */}
        <div className="mb-6">

          <p className="text-[10px] tracking-[0.18em] text-slate-500 mb-2">
            PURPOSE
          </p>

          <p className="text-sm leading-6 text-slate-400">
            Compares current multi-sensor signatures against a database
            of historical CME events to compute similarity scores,
            classify events, and estimate their severity.
          </p>

        </div>

        {/* =====================================================
            PIPELINE + METRICS
        ====================================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-[0.58fr_1.48fr] gap-6 items-stretch">

          {/* =================================================
              PROCESSING PIPELINE
          ================================================== */}
          <div className="rounded-xl border border-slate-800 bg-[#060c18] p-5 h-full flex flex-col">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h3 className="text-sm font-bold tracking-wide text-cyan-400">
                  PROCESSING PIPELINE
                </h3>

                <p className="text-[10px] text-slate-600 mt-1">
                  Historical knowledge retrieval and reasoning flow
                </p>

              </div>

              <span className="text-[9px] px-2 py-1 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                ONLINE
              </span>

            </div>

            {/* Pipeline */}
            <div className="flex-1 flex flex-col justify-between">

              {knowledgePipeline.map((step, index) => {

                const Icon = step.icon;

                return (
                  <div key={step.name}>

                    {/* Pipeline Step */}
                    <div
                      className="
                        flex items-center gap-3
                        min-h-[42px]
                        px-3
                        rounded-lg
                        border border-slate-800
                        bg-[#091221]
                        hover:border-slate-700
                        transition-all
                      "
                    >

                      {/* Icon */}
                      <div
                        className={`
                          w-7 h-7
                          shrink-0
                          rounded-md
                          bg-slate-900
                          border border-slate-800
                          flex items-center justify-center
                          ${step.color}
                        `}
                      >
                        <Icon size={15} />
                      </div>

                      {/* Name */}
                      <span className="text-xs text-slate-300">
                        {step.name}
                      </span>

                      {/* Ready */}
                      {index === knowledgePipeline.length - 1 && (
                        <span className="ml-auto text-[9px] text-emerald-400">
                          READY
                        </span>
                      )}

                    </div>

                    {/* Connector */}
                    {index !== knowledgePipeline.length - 1 && (
                      <div className="flex justify-center h-4">

                        <div className="w-px bg-cyan-500/30 relative">

                          <span className="absolute -bottom-1 -left-[3px] text-[8px] text-cyan-500">
                            ↓
                          </span>

                        </div>

                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          </div>

          {/* =================================================
              OUTPUT METRICS
          ================================================== */}
          <div className="rounded-xl border border-slate-800 bg-[#060c18] p-5 h-full flex flex-col">

            <div className="mb-5">

              <h3 className="text-sm font-bold tracking-wide text-cyan-400">
                OUTPUT METRICS & FORMULAS
              </h3>

              <p className="text-[10px] text-slate-600 mt-1">
                Explainable indicators derived from historical CME knowledge
              </p>

            </div>

            {/* Formula Cards */}
            <div className="flex-1 flex flex-col gap-4">

              {knowledgeFormulas.map((item) => {

                const c = colorClasses(item.color);

                return (
                  <div
                    key={item.number}
                    className={`
  flex-1
  rounded-xl
  border
  ${c.softBorder}
  bg-[#09111f]
  overflow-hidden
`}
                  >

                    <div
                      className="
                        grid
                        grid-cols-1
                        lg:grid-cols-[1.05fr_0.85fr_1fr]
                      "
                    >

                      {/* ===============================
                          METRIC
                      ================================ */}
                      <div
                        className="
                          p-5
                          border-b
                          lg:border-b-0
                          lg:border-r
                          border-slate-800/80
                          flex
                          flex-col
                          justify-center
                        "
                      >

                        <div>

                          {/* Number + Title */}
                          <div className="flex items-center gap-3">

                            <span
                              className={`
                                inline-flex
                                items-center
                                justify-center
                                min-w-[30px]
                                h-6
                                px-2
                                rounded-md
                                border
                                text-[10px]
                                font-bold
                                font-mono
                                ${c.text}
                                ${c.border}
                                ${c.bg}
                              `}
                            >
                              {item.number}
                            </span>

                            <h4
                              className={`
                                text-[15px]
                                font-bold
                                leading-5
                                ${c.text}
                              `}
                            >
                              {item.title}
                            </h4>

                          </div>

                          {/* Explanation */}
                          <p
                            className="
                              text-[12px]
                              text-slate-400
                              mt-4
                              leading-5
                            "
                          >
                            {item.explanation}
                          </p>

                        </div>

                      </div>

                      {/* ===============================
                          FORMULA
                      ================================ */}
                      <div
                        className="
                          p-5
                          border-b
                          lg:border-b-0
                          lg:border-r
                          border-slate-800/80
                          flex
                          flex-col
                          justify-center
                        "
                      >

                        <p
                          className="
                            text-[9px]
                            tracking-[0.18em]
                            text-slate-500
                            mb-3
                          "
                        >
                          FORMULA
                        </p>

                        <div
                          className={`
                            ${c.bg}
                            ${c.border}
                            rounded-lg
                            px-3
                            py-4
                            text-center
                            font-mono
                            text-[13px]
                            leading-6
                            ${c.text}
                            whitespace-normal
                            break-words
                          `}
                        >
                          {item.formula}
                        </div>

                      </div>

                      {/* ===============================
                          WHERE
                      ================================ */}
                      <div
                        className="
                          p-5
                          flex
                          flex-col
                          justify-center
                        "
                      >

                        <p
                          className="
                            text-[9px]
                            tracking-[0.18em]
                            text-slate-500
                            mb-3
                          "
                        >
                          WHERE
                        </p>

                        <div className="space-y-2.5">

                          {item.where.map((line) => (

                            <div
                              key={line}
                              className="
                                flex
                                gap-2
                                text-[12px]
                                leading-5
                                text-slate-400
                              "
                            >

                              <span className={c.text}>
                                •
                              </span>

                              <span>
                                {line}
                              </span>

                            </div>

                          ))}

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


export default function AgentReasoningPage() {
  return (
    <div className="min-h-screen">
      <Topbar
        title="AGENT REASONING"
        badge="EXPLAINABLE AI"
        badgeColor="purple"
        subtitle="Explainable AI — 4 specialized agents feeding CME Genesis Predictor"
      />

      <main className="p-6 lg:p-8 space-y-6">
        {/* =========================================================
            FUSION PIPELINE
        ========================================================= */}
        <Panel title="CME GENESIS FUSION PIPELINE">
          <div className="flex items-center justify-center gap-2 flex-wrap py-3">
            {[
              ["Vision Agent", "text-amber-400 border-amber-500/30"],
              ["Wind Agent", "text-cyan-400 border-cyan-500/30"],
              ["Mag Agent", "text-purple-400 border-purple-500/30"],
              ["CME Genesis AI", "text-red-400 border-red-500/30"],
              ["Knowledge Agent", "text-emerald-400 border-emerald-500/30"],
            ].map(([name, color], index, arr) => (
              <div
                key={name}
                className="flex items-center gap-2"
              >
                <span
                  className={`text-xs font-semibold px-3 py-2 rounded-md border bg-slate-950/40 ${color}`}
                >
                  {name}
                </span>

                {index !== arr.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                )}
              </div>
            ))}
          </div>
        </Panel>

        {/* =========================================================
            SOLAR VISION — DETAILED
        ========================================================= */}
        <SolarVisionAgent />
<SolarWindAgent />
<MagneticStressAgent />
<KnowledgeAgent />
        {/* =========================================================
            OTHER AGENTS
        ========================================================= */}
        
      </main>
    </div>
  );
}