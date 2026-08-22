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
import {
  ShieldAlert,
  AlertTriangle,
  Video,
  Wind,
  Magnet,
  Brain,
  Users,
  Activity,
  Zap,
  Waves,
  CircleDot,
} from "lucide-react";
interface RadarDataPoint {
  metric: string;
  value: number;
}

interface AgentItem {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface AgentGroup {
  name: string;
  color: string;
  border: string;
  bg: string;
  icon: React.ComponentType<{ className?: string }>;
  contribution: number;
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
      border: "border-amber-500/30",
      bg: "bg-amber-950/20",
      icon: Video,
      contribution: 30,
      items: [
      {
        label: "Loop Expansion",
        value: 81,
        icon: Waves,
      },
      {
        label: "Flux Rope",
        value: 71,
        icon: CircleDot,
      },
      {
        label: "Eruption Signal",
        value: 82,
        icon: Zap,
      },
    ],
  },

 {
        name: "SOLAR WIND AGENT (TFT)",
        color: "text-cyan-400",
        border: "border-cyan-500/30",
        bg: "bg-cyan-950/20",
        icon: Wind,
        contribution: 15,
        items: [
      {
        label: "Plasma Instability",
        value: 81,
        icon: Activity,
      },
      {
        label: "Wind Anomaly",
        value: 76,
        icon: Wind,
      },
    ],
  },

  {
        name: "MAGNETIC AGENT (TRANSFORMER)",
        color: "text-purple-400",
        border: "border-purple-500/30",
        bg: "bg-purple-950/20",
        icon: Magnet,
        contribution: 35,
        items: [
      {
        label: "Magnetic Stress",
        value: 88,
        icon: Activity,
      },
      {
        label: "Reconnection",
        value: 89,
        icon: Zap,
      },
    ],
  },

  {
        name: "KNOWLEDGE AGENT (RAG+LLM)",
        color: "text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-950/20",
        icon: Brain,
        contribution: 20,
        items: [
      {
        label: "Historical Match",
        value: 87,
        icon: CircleDot,
      },
    ],
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

      <div className="p-8 pt-5 space-y-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch min-w-0">
          {/* CME Genesis prediction */}
          <Panel title="CME GENESIS PREDICTION" className="h-[500px]">
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

            <div className="mt-1 pt-4 border-t border-slate-800/60 space-y-1.5">
              {(
                [
                  ["Genesis Model", "XGBoost + Fusion Transformer"],
                  // ["Input Agents", "4 Specialized Agents"],
                  // ["Update Rate", "Every 3 seconds"],
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
          {/* Precursor Radar */}
{/* Precursor Radar */}
<Panel title="PRECURSOR RADAR" className="h-[500px] overflow-hidden">
  <div className="w-full h-full flex flex-col items-center gap-1">

    {/* Radar */}
    <div className="w-full min-w-0 flex-1 min-h-0 px-6">
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={0}
        minHeight={200}
      >
        <RadarChart
          data={radarData}
          cx="50%"
          cy="50%"
          outerRadius="65%"
        >
          <PolarGrid
            stroke="#1e4661"
            strokeOpacity={0.8}
            gridType="polygon"
          />

          <PolarAngleAxis
            dataKey="metric"
            tick={({ payload, x, y, textAnchor }) => {
              const label = payload.value;

              const lines =
                label === "Historical Match"
                  ? ["Historical", "Match"]
                  : label === "Plasma Instability"
                  ? ["Plasma", "Instability"]
                  : [label];

              return (
                <text
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  fill="#94a3b8"
                  fontSize={11}
                  fontWeight={500}
                >
                  {lines.map((line, index) => (
                    <tspan
                      key={line}
                      x={x}
                      dy={index === 0 ? 0 : 15}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              );
            }}
            tickLine={false}
          />

          <PolarRadiusAxis
            domain={[0, 100]}
            tick={{
              fill: "#475569",
              fontSize: 9,
            }}
            tickCount={5}
            axisLine={false}
            tickLine={false}
          />

          <Radar
            name="Precursor"
            dataKey="value"
            stroke="#22d3ee"
            fill="#0891b2"
            fillOpacity={0.18}
            strokeWidth={2.5}
            dot={{
              r: 4,
              fill: "#22d3ee",
              stroke: "#a5f3fc",
              strokeWidth: 1,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>

    {/* Scanning Pulse */}
    <div className="relative w-full h-[100px]  flex items-center justify-center overflow-hidden">
      <svg viewBox="0 20 300 100" className="w-full max-w-[920px] h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#22d3ee" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rayFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* radiating rays */}
        {/* <g opacity="0.6">
          <line x1="150" y1="50" x2="100" y2="-30" stroke="url(#rayFade)" strokeWidth="1" />
          <line x1="150" y1="50" x2="150" y2="-40" stroke="url(#rayFade)" strokeWidth="1" />
          <line x1="150" y1="50" x2="200" y2="-30" stroke="url(#rayFade)" strokeWidth="1" />
        </g> */}

        {/* core glow */}
        <ellipse cx="150" cy="50" rx="80" ry="22" fill="url(#pulseGlow)" />

        {/* static concentric rings */}
        <ellipse cx="150" cy="50" rx="75" ry="20" fill="none" stroke="#22d3ee" strokeOpacity="0.25" strokeWidth="1" />
        <ellipse cx="150" cy="50" rx="52" ry="14" fill="none" stroke="#22d3ee" strokeOpacity="0.35" strokeWidth="1" />
        <ellipse cx="150" cy="50" rx="30" ry="8" fill="none" stroke="#22d3ee" strokeOpacity="0.45" strokeWidth="1.2" />

        {/* animated expanding pulse ring */}
        <ellipse cx="150" cy="50" rx="10" ry="3" fill="none" stroke="#67e8f9" strokeWidth="1.5" opacity="0.8">
          <animate attributeName="rx" values="10;80;10" dur="3s" repeatCount="indefinite" />
          <animate attributeName="ry" values="3;22;3" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* center dot */}
        <circle cx="150" cy="50" r="3" fill="#a5f3fc">
          <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>

  </div>
</Panel>

          {/* Agent contributions */}
          {/* Agent contributions */}
<Panel title="AGENT CONTRIBUTIONS" className="h-[500px]">
  <div className="space-y-3">

    {agentGroups.map((group) => {
      const AgentIcon = group.icon;

      return (
        <div
          key={group.name}
          className={`
            relative
            rounded-2xl
            border
            ${group.border}
            ${group.bg}
            px-3 py-3
            overflow-hidden
            transition-all
          `}
        >
          {/* subtle glow */}
          <div
            className={`
              absolute
              -left-8
              top-1/2
              -translate-y-1/2
              w-24
              h-24
              rounded-full
              blur-2xl
              opacity-10
              ${group.color.replace("text-", "bg-")}
            `}
          />

          <div className="relative flex items-center gap-3">

            {/* Agent icon */}
            <div
              className={`
                shrink-0
                w-14 h-14
                rounded-full
                border
                ${group.border}
                bg-[#07111f]
                flex items-center justify-center
              `}
            >
              <AgentIcon className={`w-7 h-7 ${group.color}`} />
            </div>

            {/* Agent content */}
            <div className="min-w-0 flex-1">

              {/* Agent name */}
              <div
                className={`
                  text-xs
                  font-bold
                  tracking-wide
                  ${group.color}
                  mb-2
                `}
              >
                {group.name}
              </div>

              {/* Contribution items */}
              <div className="flex items-center gap-2 flex-wrap">
                {group.items.map((item) => {
                  const ItemIcon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-[10px]
                        text-slate-300
                      "
                    >
                      <ItemIcon
                        className={`w-3.5 h-3.5 ${group.color}`}
                      />

                      <span className="leading-none">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Percentage ring */}
            <div className="relative shrink-0 w-16 h-16">

              <svg
                viewBox="0 0 64 64"
                className="w-full h-full -rotate-90"
              >
                {/* background ring */}
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-slate-800"
                />

                {/* progress ring */}
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                strokeDasharray={`${(group.contribution / 100) * 163} 163`}
                  className={group.color}
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-bold ${group.color}`}>
                {group.contribution}%
                </span>
              </div>
            </div>

            {/* Vertical dots */}
            <div className={`hidden sm:flex flex-col gap-1 ${group.color}`}>
              <span className="w-1 h-1 rounded-full bg-current" />
              <span className="w-1 h-1 rounded-full bg-current" />
              <span className="w-1 h-1 rounded-full bg-current" />
            </div>

          </div>
        </div>
      );
    })}

    {/* Agent summary */}
    {/* <div className="grid grid-cols-2 gap-3 mt-4">

      <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-cyan-500/20 bg-cyan-500/5 flex items-center justify-center">
            <Users className="w-5 h-5 text-cyan-400" />
          </div>

          <div>
            <div className="text-[9px] tracking-widest text-slate-500">
              AGENT SUMMARY
            </div>

            <div className="text-base font-bold text-emerald-400 mt-0.5">
              7/7 ACTIVE
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-red-500/20 bg-red-950/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-red-500/20 bg-red-500/5 flex items-center justify-center">
            <Activity className="w-5 h-5 text-red-400" />
          </div>

          <div>
            <div className="text-[9px] tracking-widest text-slate-500">
              OVERALL IMPACT
            </div>

            <div className="text-base font-bold text-red-400 mt-0.5">
              HIGH
            </div>
          </div>
        </div>
      </div>

    </div> */}
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