"use client";

import Topbar from "@/components/Topbar";
import { Panel, ProgressBar } from "@/components/ui";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { ShieldAlert, AlertTriangle } from "lucide-react";

interface RadarDataPoint {
  metric: string;
  value: number;
}

interface AgentItem {
  label: string;
  value: number;
  color: string;
}

interface AgentGroup {
  name: string;
  color: string;
  items: AgentItem[];
}

interface HistoricalEvent {
  name: string;
  date: string;
  class: string;
}

const radarData: RadarDataPoint[] = [
  { metric: "Loop Expansion", value: 81 },
  { metric: "Flux Rope", value: 71 },
  { metric: "Plasma Instability", value: 76 },
  { metric: "Mag Stress", value: 92 },
  { metric: "Reconnection", value: 87 },
  { metric: "Historical Match", value: 82 },
];

const agentGroups: AgentGroup[] = [
  {
    name: "VISION AGENT (ViT)",
    color: "text-amber-400",
    items: [
      { label: "Loop Expansion", value: 81, color: "bg-red-400" },
      { label: "Flux Rope", value: 71, color: "bg-amber-400" },
      { label: "Eruption Signal", value: 82, color: "bg-red-400" },
    ],
  },
  {
    name: "SOLAR WIND AGENT (TFT)",
    color: "text-cyan-400",
    items: [
      { label: "Plasma Instability", value: 81, color: "bg-red-400" },
      { label: "Wind Anomaly", value: 76, color: "bg-amber-400" },
    ],
  },
  {
    name: "MAGNETIC AGENT (TRANSFORMER)",
    color: "text-purple-400",
    items: [
      { label: "Magnetic Stress", value: 88, color: "bg-red-400" },
      { label: "Reconnection", value: 89, color: "bg-red-400" },
    ],
  },
  {
    name: "KNOWLEDGE AGENT (RAG+LLM)",
    color: "text-emerald-400",
    items: [{ label: "Historical Match", value: 87, color: "bg-red-400" }],
  },
];

const historicalEvents: HistoricalEvent[] = [
  { name: "Halloween Storm", date: "2003-10-28", class: "X17.2" },
  { name: "Carrington-class", date: "2012-07-23", class: "X6.9" },
  { name: "September Storm", date: "2017-09-06", class: "X9.3" },
];

export default function CMEPredictionPage() {
  const probability = 82;

  return (
    <div>
      <Topbar
        title="CME PREDICTION"
        badge="CRITICAL"
        badgeColor="red"
        subtitle="Multi-Agent AI Fusion — XGBoost + Fusion Transformer model"
      />

      <div className="p-8 space-y-6">
        {/* Critical banner */}
        <div className="flex items-start gap-3 bg-red-950/40 border border-red-500/30 rounded-lg px-5 py-4">
          <ShieldAlert className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <div className="text-red-400 font-bold text-sm tracking-wide">CRITICAL</div>
            <div className="text-slate-400 text-sm mt-0.5">
              CME FORMATION IMMINENT — Satellite operators should take immediate precautions.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CME Genesis prediction */}
          <Panel title="CME GENESIS PREDICTION">
            <div className="flex flex-col items-center py-2">
              <div className="relative w-44 h-44">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#1e293b" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#f87171"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(probability / 100) * 276} 276`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-red-400">{probability}%</span>
                  <span className="text-[10px] text-slate-500 tracking-widest mt-1">PROBABILITY</span>
                </div>
              </div>

              <button className="mt-4 flex items-center gap-2 border border-red-500/40 bg-red-950/40 text-red-400 text-xs font-semibold px-4 py-2 rounded-md">
                <AlertTriangle className="w-3.5 h-3.5" />
                CME FORMATION IMMINENT
              </button>

              <div className="w-full mt-5">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>CONFIDENCE</span>
                  <span>83%</span>
                </div>
                <ProgressBar value={83} color="bg-cyan-400" />
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mt-5">
                <div className="bg-[#0b1018] border border-slate-800/60 rounded-md p-3 text-center">
                  <div className="text-[10px] text-slate-500 tracking-widest">MODEL</div>
                  <div className="text-sm font-bold text-cyan-300 mt-1">XGBoost+TF</div>
                </div>
                <div className="bg-[#0b1018] border border-slate-800/60 rounded-md p-3 text-center">
                  <div className="text-[10px] text-slate-500 tracking-widest">AGENTS</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">7/7 ACTIVE</div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/60 space-y-2.5">
              {(
                [
                  ["Genesis Model", "XGBoost + Fusion Transformer"],
                  ["Input Agents", "4 Specialized Agents"],
                  ["Update Rate", "Every 3 seconds"],
                  ["Accuracy", "94.2% on test set"],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between text-[10px] tracking-widest">
                  <span className="text-slate-500">{label.toUpperCase()}</span>
                  <span className="text-cyan-300 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </Panel>

          {/* Precursor radar */}
          <Panel title="PRECURSOR RADAR">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis stroke="#1e293b" domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Precursor"
                  dataKey="value"
                  stroke="#22d3ee"
                  fill="#22d3ee"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Panel>

          {/* Agent contributions */}
          <Panel title="AGENT CONTRIBUTIONS">
            <div className="space-y-5">
              {agentGroups.map((group) => (
                <div key={group.name}>
                  <div className={`text-[10px] tracking-widest font-bold mb-2 ${group.color}`}>
                    {group.name}
                  </div>
                  <div className="space-y-2.5">
                    {group.items.map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>{item.label}</span>
                          <span className="text-red-400 font-semibold">{item.value}%</span>
                        </div>
                        <ProgressBar value={item.value} color={item.color} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Similar historical events */}
        <Panel title="SIMILAR HISTORICAL EVENTS (RAG Match)">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {historicalEvents.map((ev) => (
              <div
                key={ev.name}
                className="flex items-center justify-between bg-[#0b1018] border border-slate-800/60 rounded-md px-4 py-3"
              >
                <div>
                  <div className="text-sm font-bold text-slate-200">{ev.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{ev.date}</div>
                </div>
                <span className="text-red-400 font-bold text-sm border border-red-500/30 bg-red-950/40 rounded px-2 py-1">
                  {ev.class}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
