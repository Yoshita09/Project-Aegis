"use client";

import Topbar from "@/components/Topbar";
import { Panel, ProgressBar } from "@/components/ui";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { Clock, Gauge, Target, CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface VelocityDataPoint {
  t: string;
  speed: number;
  threshold: number;
}

interface ImpactZone {
  label: string;
  value: number;
  icon: React.ElementType | string;
  color: string;
}

interface TimelineEvent {
  time: string;
  title: string;
  desc: string;
  done?: boolean;
  current?: boolean;
}

interface WhyPinn {
  title: string;
  desc: string;
}

import React from "react";

const velocityData: VelocityDataPoint[] = Array.from({ length: 24 }, (_, i) => ({
  t: `T+${i}h`,
  speed: 1083 + Math.sin(i / 3) * 60 + (Math.random() - 0.5) * 30,
  threshold: 1100,
}));

const impactZones: ImpactZone[] = [
  { label: "Magnetosphere", value: 80, icon: Target, color: "bg-red-400" },
  { label: "Ionosphere", value: 70, icon: "⚡", color: "bg-amber-400" },
  { label: "Power Grid", value: 58, icon: "⚠", color: "bg-amber-400" },
  { label: "GPS/GNSS", value: 52, icon: "✓", color: "bg-emerald-400" },
  { label: "HF Radio", value: 64, icon: "⚡", color: "bg-amber-400" },
];

const timeline: TimelineEvent[] = [
  {
    time: "T+0h",
    title: "CME Genesis Detected",
    desc: "SolarShield AI identifies flux rope formation and loop instability via Vision Agent",
    done: true,
  },
  {
    time: "T+1h",
    title: "CME Eruption Confirmed",
    desc: "VELC coronagraph confirms full eruption — Arrival prediction model activated",
    done: true,
  },
  {
    time: "T+7h",
    title: "Passing Aditya-L1 (L1 Point)",
    desc: "CME sheath structure detected at Sun-Earth L1 point — Magnetometer spike",
    current: true,
  },
  {
    time: "T+18.4h",
    title: "Earth Impact (Predicted)",
    desc: "CME at 1083 km/s strikes Earth's magnetosphere — G4 storm expected",
  },
  {
    time: "T+30.4h",
    title: "Storm Recovery",
    desc: "Geomagnetic storm begins to subside — All-clear assessment initiated",
  },
];

const whyPinn: WhyPinn[] = [
  { title: "Conservation Laws", desc: "Embeds MHD equations — mass, momentum, energy conservation" },
  { title: "Solar Wind Drag", desc: "Accounts for CME deceleration through ambient solar wind" },
  { title: "Magnetic Field", desc: "Models southward Bz rotation during CME transit" },
  { title: "Uncertainty", desc: "Provides probabilistic arrival window, not just point estimate" },
];

export default function ArrivalImpactPage() {
  return (
    <div>
      <Topbar
        title="ARRIVAL & IMPACT"
        badge="PINN MODEL"
        badgeColor="amber"
        subtitle="Physics-Informed Neural Network — CME propagation model"
      />

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left col */}
          <div className="space-y-6">
            <Panel title="CME ARRIVAL PREDICTION" right={<span className="text-[10px] border border-amber-500/30 bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">PINN MODEL</span>}>
              <div className="space-y-3">
                <div className="bg-[#0b1018] border border-slate-800/60 rounded-md p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-[10px] text-slate-500 tracking-widest">ESTIMATED ARRIVAL</div>
                    <div className="text-2xl font-bold text-slate-100 mt-0.5">
                      18.4 <span className="text-sm text-slate-500 font-normal">hours</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0b1018] border border-slate-800/60 rounded-md p-4 flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-[10px] text-slate-500 tracking-widest">PREDICTED SPEED</div>
                    <div className="text-2xl font-bold text-slate-100 mt-0.5">
                      1083 <span className="text-sm text-slate-500 font-normal">km/s</span>
                    </div>
                  </div>
                </div>
                <div className="bg-red-950/30 border border-red-500/30 rounded-md p-4 flex items-center gap-3">
                  <Target className="w-5 h-5 text-red-400" />
                  <div>
                    <div className="text-[10px] text-slate-500 tracking-widest">EARTH IMPACT CHANCE</div>
                    <div className="text-2xl font-bold text-red-400 mt-0.5">
                      80<span className="text-sm font-normal">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-[10px] text-slate-500 tracking-widest mb-3 flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3" /> TRAJECTORY MODEL
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full bg-amber-400 shrink-0" />
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full relative">
                    <div className="absolute left-0 top-0 h-full w-[78%] bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full" />
                    <div className="absolute -top-1 left-[78%] w-3.5 h-3.5 rounded-full bg-cyan-300 border-2 border-[#0d1320]" />
                  </div>
                  <span className="w-4 h-4 rounded-full bg-cyan-400 shrink-0" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>SUN</span>
                  <span>EARTH</span>
                </div>
              </div>
            </Panel>

            <Panel title="IMPACT ZONES">
              <div className="space-y-3">
                {impactZones.map((z) => (
                  <div key={z.label}>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>{z.label}</span>
                      <span className={`font-semibold ${z.color === "bg-red-400" ? "text-red-400" : z.color === "bg-amber-400" ? "text-amber-400" : "text-emerald-400"}`}>
                        {z.value}%
                      </span>
                    </div>
                    <ProgressBar value={z.value} color={z.color} />
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Right col */}
          <div className="lg:col-span-2 space-y-6">
            <Panel title="CME VELOCITY PROFILE (L1 → EARTH)">
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={velocityData}>
                  <defs>
                    <linearGradient id="velGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="t" stroke="#475569" fontSize={10} interval={4} />
                  <YAxis stroke="#475569" fontSize={10} domain={[0, 1200]} ticks={[0, 300, 600, 900, 1200]} />
                  <Tooltip contentStyle={{ background: "#0d1320", border: "1px solid #1e293b", fontSize: 12 }} labelStyle={{ color: "#94a3b8" }} />
                  <Area type="monotone" dataKey="speed" stroke="#fbbf24" fill="url(#velGradient)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="threshold" stroke="#f87171" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="EVENT TIMELINE">
              <div className="space-y-5">
                {timeline.map((ev, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {ev.done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : ev.current ? (
                        <span className="w-5 h-5 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        </span>
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600" />
                      )}
                      {idx !== timeline.length - 1 && (
                        <div className="w-px flex-1 bg-slate-800 mt-1" />
                      )}
                    </div>
                    <div className="pb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono ${ev.done ? "text-emerald-400" : ev.current ? "text-cyan-400" : "text-slate-500"}`}>
                          {ev.time}
                        </span>
                        <span className={`text-sm font-bold ${ev.current ? "text-slate-100" : "text-slate-300"}`}>
                          {ev.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{ev.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        <Panel title="WHY PHYSICS-INFORMED NEURAL NETWORK?">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyPinn.map((item) => (
              <div key={item.title} className="bg-[#0b1018] border border-slate-800/60 rounded-md p-4">
                <div className="text-sm font-bold text-cyan-300 mb-1.5">{item.title}</div>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
