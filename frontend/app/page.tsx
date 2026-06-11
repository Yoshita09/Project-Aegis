"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Activity,
  Wifi,
  Database,
  Cpu,
  HardDrive,
  Zap,
  Wind,
  Clock,
  Globe,
  Radio,
  AlertTriangle,
  Info,
  CheckCircle,
  Atom,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Data generators ───────────────────────────────────────────────────────────

function generateWindData() {
  const pts = [620,580,560,600,540,510,490,520,500,480,510,530,490,470,500,490,470,460,480,490,470,460,480,500,510];
  return pts.map((v, i) => ({ t: `19:${(37 + i).toString().padStart(2,"0")}`, v: v + (Math.random()-0.5)*20 }));
}
function generateBzData() {
  const pts = [1,2,0,-1,2,3,1,-2,-4,-6,-8,-5,-3,-7,-10,-8,-6,-4,-2,-5,-7,-9,-6,-4,-3];
  return pts.map((v, i) => ({ t: `19:${(37 + i).toString().padStart(2,"0")}`, v: v + (Math.random()-0.5)*1.5 }));
}
function generateProtonData() {
  const pts = [3,4,3,4,3,4,5,4,5,4,5,6,7,8,10,13,16,14,12,10,8,7,6,5,4];
  return pts.map((v, i) => ({ t: `19:${(37 + i).toString().padStart(2,"0")}`, v: v + (Math.random()-0.5)*0.5 }));
}

// ── Gauge Arc ─────────────────────────────────────────────────────────────────

function GaugeArc({ percent }: { percent: number }) {
  const r = 72, cx = 100, cy = 105;
  const startAngle = -210, sweepAngle = 240;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const pt = (a: number) => ({ x: cx + r * Math.cos(toRad(a)), y: cy + r * Math.sin(toRad(a)) });
  const s = pt(startAngle);
  const e = pt(startAngle + sweepAngle * percent / 100);
  const full = pt(startAngle + sweepAngle);
  const la = sweepAngle * percent / 100 > 180 ? 1 : 0;
  const needleA = startAngle + sweepAngle * percent / 100;
  const nx = cx + (r - 8) * Math.cos(toRad(needleA));
  const ny = cy + (r - 8) * Math.sin(toRad(needleA));

  return (
    <svg width={200} height={145} viewBox="0 0 200 145" className="w-full max-w-[200px]">
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <path d={`M ${s.x} ${s.y} A ${r} ${r} 0 1 1 ${full.x} ${full.y}`} fill="none" stroke="#1a2540" strokeWidth={10} strokeLinecap="round" />
      <path d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${la} 1 ${e.x} ${e.y}`} fill="none" stroke="url(#gaugeGrad)" strokeWidth={10} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={4} fill="#ef4444" />
    </svg>
  );
}

// ── Metric chart with axes ────────────────────────────────────────────────────

function MetricChart({
  data, color, label, unit, icon: Icon, yDomain, yTicks,
}: {
  data: { t: string; v: number }[];
  color: string; label: string; unit: string;
  icon: React.ElementType;
  yDomain?: [number, number]; yTicks?: number[];
}) {
  const xTicks = ["19:37","19:41","19:45","19:49","19:53","19:57","20:01","20:02"];
  return (
    <div className="bg-[#080e1d] rounded-xl border border-[#1a2540] p-4 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-[#4a8ab4] text-[11px] font-bold tracking-widest uppercase">
          <Icon size={12} className="flex-shrink-0" />
          <span className="truncate">{label}</span>
        </div>
        <span className="text-[#2a4060] text-[10px] flex-shrink-0 ml-2">{unit}</span>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#111c30" vertical={false} />
          <XAxis
            dataKey="t" ticks={xTicks}
            tick={{ fill: "#2a4060", fontSize: 9 }}
            axisLine={{ stroke: "#1a2540" }} tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={yDomain} ticks={yTicks}
            tick={{ fill: "#2a4060", fontSize: 9 }}
            axisLine={false} tickLine={false} width={28}
          />
          <Tooltip
            contentStyle={{ background: "#0a1525", border: "1px solid #1a2540", borderRadius: 6, fontSize: 11, color: "#8ab4d4" }}
            itemStyle={{ color }}
            labelStyle={{ color: "#4a6f8f" }}
          />
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Agent bar — fully fluid, no fixed widths ──────────────────────────────────

function AgentBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[#4a6f8f] text-[11px] leading-none">{label}</span>
        <span className="text-[11px] font-bold ml-3 flex-shrink-0 leading-none" style={{ color }}>{value}%</span>
      </div>
      <div className="h-[3px] w-full bg-[#1a2540] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

// ── Static data ───────────────────────────────────────────────────────────────

const agents = [
  {
    id: "AGENT 1", name: "Solar Vision Agent", status: "active",
    desc: "Analyzes VELC coronagraph images for coronal loop inflation, arc instability, and flux rope formation.",
    model: "ViT + Temporal Transformer",
    metrics: [
      { label: "Loop Expansion", value: 82, color: "#ef4444" },
      { label: "Flux Rope Prob.", value: 74, color: "#f59e0b" },
      { label: "Eruption Signal", value: 79, color: "#f59e0b" },
    ],
  },
  {
    id: "AGENT 2", name: "Solar Wind Agent", status: "warning",
    desc: "Processes SWIS-ASPEX particle data to detect plasma disturbances and velocity anomalies.",
    model: "LSTM / TFT",
    metrics: [
      { label: "Plasma Instability", value: 81, color: "#ef4444" },
      { label: "Wind Anomaly", value: 72, color: "#f59e0b" },
    ],
  },
  {
    id: "AGENT 3", name: "Magnetic Stress Agent", status: "active",
    desc: "Analyzes magnetometer Bx/By/Bz/Bt vectors for reconnection and field twisting signatures.",
    model: "Transformer Encoder",
    metrics: [
      { label: "Magnetic Stress", value: 89, color: "#ef4444" },
      { label: "Reconnection Prob.", value: 84, color: "#ef4444" },
    ],
  },
  {
    id: "AGENT 4", name: "Knowledge Agent", status: "active",
    desc: "Compares current signatures against SOHO CME Catalog, NASA CDAWeb, and NOAA SWPC archives.",
    model: "RAG + LLM",
    metrics: [
      { label: "Historical Match", value: 86, color: "#ef4444" },
      { label: "Pattern Confidence", value: 78, color: "#f59e0b" },
    ],
  },
];

const alerts = [
  {
    title: "CME Genesis Detected", time: "14:32 UTC",
    body: "Multi-agent consensus: 91% eruption probability. Coronal loop expansion confirmed.",
    Icon: Zap, color: "#ef4444", dotClass: "bg-red-500",
  },
  {
    title: "Magnetic Stress Elevated", time: "14:28 UTC",
    body: "Bz component showing sustained southward turning. Reconnection probability: 84%.",
    Icon: AlertTriangle, color: "#f59e0b", dotClass: "bg-amber-400",
  },
  {
    title: "Solar Wind Anomaly", time: "14:15 UTC",
    body: "SWIS-ASPEX detecting velocity spike. Proton flux 3.2x above baseline.",
    Icon: Info, color: "#38bdf8", dotClass: "bg-sky-400",
  },
  {
    title: "Satellite Safe Mode Advisory", time: "13:52 UTC",
    body: "INSAT-3D and GSAT-30 recommended for safe mode transition in T-12h.",
    Icon: CheckCircle, color: "#22c55e", dotClass: "bg-green-500",
  },
];

const systemHealth = [
  { label: "Aditya-L1 Downlink",   value: "1.2s",  icon: Wifi },
  { label: "Data Fusion Layer",     value: "45ms",  icon: Database },
  { label: "AI Inference Cluster",  value: "120ms", icon: Cpu },
  { label: "Historical DB (RAG)",   value: "85ms",  icon: HardDrive },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MissionControl() {
  const [windData]   = useState(generateWindData);
  const [bzData]     = useState(generateBzData);
  const [protonData] = useState(generateProtonData);

  return (
    <div className="min-h-screen bg-[#060d1a] p-4 xl:p-5 font-sans overflow-x-hidden">

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl xl:text-[22px] font-bold text-white tracking-tight leading-none">
          Mission Control
        </h1>
        <p className="text-[#3a5a7f] text-xs xl:text-[13px] mt-1">
          Real-time CME prediction &amp; satellite protection — Aditya-L1 data stream
        </p>
      </div>

      {/* ── Outer layout: scrollable content + fixed-width sidebar ── */}
      <div className="flex gap-4 items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* ── ROW 1: Gauge | Sun | CME Arrival ── */}
          <div className="grid grid-cols-3 gap-4">

            {/* Gauge */}
            <div className="bg-[#080e1d] rounded-xl border border-[#1a2540] flex flex-col items-center justify-center py-4 px-3">
              <GaugeArc percent={91} />
              <div className="text-[40px] xl:text-[44px] font-black text-red-500 leading-none -mt-2 tabular-nums">91%</div>
              <div className="text-[#4a6f8f] text-[10px] tracking-widest uppercase mt-2">CME Probability</div>
              <div className="mt-2 px-3 py-0.5 rounded text-red-400 border border-red-800/60 bg-red-900/25 text-[10px] font-bold tracking-[0.2em]">
                CRITICAL
              </div>
            </div>

            {/* Sun */}
            <div className="bg-[#080e1d] rounded-xl border border-[#1a2540] flex flex-col items-center justify-center gap-4 py-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-40 h-40 rounded-full bg-orange-500/10 blur-2xl" />
                <div className="absolute w-32 h-32 rounded-full bg-orange-500/15 blur-xl" />
                <div
                  className="relative w-24 h-24 xl:w-28 xl:h-28 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 38% 35%, #fbbf24, #f97316, #c2410c)",
                    boxShadow: "0 0 50px rgba(249,115,22,0.7), 0 0 25px rgba(249,115,22,0.5)",
                  }}
                >
                  <div className="absolute top-5 left-8 w-4 h-4 rounded-full bg-orange-800/50 blur-[2px]" />
                  <div className="absolute bottom-5 right-6 w-3 h-3 rounded-full bg-orange-900/40 blur-[2px]" />
                </div>
              </div>
              <div className="text-center px-2">
                <div className="text-[#3a5a7f] text-[10px] tracking-widest uppercase">VELC Feed</div>
                <div className="text-[#5a8ab0] text-[11px] mt-1">Active Region AR-13842 — Class X2.1</div>
              </div>
            </div>

            {/* CME Arrival */}
            <div className="bg-[#080e1d] rounded-xl border border-[#1a2540] p-4">
              <div className="flex items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Zap size={13} className="text-amber-400 flex-shrink-0" />
                  <span className="text-white text-[11px] font-bold tracking-[0.1em] uppercase leading-tight">
                    CME Arrival Prediction
                  </span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded border border-[#2a4060] text-[#4a8ab4] bg-[#0a1525] tracking-wider flex-shrink-0">
                  PINN Model
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-3 mb-4">
                <div>
                  <div className="flex items-center gap-1 text-[#3a5a7f] text-[10px] mb-1">
                    <Clock size={9} className="flex-shrink-0" /> Arrival Time
                  </div>
                  <div className="text-[28px] xl:text-[32px] font-black text-white leading-none tabular-nums">
                    17<span className="text-xs font-normal text-[#4a6f8f] ml-1">hrs</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#3a5a7f] text-[10px] mb-1">
                    <Zap size={9} className="flex-shrink-0" /> CME Speed
                  </div>
                  <div className="text-[28px] xl:text-[32px] font-black text-amber-400 leading-none tabular-nums">
                    1150<span className="text-xs font-normal text-[#4a6f8f] ml-1">km/s</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#3a5a7f] text-[10px] mb-1">
                    <Globe size={9} className="flex-shrink-0" /> Earth Impact
                  </div>
                  <div className="text-[28px] xl:text-[32px] font-black text-red-400 leading-none tabular-nums">
                    82<span className="text-xs font-normal text-[#4a6f8f] ml-1">%</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#3a5a7f] text-[10px] mb-1">
                    <TrendingUp size={9} className="flex-shrink-0" /> Kp Index (est)
                  </div>
                  <div className="text-[28px] xl:text-[32px] font-black text-violet-400 leading-none tabular-nums">7.5</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[9px] text-[#2a4060] mb-1">
                  <span>Sun</span><span>L1 Point</span><span>Earth</span>
                </div>
                <div className="relative h-2 rounded-full overflow-hidden"
                  style={{ background: "linear-gradient(to right, #f59e0b, #f97316, #ef4444)" }}>
                  <div className="absolute top-0 h-full w-3 bg-white/50 animate-pulse rounded-full" style={{ left: "42%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── ROW 2: 3 charts ── */}
          <div className="grid grid-cols-3 gap-4">
            <MetricChart data={windData}   color="#22d3ee" label="Solar Wind Speed" unit="km/s"  icon={Wind}  yDomain={[0, 800]}  yTicks={[0,200,400,600,800]} />
            <MetricChart data={bzData}     color="#a78bfa" label="Bz Component"     unit="nT"    icon={Atom}  yDomain={[-15, 5]}  yTicks={[-15,-10,-5,0,5]} />
            <MetricChart data={protonData} color="#fb923c" label="Proton Density"   unit="p/cm³" icon={Radio} yDomain={[0, 20]}   yTicks={[0,5,10,15,20]} />
          </div>

          {/* ── ROW 3: Agent Status ── */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-[3px] h-5 bg-cyan-500 rounded-full flex-shrink-0" />
              <span className="text-white text-[13px] font-bold tracking-widest uppercase">Agent Status</span>
              <span className="text-[#3a5a7f] text-xs">7 agents active</span>
            </div>

            {/* 4-col agent grid — each card is fully fluid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-[#080e1d] rounded-xl border border-[#1a2540] p-4 hover:border-[#253550] transition-colors flex flex-col min-w-0"
                >
                  {/* Agent header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        agent.status === "active" ? "bg-green-500" : "bg-amber-400"
                      )} />
                      <span className="text-[#3a5a7f] text-[10px] tracking-[0.15em] truncate">{agent.id}</span>
                    </div>
                    <Activity size={10} className="text-[#2a4060] flex-shrink-0" />
                  </div>

                  {/* Agent name */}
                  <div className="text-white text-[13px] font-bold mb-1 leading-tight">{agent.name}</div>

                  {/* Description */}
                  <p className="text-[#3a5070] text-[10px] leading-relaxed mb-3 flex-1">{agent.desc}</p>

                  {/* Metrics — label on top, bar below, percentage right */}
                  <div className="space-y-0 mb-3">
                    {agent.metrics.map((m) => (
                      <AgentBar key={m.label} label={m.label} value={m.value} color={m.color} />
                    ))}
                  </div>

                  {/* Model badge */}
                  <div className="mt-auto">
                    <span className="inline-block text-[10px] px-2.5 py-1 rounded-full border border-[#2a4a6a] text-[#3a6f9f] bg-[#0a1a2e]">
                      {agent.model}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="w-[270px] xl:w-[290px] flex-shrink-0 bg-[#080e1d] rounded-xl border border-[#1a2540] p-4 flex flex-col self-stretch">

          {/* Alert Timeline */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-[3px] h-4 bg-red-500 rounded-full" />
              <span className="text-white text-[11px] font-bold tracking-[0.15em] uppercase">Alert Timeline</span>
            </div>
            <span className="text-[10px] text-red-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
              LIVE
            </span>
          </div>

          <div className="space-y-2">
            {alerts.map((a) => (
              <div key={a.title} className="flex gap-2.5 p-2.5 rounded-lg bg-[#060b17] border border-[#111c30]">
                <span className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1", a.dotClass)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1 mb-0.5">
                    <span className="text-[11px] font-semibold flex items-center gap-1 leading-tight" style={{ color: a.color }}>
                      <a.Icon size={10} className="flex-shrink-0 mt-px" />
                      <span>{a.title}</span>
                    </span>
                    <span className="text-[9px] text-[#2a4060] flex-shrink-0 whitespace-nowrap ml-1">{a.time}</span>
                  </div>
                  <p className="text-[10px] text-[#3a5070] leading-relaxed">{a.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* System Health */}
          <div className="mt-4 pt-4 border-t border-[#111c30]">
            <div className="text-[#2a3a58] text-[9px] tracking-[0.2em] uppercase mb-3">System Health</div>
            <div className="space-y-2.5">
              {systemHealth.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[#4a6f8f] text-[10px] min-w-0">
                    <Icon size={10} className="text-[#2a4060] flex-shrink-0" />
                    <span className="truncate">{label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[#3a5070] text-[10px]">{value}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}