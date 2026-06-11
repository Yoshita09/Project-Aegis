"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { cn } from "@/lib/utils";
import {
  Activity, Wifi, Database, Cpu, HardDrive, Zap, Wind 
} from "lucide-react";
// ── Helpers ──────────────────────────────────────────────────────────────────

function generateWaveData(
  points = 25,
  base = 450,
  amplitude = 80,
  noise = 30
) {
  return Array.from({ length: points }, (_, i) => ({
    t: `19:${(37 + i).toString().padStart(2, "0")}`,
    v: base + Math.sin(i * 0.5) * amplitude + (Math.random() - 0.5) * noise,
  }));
}

function generateBzData(points = 25) {
  return Array.from({ length: points }, (_, i) => ({
    t: `19:${(37 + i).toString().padStart(2, "0")}`,
    v: Math.sin(i * 0.7) * 6 + (Math.random() - 0.5) * 4,
  }));
}

function generateProtonData(points = 25) {
  return Array.from({ length: points }, (_, i) => ({
    t: `19:${(37 + i).toString().padStart(2, "0")}`,
    v:
      i > 12
        ? 4 + Math.random() * 3 + (i - 12) * 0.4
        : 3 + Math.random() * 2,
  }));
}

// ── Sub-components ────────────────────────────────────────────────────────────

function GaugeArc({ percent }: { percent: number }) {
  const r = 80;
  const cx = 110;
  const cy = 110;
  const startAngle = -210;
  const sweepAngle = 240;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const arc = (angle: number) => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  });
  const endAngle = startAngle + sweepAngle * (percent / 100);
  const s = arc(startAngle);
  const e = arc(endAngle);
  const full = arc(startAngle + sweepAngle);
  const largeArc = sweepAngle * (percent / 100) > 180 ? 1 : 0;
  const largeTrack = sweepAngle > 180 ? 1 : 0;

  // needle
  const needleAngle = startAngle + sweepAngle * (percent / 100);
  const nx = cx + (r - 10) * Math.cos(toRad(needleAngle));
  const ny = cy + (r - 10) * Math.sin(toRad(needleAngle));

  return (
    <svg width={220} height={160} viewBox="0 0 220 160">
      {/* Track */}
      <path
        d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${largeTrack} 1 ${full.x} ${full.y}`}
        fill="none"
        stroke="#1a2540"
        strokeWidth={12}
        strokeLinecap="round"
      />
      {/* Fill gradient */}
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <path
        d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`}
        fill="none"
        stroke="url(#gaugeGrad)"
        strokeWidth={12}
        strokeLinecap="round"
      />
      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke="#ef4444"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={4} fill="#ef4444" />
    </svg>
  );
}

function MiniChart({
  data,
  color,
  label,
  unit,
}: {
  data: { t: string; v: number }[];
  color: string;
  label: string;
  unit: string;
}) {
  return (
    <div className="bg-[#080e1d] rounded-xl border border-[#1a2540] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-[#4a8ab4] text-xs font-semibold tracking-wider uppercase">
          <Wind size={12} />
          {label}
        </div>
        <span className="text-[#2a4060] text-[10px]">{unit}</span>
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={data}>
          <XAxis dataKey="t" hide />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "#0a1525",
              border: "1px solid #1a2540",
              borderRadius: 6,
              fontSize: 11,
              color: "#8ab4d4",
            }}
            itemStyle={{ color }}
          />
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function AgentBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between text-[11px] mb-1.5">
      <span className="text-[#4a6f8f] w-28 truncate">{label}</span>
      <div className="flex items-center gap-2 flex-1 ml-2">
        <div className="flex-1 h-1 bg-[#1a2540] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${value}%`, background: color }}
          />
        </div>
        <span style={{ color }} className="w-7 text-right font-bold">
          {value}%
        </span>
      </div>
    </div>
  );
}

const agents = [
  {
    id: "AGENT 1",
    name: "Solar Vision Agent",
    desc: "Analyzes VELC coronagraph images for coronal loop inflation, arc instability, and flux rope formation.",
    model: "ViT + Temporal Transformer",
    modelColor: "#4a8ab4",
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
    modelColor: "#4a6f8f",
    status: "warning",
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
    modelColor: "#4a8ab4",
    status: "active",
    metrics: [
      { label: "Magnetic Stress", value: 89, color: "#ef4444" },
      { label: "Reconnection Prob.", value: 84, color: "#ef4444" },
    ],
  },
  {
    id: "AGENT 4",
    name: "Knowledge Agent",
    desc: "Compares current signatures against SOHO CME Catalog, NASA CDAWeb, and NOAA SWPC archives.",
    model: "RAG + LLM",
    modelColor: "#4a6f8f",
    status: "active",
    metrics: [
      { label: "Historical Match", value: 86, color: "#ef4444" },
      { label: "Pattern Confidence", value: 78, color: "#f59e0b" },
    ],
  },
];

const alerts = [
  {
    level: "critical",
    title: "CME Genesis Detected",
    time: "14:32 UTC",
    body: "Multi-agent consensus: 91% eruption probability. Coronal loop expansion confirmed.",
    icon: "⚡",
    color: "#ef4444",
    dot: "bg-red-500",
  },
  {
    level: "warning",
    title: "Magnetic Stress Elevated",
    time: "14:28 UTC",
    body: "Bz component showing sustained southward turning. Reconnection probability: 84%.",
    icon: "⚠",
    color: "#f59e0b",
    dot: "bg-amber-500",
  },
  {
    level: "info",
    title: "Solar Wind Anomaly",
    time: "14:15 UTC",
    body: "SWIS-ASPEX detecting velocity spike. Proton flux 3.2x above baseline.",
    icon: "ℹ",
    color: "#38bdf8",
    dot: "bg-sky-500",
  },
  {
    level: "ok",
    title: "Satellite Safe Mode Advisory",
    time: "13:52 UTC",
    body: "INSAT-3D and GSAT-30 recommended for safe mode transition in T-12h.",
    icon: "✓",
    color: "#22c55e",
    dot: "bg-green-500",
  },
];

const systemHealth = [
  { label: "Aditya-L1 Downlink", value: "1.2s", ok: true, icon: Wifi },
  { label: "Data Fusion Layer", value: "45ms", ok: true, icon: Database },
  { label: "AI Inference Cluster", value: "120ms", ok: true, icon: Cpu },
  { label: "Historical DB (RAG)", value: "85ms", ok: true, icon: HardDrive },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MissionControl() {
  const [windData] = useState(generateWaveData);
  const [bzData] = useState(generateBzData);
  const [protonData] = useState(generateProtonData);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#060d1a] px-6 py-6 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Mission Control</h1>
        <p className="text-[#3a5a7f] text-sm mt-0.5">
          Real-time CME prediction &amp; satellite protection — Aditya-L1 data stream
        </p>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {/* Gauge */}
        <div className="bg-[#080e1d] rounded-xl border border-[#1a2540] flex flex-col items-center justify-center py-4 px-3">
          <GaugeArc percent={91} />
          <div className="text-5xl font-black text-red-500 -mt-6 tabular-nums">91%</div>
          <div className="text-[#4a6f8f] text-xs tracking-widest uppercase mt-1">CME Probability</div>
          <div className="mt-2 px-3 py-0.5 rounded text-red-400 border border-red-800 bg-red-900/30 text-[10px] font-bold tracking-widest">
            CRITICAL
          </div>
        </div>

        {/* Sun visual */}
        <div className="bg-[#080e1d] rounded-xl border border-[#1a2540] flex flex-col items-center justify-center gap-3 py-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-radial from-orange-400 via-orange-500 to-amber-700 shadow-[0_0_60px_rgba(249,115,22,0.6),0_0_30px_rgba(249,115,22,0.4)]" />
            <div className="absolute top-3 left-6 w-4 h-4 rounded-full bg-orange-700/60 blur-sm" />
            <div className="absolute bottom-4 right-5 w-3 h-3 rounded-full bg-orange-800/50 blur-sm" />
          </div>
          <div className="text-center">
            <div className="text-[#3a5a7f] text-[10px] tracking-widest uppercase">VELC Feed</div>
            <div className="text-[#6a9abf] text-xs mt-1">Active Region AR-13842 — Class X2.1</div>
          </div>
        </div>

        {/* CME Arrival */}
        <div className="bg-[#080e1d] rounded-xl border border-[#1a2540] p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-amber-400" />
              <span className="text-white text-sm font-bold tracking-wider uppercase">CME Arrival Prediction</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded border border-[#2a4060] text-[#4a8ab4] bg-[#0a1525]">
              PINN Model
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              
            ].map(({ icon, label, value, unit, color }) => (
              <div key={label}>
                <div className="text-[#3a5a7f] text-[10px] flex items-center gap-1 mb-1">
                  <span>{icon}</span> {label}
                </div>
                <div className={`text-3xl font-black tabular-nums ${color}`}>
                  {value}<span className="text-sm font-normal ml-1 text-[#4a6f8f]">{unit}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Transit bar */}
          <div className="mt-2">
            <div className="flex justify-between text-[9px] text-[#2a4060] mb-1">
              <span>Sun</span><span>L1 Point</span><span>Earth</span>
            </div>
            <div className="h-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-red-500 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full w-3 bg-white/40 animate-pulse rounded-full"
                style={{ left: "40%" }}
              />
            </div>
          </div>
        </div>

        {/* Alert timeline */}
        <div className="bg-[#080e1d] rounded-xl border border-[#1a2540] p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white text-xs font-bold tracking-wider uppercase">Alert Timeline</span>
            <span className="text-[10px] text-red-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
              LIVE
            </span>
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {alerts.map((a) => (
              <div
                key={a.title}
                className="rounded-lg p-2.5"
                style={{ background: `${a.color}08`, border: `1px solid ${a.color}20` }}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: a.color }}>
                    {a.icon} {a.title}
                  </span>
                  <span className="text-[9px] text-[#2a4060]">{a.time}</span>
                </div>
                <p className="text-[10px] text-[#4a6f8f] leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
          {/* System health */}
          <div className="mt-3 pt-3 border-t border-[#1a2540]">
            <div className="text-[#2a4060] text-[9px] tracking-widest uppercase mb-2">System Health</div>
            <div className="space-y-1.5">
              {systemHealth.map(({ label, value, ok, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#4a6f8f] text-[10px]">
                    <Icon size={10} />
                    {label}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#3a5a7f] text-[10px]">{value}</span>
                    <span className={cn("w-1.5 h-1.5 rounded-full", ok ? "bg-green-500" : "bg-red-500")} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <MiniChart data={windData} color="#22d3ee" label="Solar Wind Speed" unit="km/s" />
        <MiniChart data={bzData} color="#a78bfa" label="Bz Component" unit="nT" />
        <MiniChart data={protonData} color="#fb923c" label="Proton Density" unit="p/cm³" />
      </div>

      {/* Agent Status */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-4 bg-cyan-500 rounded-full" />
          <span className="text-white text-sm font-bold tracking-wider uppercase">Agent Status</span>
          <span className="text-[#3a5a7f] text-xs">7 agents active</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-[#080e1d] rounded-xl border border-[#1a2540] p-4 hover:border-[#2a4060] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      agent.status === "active" ? "bg-green-500" : "bg-amber-500"
                    )}
                  />
                  <span className="text-[#3a5a7f] text-[10px] tracking-widest">{agent.id}</span>
                </div>
                <Activity size={10} className="text-[#2a4060]" />
              </div>
              <div className="text-white text-sm font-bold mb-1">{agent.name}</div>
              <p className="text-[#3a5a7f] text-[10px] leading-relaxed mb-3">{agent.desc}</p>
              <div className="space-y-0">
                {agent.metrics.map((m) => (
                  <AgentBar key={m.label} label={m.label} value={m.value} color={m.color} />
                ))}
              </div>
              <div className="mt-3">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full border"
                  style={{
                    color: agent.modelColor,
                    borderColor: `${agent.modelColor}40`,
                    background: `${agent.modelColor}10`,
                  }}
                >
                  {agent.model}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}