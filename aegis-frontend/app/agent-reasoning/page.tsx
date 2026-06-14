"use client";

import Topbar from "@/components/Topbar";
import { Panel, ProgressBar } from "@/components/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Eye, Wind, Magnet, BookOpen, ArrowRight, LucideIcon } from "lucide-react";

interface PipelineDataPoint {
  name: string;
  value: number;
  color: string;
}

interface PipelineStep {
  name: string;
  color: string;
}

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

const pipelineData: PipelineDataPoint[] = [
  { name: "Vision", value: 100, color: "#fbbf24" },
  { name: "Solar Wind", value: 100, color: "#22d3ee" },
  { name: "Magnetic", value: 100, color: "#a78bfa" },
  { name: "CME Genesis", value: 100, color: "#f87171" },
  { name: "Knowledge", value: 100, color: "#34d399" },
  
];

const pipelineSteps: PipelineStep[] = [
  { name: "Vision Agent", color: "text-amber-400 border-amber-500/30 bg-amber-950/20" },
  { name: "Wind Agent", color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20" },
  { name: "Mag Agent", color: "text-purple-400 border-purple-500/30 bg-purple-950/20" },
  { name: "CME Genesis AI", color: "text-red-400 border-red-500/30 bg-red-950/20" },
  { name: "Knowledge Agent", color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20" },
  
];

const agents: Agent[] = [
  {
    name: "Solar Vision Agent",
    sub: "Vision Transformer (ViT) + CNN + Temporal Transformer",
    icon: Eye,
    color: "text-amber-400 border-amber-500/30",
    dataSource: "VELC Coronagraph Images",
    purpose: "Analyzes high-resolution coronagraph images to detect visual precursors of CME formation.",
    detects: ["Coronal loop inflation", "Arc instability", "Brightness anomalies", "Flux rope formation"],
    outputs: [
      { label: "Loop Expansion", value: 85 },
      { label: "Flux Rope Prob.", value: 77 },
      { label: "Eruption Signal", value: 76 },
    ],
    tagColor: "bg-amber-950/30 border-amber-500/30 text-amber-400",
    barColor: "bg-amber-400",
  },
  {
    name: "Solar Wind Agent",
    sub: "LSTM + Temporal Fusion Transformer (TFT)",
    icon: Wind,
    color: "text-cyan-400 border-cyan-500/30",
    dataSource: "SWIS-ASPEX Particle Analyzer",
    purpose: "Processes time-series particle data to identify plasma disturbances preceding CME eruptions.",
    detects: ["Plasma disturbances", "Velocity spikes", "Density enhancement", "Proton flux surges"],
    outputs: [
      { label: "Plasma Instability", value: 78 },
      { label: "Wind Anomaly", value: 78 },
    ],
    tagColor: "bg-cyan-950/30 border-cyan-500/30 text-cyan-400",
    barColor: "bg-cyan-400",
  },
  {
    name: "Magnetic Stress Agent",
    sub: "Transformer Encoder",
    icon: Magnet,
    color: "text-purple-400 border-purple-500/30",
    dataSource: "Aditya-L1 Magnetometer",
    purpose: "Analyzes magnetic field vector components to detect reconnection events and flux rope signatures.",
    detects: ["Magnetic reconnection", "Flux rope signatures", "Field line twisting", "Southward Bz excursion"],
    outputs: [
      { label: "Magnetic Stress", value: 92 },
      { label: "Reconnection Prob.", value: 87 },
    ],
    tagColor: "bg-purple-950/30 border-purple-500/30 text-purple-400",
    barColor: "bg-purple-400",
  },
  {
    name: "Knowledge Agent",
    sub: "RAG (Retrieval-Augmented Generation) + LLM",
    icon: BookOpen,
    color: "text-emerald-400 border-emerald-500/30",
    dataSource: "SOHO CME Catalog · NASA CDAWeb · NOAA SWPC · Aditya-L1 Archives",
    purpose: "Compares current multi-sensor signatures against a database of historical CME events to compute similarity scores.",
    detects: ["Historical pattern matching", "Event classification", "Severity estimation", "Contextual reasoning"],
    outputs: [{ label: "Historical Match", value: 82 }],
    tagColor: "bg-emerald-950/30 border-emerald-500/30 text-emerald-400",
    barColor: "bg-emerald-400",
  },
];

export default function AgentReasoningPage() {
  return (
    <div>
      <Topbar
        title="AGENT REASONING"
        badge="EXPLAINABLE AI"
        badgeColor="purple"
        subtitle="Explainable AI — 4 specialized agents feeding CME Genesis Predictor"
      />

      <div className="p-8 space-y-6">
        {/* Pipeline */}
        <Panel title="CME GENESIS FUSION PIPELINE">
          <div className="flex items-center justify-center gap-2 flex-wrap mb-5">
            {pipelineSteps.map((step, idx) => (
              <div key={step.name} className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-md border ${step.color}`}>
                  {step.name}
                </span>
                {idx !== pipelineSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                )}
              </div>
            ))}
          </div>
          {/* <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pipelineData}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={10} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {pipelineData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer> */}
        </Panel>

        {/* Agent cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const [textColor, borderColor] = agent.color.split(" ");
            return (
              <Panel key={agent.name} className={`border-t-2 ${borderColor}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${textColor}`} />
                    <div>
                      <div className={`font-bold ${textColor}`}>{agent.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{agent.sub}</div>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-[10px] text-slate-500 tracking-widest mb-1">DATA SOURCE</div>
                    <div className="text-sm text-slate-200">{agent.dataSource}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 tracking-widest mb-1">CURRENT OUTPUT</div>
                    <div className="space-y-2">
                      {agent.outputs.map((o) => (
                        <div key={o.label} className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 w-28 truncate">{o.label}</span>
                          <ProgressBar value={o.value} color={agent.barColor} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-[10px] text-slate-500 tracking-widest mb-1">PURPOSE</div>
                  <p className="text-xs text-slate-400">{agent.purpose}</p>
                </div>

                <div className="mb-4">
                  <div className="text-[10px] text-slate-500 tracking-widest mb-2">DETECTS</div>
                  <div className="flex flex-wrap gap-2">
                    {agent.detects.map((d) => (
                      <span key={d} className={`text-[10px] px-2 py-1 rounded border ${agent.tagColor}`}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                  {agent.outputs.map((o) => (
                    <div key={o.label} className="flex justify-between text-xs">
                      <span className="text-slate-400">{o.label}</span>
                      <span className={`font-bold ${textColor}`}>{o.value}%</span>
                    </div>
                  ))}
                </div>
              </Panel>
            );
          })}
        </div>
      </div>
    </div>
  );
}
