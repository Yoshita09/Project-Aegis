"use client";

import Topbar from "@/components/Topbar";
import { Panel, ProgressBar } from "@/components/ui";
import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle2, Satellite, LucideIcon } from "lucide-react";
import GlobeMap from "@/components/GlobeMap";
type StatusColor = "red" | "amber" | "yellow" | "emerald";
type TagColor = "red" | "amber" | "cyan" | "emerald";

interface SummaryCard {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  border: string;
}

interface SatelliteData {
  name: string;
  orbit: string;
  type: string;
  risk: number;
  status: string;
  statusColor: StatusColor;
}

interface RecommendedAction {
  title: string;
  desc: string;
  tag: string;
  color: TagColor;
}

interface OrbitDot {
  x: string;
  y: string;
  color: string;
}

const summary: SummaryCard[] = [
  { label: "Critical", value: 1, icon: ShieldAlert, color: "text-red-400", border: "border-red-500/30 bg-red-950/30" },
  { label: "Warning", value: 3, icon: AlertTriangle, color: "text-amber-400", border: "border-amber-500/30 bg-amber-950/20" },
  { label: "Elevated", value: 5, icon: AlertCircle, color: "text-yellow-400", border: "border-slate-700 bg-[#0b1018]" },
  { label: "Nominal", value: 1, icon: CheckCircle2, color: "text-emerald-400", border: "border-emerald-500/30 bg-emerald-950/20" },
];

const satellites: SatelliteData[] = [
  { name: "Aditya-L1", orbit: "L1 Halo", type: "Solar Observat...", risk: 88, status: "CRITICAL", statusColor: "red" },
  { name: "INSAT-3D", orbit: "GEO", type: "Weather", risk: 78, status: "WARNING", statusColor: "amber" },
  { name: "GOES-18", orbit: "GEO", type: "Weather", risk: 76, status: "WARNING", statusColor: "amber" },
  { name: "GSAT-30", orbit: "GEO", type: "Communication", risk: 72, status: "WARNING", statusColor: "amber" },
  { name: "Cartosat-3", orbit: "LEO", type: "Earth Observat...", risk: 59, status: "ELEVATED", statusColor: "yellow" },
  { name: "Starlink-5422", orbit: "LEO", type: "Communication", risk: 57, status: "ELEVATED", statusColor: "yellow" },
  { name: "Hubble", orbit: "LEO", type: "Telescope", risk: 55, status: "ELEVATED", statusColor: "yellow" },
  { name: "Starlink-5421", orbit: "LEO", type: "Communication", risk: 54, status: "ELEVATED", statusColor: "yellow" },
  { name: "ISS", orbit: "LEO", type: "Space Station", risk: 52, status: "ELEVATED", statusColor: "yellow" },
  { name: "Chandrayaan-3 Orb.", orbit: "Lunar", type: "Deep Space", risk: 38, status: "NOMINAL", statusColor: "emerald" },
];

const statusColors: Record<StatusColor, string> = {
  red: "text-red-400 bg-red-950/30 border-red-500/30",
  amber: "text-amber-400 bg-amber-950/20 border-amber-500/30",
  yellow: "text-yellow-400 bg-yellow-950/10 border-yellow-500/20",
  emerald: "text-emerald-400 bg-emerald-950/20 border-emerald-500/30",
};

const barColors: Record<StatusColor, string> = {
  red: "bg-red-400",
  amber: "bg-amber-400",
  yellow: "bg-yellow-400",
  emerald: "bg-emerald-400",
};

const actions: RecommendedAction[] = [
  { title: "Safe mode activation", desc: "GEO satellites (INSAT, GSAT)", tag: "IMMEDIATE", color: "red" },
  { title: "Charge battery reserves", desc: "All LEO satellites", tag: "URGENT", color: "amber" },
  { title: "Avoid sensitive maneuvers", desc: "All GEO/MEO assets", tag: "6 HOURS", color: "amber" },
  { title: "Downlink critical data", desc: "Cartosat-3, Hubble", tag: "12 HOURS", color: "cyan" },
  { title: "Monitor solar panels", desc: "ISS, Starlink fleet", tag: "MONITOR", color: "emerald" },
];

const tagColors: Record<TagColor, string> = {
  red: "text-red-400 bg-red-950/30 border-red-500/30",
  amber: "text-amber-400 bg-amber-950/20 border-amber-500/30",
  cyan: "text-cyan-400 bg-cyan-950/20 border-cyan-500/30",
  emerald: "text-emerald-400 bg-emerald-950/20 border-emerald-500/30",
};

const orbitDots: OrbitDot[] = [
  { x: "50%", y: "12%", color: "bg-yellow-400" },
  { x: "26%", y: "28%", color: "bg-yellow-400" },
  { x: "68%", y: "30%", color: "bg-yellow-400" },
  { x: "62%", y: "38%", color: "bg-yellow-400" },
  { x: "78%", y: "62%", color: "bg-yellow-400" },
  { x: "8%", y: "55%", color: "bg-red-400" },
  { x: "16%", y: "55%", color: "bg-emerald-400" },
];

export default function SatelliteRiskPage() {
  return (
    <div>
      <Topbar
        title="SATELLITE RISK"
        badge="1 CRITICAL"
        badgeColor="red"
        subtitle="Real-time asset protection assessment — 10 satellites tracked"
      />

      <div className="p-8 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summary.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`border rounded-lg p-4 flex items-center gap-3 ${s.border}`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
                <div>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Risk map */}
          <Panel
            title="SATELLITE RISK MAP"
            className="lg:col-span-2"
            right={
              <div className="flex items-center gap-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> CRITICAL</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> WARNING</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> NOMINAL</span>
              </div>
            }
          >
            <GlobeMap />
          </Panel>

          {/* Satellite table */}
          <Panel
            title="SATELLITE RISK ASSESSMENT"
            icon={<Satellite className="w-3.5 h-3.5" />}
            right={<span className="text-[10px] text-slate-500">10 ASSETS TRACKED</span>}
            className="lg:col-span-3"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-slate-500 tracking-widest border-b border-slate-800/60">
                    <th className="text-left py-2 font-normal">SATELLITE</th>
                    <th className="text-left py-2 font-normal">ORBIT</th>
                    <th className="text-left py-2 font-normal">TYPE</th>
                    <th className="text-left py-2 font-normal">RISK</th>
                    <th className="text-right py-2 font-normal">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {satellites.map((sat) => (
                    <tr key={sat.name} className="border-b border-slate-800/40">
                      <td className="py-2.5 flex items-center gap-2 text-slate-200 font-medium">
                        <Satellite className="w-3.5 h-3.5 text-slate-500" />
                        {sat.name}
                      </td>
                      <td className="py-2.5 text-slate-400">{sat.orbit}</td>
                      <td className="py-2.5 text-slate-400">{sat.type}</td>
                      <td className="py-2.5 w-32">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={sat.risk} color={barColors[sat.statusColor]} />
                          <span className="text-xs font-semibold text-slate-300 w-8">{sat.risk}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded border ${statusColors[sat.statusColor]}`}>
                          {sat.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* Recommended actions */}
        <Panel title="RECOMMENDED ACTIONS">
          <div className="space-y-3">
            {actions.map((a) => (
              <div key={a.title} className="flex items-center justify-between bg-[#0b1018] border border-slate-800/60 rounded-md px-4 py-3">
                <div>
                  <div className="text-sm font-bold text-slate-200">{a.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{a.desc}</div>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded border ${tagColors[a.color]}`}>
                  {a.tag}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
