"use client";

import Topbar from "@/components/Topbar";
import CoronalDifferenceCanvas from "@/components/CoronalDifferenceCanvas";
import { Panel, StatCard } from "@/components/ui";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

import {
  Wind,
  Thermometer,
  CircleDot,
  Activity,
} from "lucide-react";


interface MagDataPoint {
  t: string;
  Bx: number;
  By: number;
  Bz: number;
  Bt: number;
}

interface MagneticField {
  Bx: number;
  By: number;
  Bz: number;
  Bt: number;
}

interface SolarWindTelemetryPoint {
  t: string;
  speed: number;
  density: number;
  temperature: number;
}

interface MagFieldReading {
  label: string;
  value: string;
  unit: string;
  color: string;
  note?: string;
}
const detailedReadings: {
  solarWind: MagFieldReading[];
  magField: MagFieldReading[];
} = {
  solarWind: [
    {
      label: "Bulk Speed",
      value: "500",
      unit: "km/s",
      color: "text-cyan-400",
    },
    {
      label: "Proton Density",
      value: "8.3",
      unit: "cm⁻³",
      color: "text-emerald-400",
    },
    {
      label: "Proton Temperature",
      value: "138",
      unit: "×10³ K",
      color: "text-amber-400",
    },
  ],

  magField: [
    {
      label: "Bx",
      value: "-2.6",
      unit: "nT",
      color: "text-red-400",
    },
    {
      label: "By",
      value: "4.9",
      unit: "nT",
      color: "text-emerald-400",
    },
    {
      label: "Bz",
      value: "-8.7",
      unit: "nT",
      color: "text-red-400",
    },
    {
      label: "Bt",
      value: "9.7",
      unit: "nT",
      color: "text-emerald-400",
    },
  ],
};

// Mock: last 60 readings for solar wind telemetry


// Mock: interplanetary magnetic-field components over time.
// The shape is intentionally similar to a real GSE magnetic-field trace:
// Bx / By / Bz components plus total field magnitude |B|.
const magData: MagDataPoint[] = Array.from({ length: 97 }, (_, i) => {
  const hour = i;
  const day = 6 + Math.floor(hour / 24);
  const hourOfDay = hour % 24;
  const t = `${String(day).padStart(2, "0")} Aug ${String(hourOfDay).padStart(2, "0")}:00`;

  // Background magnetic-field variation.
  let bx =
    2.5 * Math.sin(i / 4.8) +
    1.8 * Math.sin(i / 1.9) -
    1.5;

  let by =
    6 +
    5.5 * Math.sin(i / 7.5) +
    2.2 * Math.cos(i / 2.7);

  let bz =
    -8 -
    6.5 * Math.sin(i / 8.2) +
    2.5 * Math.cos(i / 2.3);

  // ICME interval: strong magnetic-field compression and southward Bz.
  if (i >= 37 && i <= 48) {
    const p = (i - 37) / 11;
    bx -= 5 + 4 * Math.sin(p * Math.PI);
    by += 4 + 7 * Math.sin(p * Math.PI);
    bz -= 10 + 10 * Math.sin(p * Math.PI);
  }

  // Post-arrival rotation / recovery.
  if (i > 48 && i <= 72) {
    const p = (i - 48) / 24;
    bx += -4 + 5 * p;
    by += 6 - 8 * p;
    bz += -8 + 12 * p;
  }

  // Small deterministic fluctuations so the traces look telemetry-like.
  bx += Math.sin(i * 2.7) * 1.1;
  by += Math.sin(i * 3.1) * 0.9;
  bz += Math.cos(i * 2.4) * 1.2;

  const bt = Math.sqrt(bx * bx + by * by + bz * bz);

  return {
    t,
    Bx: Number(bx.toFixed(1)),
    By: Number(by.toFixed(1)),
    Bz: Number(bz.toFixed(1)),
    Bt: Number(bt.toFixed(1)),
  };
});

const magneticField: MagneticField = { Bx: -2.6, By: 4.9, Bz: -8.7, Bt: 9.7 };

const solarWindTelemetryData: SolarWindTelemetryPoint[] = Array.from(
  { length: 49 },
  (_, i) => {
    const hour = i / 2;
    const time = `${String(Math.floor(hour)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`;

    // Bulk speed: ~450 km/s before ICME, strong rise after arrival
    let speed =
      455 +
      Math.sin(i / 3.5) * 18 +
      Math.sin(i / 1.8) * 5 +
      Math.sin(i * 2.7) * 4 +
      Math.cos(i * 1.35) * 2.5;

    if (hour >= 9.5 && hour < 11.5) {
      speed += (hour - 9.5) * 75;
    } else if (hour >= 11.5) {
      speed += 150 - (hour - 11.5) * 3;
    }

    // Proton density: sharp enhancement around ICME arrival
    let density =
      5.5 +
      Math.sin(i / 4) * 0.8 +
      Math.sin(i / 1.7) * 0.3 +
      Math.sin(i * 2.4) * 0.45 +
      Math.cos(i * 1.1) * 0.25;

    if (hour >= 9 && hour < 12) {
      density += 28 * Math.exp(-Math.pow(hour - 10.5, 2) / 1.2);
    } else if (hour >= 12) {
      density += 8 * Math.exp(-(hour - 12) / 6);
    }

    // Proton temperature: gradual rise + post-arrival peak
    let temperature =
      1.2e4 +
      hour * 700 +
      Math.sin(i / 4) * 500;

    if (hour >= 9.5) {
      temperature += 1.8e4 * Math.exp(-Math.pow(hour - 12, 2) / 10);
    }

    return {
      t: time,
      speed: Math.round(speed),
      density: Number(density.toFixed(1)),
      temperature: Math.round(temperature),
    };
  }
);

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
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_2.1fr] gap-6 items-stretch">
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
            {/* Coronal difference image */}
            <div className="mb-4">
              <div className="text-[10px] text-slate-500 tracking-widest mb-3">
                CORONAL DIFFERENCE IMAGE (14:54 UT − 12:54 UT)
              </div>
              <div className="flex items-center gap-6">
                <div
                  className="relative shrink-0 overflow-hidden"
                  style={{ width: 200, height: 200, minWidth: 200, maxWidth: 200 }}
                >
                  <CoronalDifferenceCanvas size={200} />
                  <span className="absolute right-[6%] top-[10%] text-[9px] text-amber-300 whitespace-nowrap">
                    1.5 R☉
                  </span>
                  <span className="absolute right-[2%] bottom-[4%] text-[9px] text-amber-300 whitespace-nowrap">
                    2.5 R☉
                  </span>
                </div>

                <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "8px",
    marginLeft: "18px",
  }}
>
  <div
    style={{
      color: "#94a3b8",
      fontSize: "12px",
      fontWeight: 500,
      marginBottom: "4px",
      whiteSpace: "nowrap",
    }}
  >
    ΔIntensity (%)
  </div>

  <div
    style={{
      display: "flex",
      alignItems: "stretch",
      gap: "8px",
      height: "120px",
    }}
  >
    {/* Color bar */}
    <div
      style={{
        width: "12px",
        height: "120px",
        borderRadius: "12px",
        background:
          "linear-gradient(to bottom, #dc4c4c 0%, #6b3840 35%, #102f40 50%, #248fbd 75%, #229dcc 100%)",
      }}
    />

    {/* Labels */}
    <div
      style={{
        height: "120px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontSize: "10px",
        lineHeight: 1,
      }}
    >
      <span style={{ color: "#ef5350" }}>+50</span>
      <span style={{ color: "#94a3b8" }}>0</span>
      <span style={{ color: "#29a9d6" }}>−50</span>
    </div>
  </div>
</div>
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
            className="lg:col-span-1 h-full"
          >
            <div className="space-y-8 h-full">

  {/* Bulk Speed */}
  <div>
    <div className="text-sm font-medium text-slate-300 mb-1">
      Bulk Speed (km/s)
    </div>

    <div className="w-full h-[220px] min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
      <LineChart data={solarWindTelemetryData} margin={{ top: 8, right: 16, left: 4, bottom: 8 }}>
        <CartesianGrid
          stroke="#1e293b"
          strokeDasharray="3 3"
          vertical={false}
        />

        <XAxis
          dataKey="t"
          stroke="#475569"
          fontSize={10}
          interval={7}
        />

        <YAxis
          stroke="#475569"
          fontSize={10}
          domain={[0, 800]}
          ticks={[0, 200, 400, 600, 800]}
        />

        <Tooltip
          contentStyle={{
            background: "#0d1320",
            border: "1px solid #1e293b",
            fontSize: 12,
          }}
          labelStyle={{ color: "#94a3b8" }}
        />

        <ReferenceLine
          x="10:00"
          stroke="#22d3ee"
          strokeDasharray="6 4"
          label={{
            value: "ICME Arrival",
            position: "top",
            fill: "#22d3ee",
            fontSize: 10,
          }}
        />

        <Line
          type="monotone"
          dataKey="speed"
          stroke="#22d3ee"
          strokeWidth={2.5}
          dot={false}
 />
      </LineChart>
      </ResponsiveContainer>
    </div>
  </div>


  {/* Proton Number Density */}
  <div>
    <div className="text-sm font-medium text-slate-300 mb-1">
      Proton Number Density (cm⁻³)
    </div>

    <div className="w-full h-[220px] min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
      <LineChart data={solarWindTelemetryData} margin={{ top: 8, right: 16, left: 4, bottom: 8 }}>
        <CartesianGrid
          stroke="#1e293b"
          strokeDasharray="3 3"
          vertical={false}
        />

        <XAxis
          dataKey="t"
          stroke="#475569"
          fontSize={10}
          interval={7}
        />

        <YAxis
          stroke="#475569"
          fontSize={10}
          domain={[0, 40]}
          ticks={[0, 10, 20, 30, 40]}
        />

        <Tooltip
          contentStyle={{
            background: "#0d1320",
            border: "1px solid #1e293b",
            fontSize: 12,
          }}
          labelStyle={{ color: "#94a3b8" }}
        />

        <ReferenceLine
          x="10:00"
          stroke="#22d3ee"
          strokeDasharray="6 4"
        />

        <Line
          type="monotone"
          dataKey="density"
          stroke="#22d3ee"
          strokeWidth={2.5}
          dot={false}
 />
      </LineChart>
      </ResponsiveContainer>
    </div>
  </div>


</div>
          </Panel>
        </div>

        {/* VELC Coronagraph Sequence */}
        

        {/* Magnetic field components */}
        <Panel
          title="MAGNETIC FIELD COMPONENTS (nT)"
          icon={<Activity className="w-3.5 h-3.5" />}
        >
          <div className="w-full min-w-0 h-[360px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
              <LineChart
                data={magData}
                margin={{ top: 18, right: 18, left: 4, bottom: 8 }}
              >
                <CartesianGrid
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="t"
                  stroke="#475569"
                  fontSize={10}
                  interval={11}
                  tickLine={false}
                  axisLine={{ stroke: "#334155" }}
                />

                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  domain={[-40, 40]}
                  ticks={[-40, -20, 0, 20, 40]}
                  tickLine={false}
                  axisLine={{ stroke: "#334155" }}
                  label={{
                    value: "B (nT)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                />

                <ReferenceLine
                  y={0}
                  stroke="#475569"
                  strokeWidth={1}
                />

                <ReferenceArea
                  x1={magData[37]?.t}
                  x2={magData[48]?.t}
                  fill="#64748b"
                  fillOpacity={0.18}
                  label={{
                    value: "ICME Event",
                    position: "insideTop",
                    fill: "#cbd5e1",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0d1320",
                    border: "1px solid #1e293b",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                  formatter={(value, name) => [
                    `${value} nT`,
                    name === "Bt" ? "|B|" : name,
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="Bx"
                  name="Bx"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3 }}
                />

                <Line
                  type="monotone"
                  dataKey="By"
                  name="By"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3 }}
                />

                <Line
                  type="monotone"
                  dataKey="Bz"
                  name="Bz"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3 }}
                />

                <Line
                  type="monotone"
                  dataKey="Bt"
                  name="|B|"
                  stroke="#eab308"
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-red-500" /> Bx
            </span>
            <span className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-green-500" /> By
            </span>
            <span className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-sky-500" /> Bz
            </span>
            <span className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-yellow-500" /> |B|
            </span>
          </div>
        </Panel>

        {/* Detailed readings */}
        <Panel title="DETAILED READINGS" icon={<Activity className="w-3.5 h-3.5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            <div>
              <div className="text-[10px] text-slate-500 tracking-widest mb-2">SOLAR WIND (SWIS-ASPEX)</div>
              <div className="space-y-2.5">
                {detailedReadings.solarWind.map((r) => (
  <div
    key={r.label}
    className="flex items-center justify-between border-b border-slate-800/60 pb-2"
  >
    <span className="flex items-center gap-2 text-sm text-slate-300">
      <Activity className="w-4 h-4 text-slate-500" />
      {r.label}
    </span>

    <span className={`font-bold ${r.color}`}>
      {r.value}{" "}
      <span className="text-xs text-slate-500 font-normal">
        {r.unit}
      </span>
    </span>
  </div>
))}
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