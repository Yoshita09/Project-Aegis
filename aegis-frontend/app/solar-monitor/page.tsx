"use client";

import Topbar from "@/components/Topbar";
import { Panel, StatCard } from "@/components/ui";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Wind, Thermometer, CircleDot, Activity, LucideIcon } from "lucide-react";

interface WindDataPoint {
  t: string;
  speed: number;
  baseline: number;
}

interface MagDataPoint {
  t: string;
  Bz: number;
  Density: number;
}

interface MagneticField {
  Bx: number;
  By: number;
  Bz: number;
  Bt: number;
}

interface SolarWindReading {
  label: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  color: string;
}

interface MagFieldReading {
  label: string;
  value: string;
  unit: string;
  color: string;
  note?: string;
}

// Mock: last 60 readings for solar wind telemetry
const windData: WindDataPoint[] = Array.from({ length: 60 }, (_, i) => ({
  t: `T-${60 - i}`,
  speed: 480 + Math.sin(i / 4) * 15 + (Math.random() - 0.5) * 8,
  baseline: 30,
}));

// Mock: magnetic field components over time
const magData: MagDataPoint[] = Array.from({ length: 60 }, (_, i) => ({
  t: `T-${i}`,
  Bz: 7.5 + Math.sin(i / 5) * 1.5 + (Math.random() - 0.5),
  Density: 8 + Math.cos(i / 6) * 1.2 + (Math.random() - 0.5),
}));

const magneticField: MagneticField = { Bx: -2.6, By: 4.9, Bz: -8.7, Bt: 9.7 };

const detailedReadings: { solarWind: SolarWindReading[]; magField: MagFieldReading[] } = {
  solarWind: [
    { label: "Velocity", value: "500", unit: "km/s", icon: Wind, color: "text-cyan-300" },
    { label: "Proton Density", value: "8.3", unit: "p/cm³", icon: CircleDot, color: "text-emerald-400" },
    { label: "Temperature", value: "138", unit: "×10³ K", icon: Thermometer, color: "text-amber-400" },
    { label: "Proton Flux", value: "30.8", unit: "×10³ /cm²/s", icon: Activity, color: "text-purple-400" },
    { label: "Alpha Flux", value: "1092", unit: "/cm²/s", icon: Activity, color: "text-slate-300" },
  ],
  magField: [
    { label: "Bx Component", value: "-2.6", unit: "nT", color: "text-red-400" },
    { label: "By Component", value: "4.9", unit: "nT", color: "text-emerald-400" },
    { label: "Bz Component", value: "-8.7", unit: "nT", color: "text-red-400", note: "Southward = geoeffective" },
    { label: "Bt (Total)", value: "9.7", unit: "nT", color: "text-cyan-300" },
    { label: "Magnetic Stress", value: "HIGH", unit: "", color: "text-red-400" },
  ],
};

export default function SolarMonitorPage() {
  return (
    <div>
      <Topbar
        title="SOLAR MONITOR"
        badge="LIVE DATA"
        badgeColor="green"
        subtitle="Aditya-L1 VELC · SWIS-ASPEX · Magnetometer — Real-time telemetry"
      />

      <div className="p-8 space-y-6">
        {/* Top row: Live monitoring + Wind telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live solar monitoring */}
          <Panel
            title="LIVE SOLAR MONITORING"
            right={
              <span className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            }
          >
            <div className="flex items-center justify-center py-6">
              <div className="relative w-48 h-48 rounded-full border border-cyan-500/20 flex items-center justify-center">
                <div className="absolute inset-3 rounded-full border border-cyan-500/10" />
                <div className="absolute top-2 right-6 w-16 h-1 rounded-full bg-gradient-to-r from-red-500/60 to-transparent rotate-12" />
                <span className="text-[10px] text-cyan-400 tracking-widest font-semibold">
                  VELC CORONAGRAPH
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={<Wind className="w-3 h-3" />} label="SOLAR WIND" value="500" unit="km/s" color="text-cyan-300" />
              <StatCard icon={<Thermometer className="w-3 h-3" />} label="TEMPERATURE" value="138K" unit="×10³" color="text-amber-400" />
              <StatCard icon={<CircleDot className="w-3 h-3" />} label="DENSITY" value="8.3" unit="p/cm³" color="text-emerald-400" />
              <StatCard icon={<Activity className="w-3 h-3" />} label="MAG. STRESS" value="HIGH" color="text-red-400" />
            </div>

            <div className="mt-4">
              <div className="text-[10px] text-slate-500 tracking-widest mb-2">
                MAGNETIC FIELD (nT)
              </div>
              <div className="grid grid-cols-4 text-center">
                {(Object.entries(magneticField) as [string, number][]).map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[10px] text-slate-500">{k}</div>
                    <div className={`text-base font-bold ${v < 0 ? "text-red-400" : "text-emerald-400"}`}>
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          {/* Solar wind telemetry */}
          <Panel
            title="SOLAR WIND TELEMETRY"
            icon={<Wind className="w-3.5 h-3.5" />}
            right={<span className="text-[10px] text-slate-500">LAST 60 READINGS</span>}
            className="lg:col-span-2"
          >
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={windData}>
                <defs>
                  <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" stroke="#475569" fontSize={10} interval={4} />
                <YAxis stroke="#475569" fontSize={10} domain={[0, 600]} ticks={[0, 150, 300, 450, 600]} />
                <Tooltip
                  contentStyle={{ background: "#0d1320", border: "1px solid #1e293b", fontSize: 12 }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Area type="monotone" dataKey="speed" stroke="#22d3ee" fill="url(#windGradient)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="baseline" stroke="#f87171" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        {/* Magnetic field components */}
        <Panel title="MAGNETIC FIELD COMPONENTS (nT)" icon={<Activity className="w-3.5 h-3.5" />}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={magData}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="t" stroke="#475569" fontSize={10} interval={9} />
              <YAxis stroke="#475569" fontSize={10} domain={[0, 12]} ticks={[0, 3, 6, 9, 12]} />
              <Tooltip
                contentStyle={{ background: "#0d1320", border: "1px solid #1e293b", fontSize: 12 }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Line type="monotone" dataKey="Bz" stroke="#f87171" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Density" stroke="#34d399" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Bz</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Density</span>
          </div>
        </Panel>

        {/* Detailed readings */}
        <Panel title="DETAILED READINGS" icon={<Activity className="w-3.5 h-3.5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            <div>
              <div className="text-[10px] text-slate-500 tracking-widest mb-2">SOLAR WIND (SWIS-ASPEX)</div>
              <div className="space-y-2.5">
                {detailedReadings.solarWind.map((r) => {
                  const Icon = r.icon;
                  return (
                    <div key={r.label} className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                      <span className="flex items-center gap-2 text-sm text-slate-300">
                        <Icon className="w-4 h-4 text-slate-500" />
                        {r.label}
                      </span>
                      <span className={`font-bold ${r.color}`}>
                        {r.value} <span className="text-xs text-slate-500 font-normal">{r.unit}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 tracking-widest mb-2">MAGNETIC FIELD (MAG)</div>
              <div className="space-y-2.5">
                {detailedReadings.magField.map((r) => (
                  <div key={r.label} className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Activity className="w-4 h-4 text-slate-500" />
                        {r.label}
                      </div>
                      {r.note && <div className="text-[10px] text-slate-500 ml-6">{r.note}</div>}
                    </div>
                    <span className={`font-bold ${r.color}`}>
                      {r.value} <span className="text-xs text-slate-500 font-normal">{r.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
