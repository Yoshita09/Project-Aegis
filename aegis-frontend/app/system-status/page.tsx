"use client";

import Topbar from "@/components/Topbar";
import { Panel } from "@/components/ui";
import { Server, Layers, Cpu, ArrowDown } from "lucide-react";

interface SystemService {
  name: string;
  status: string;
  latency: string;
}

interface ArchitectureLayer {
  title: string;
  color: string;
  items: string[];
}

interface PayloadInfo {
  code: string;
  name: string;
  desc: string;
  rate: string;
  up: string;
}

interface PipelineMetric {
  stage: string;
  latency: string;
  throughput: string;
}

interface OrbitInfo {
  label: string;
  value: string;
}

const systemStatus: SystemService[] = [
  { name: "VELC Pipeline", status: "ONLINE", latency: "12ms" },
  { name: "SWIS-ASPEX Feed", status: "ONLINE", latency: "8ms" },
  { name: "Magnetometer", status: "ONLINE", latency: "5ms" },
  { name: "AI Inference", status: "ACTIVE", latency: "45ms" },
  { name: "CME Database", status: "SYNCED", latency: "23ms" },
  { name: "Alert System", status: "ARMED", latency: "2ms" },
];

const architecture: ArchitectureLayer[] = [
  {
    title: "DATA INGESTION",
    color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/10",
    items: ["VELC Coronagraph", "SWIS-ASPEX", "Magnetometer"],
  },
  {
    title: "AI AGENTS",
    color: "text-purple-400 border-purple-500/30 bg-purple-950/10",
    items: ["Vision Agent", "Solar Wind Agent", "Magnetic Agent", "Knowledge Agent"],
  },
  {
    title: "PREDICTION",
    color: "text-amber-400 border-amber-500/30 bg-amber-950/10",
    items: ["CME Genesis Predictor", "CME Arrival Predictor"],
  },
  {
    title: "ACTION",
    color: "text-red-400 border-red-500/30 bg-red-950/10",
    items: ["Satellite Risk Analyzer", "Alert System"],
  },
];

const payloadHealth: PayloadInfo[] = [
  { code: "VELC", name: "Visible Emission Line Coronagraph", desc: "Captures coronal images and UV spectra for CME monitoring.", rate: "8.4 Gbps", up: "99.8% UP" },
  { code: "SWIS", name: "Solar Wind Ion Spectrometer", desc: "Measures solar wind ion distributions and fluxes.", rate: "1.2 Mbps", up: "99.6% UP" },
  { code: "ASPEX", name: "Aditya Solar Wind Particle Experiment", desc: "Suprathermal and energetic particle measurement.", rate: "0.8 Mbps", up: "99.9% UP" },
  { code: "MAG", name: "Magnetometer", desc: "In-situ magnetic field measurement at L1 halo orbit.", rate: "0.2 Mbps", up: "100% UP" },
  { code: "SUIT", name: "Solar UV Imaging Telescope", desc: "UV imaging in 200-400 nm for photosphere and chromosphere.", rate: "2.1 Mbps", up: "99.4% UP" },
  { code: "HEL1OS", name: "High Energy L1 Orbiting X-ray Spectrometer", desc: "Hard X-ray spectroscopy for solar flare characterization.", rate: "0.5 Mbps", up: "99.7% UP" },
];

const pipelineMetrics: PipelineMetric[] = [
  { stage: "Data Ingestion", latency: "12ms", throughput: "11.3 Gbps" },
  { stage: "Preprocessing", latency: "8ms", throughput: "11.3 Gbps" },
  { stage: "Vision Agent (ViT)", latency: "45ms", throughput: "22 fps" },
  { stage: "Wind Agent (TFT)", latency: "18ms", throughput: "200 Hz" },
  { stage: "Magnetic Agent", latency: "9ms", throughput: "200 Hz" },
  { stage: "Knowledge Agent (RAG)", latency: "120ms", throughput: "8 req/s" },
  { stage: "CME Genesis Fusion", latency: "25ms", throughput: "40 Hz" },
  { stage: "PINN Arrival Model", latency: "230ms", throughput: "4 req/s" },
  { stage: "Satellite Risk Engine", latency: "15ms", throughput: "10 req/s" },
  { stage: "Alert Dispatcher", latency: "2ms", throughput: "1000 req/s" },
];

const orbitInfo: OrbitInfo[] = [
  { label: "Orbit Type", value: "L1 Halo Orbit" },
  { label: "Distance from Earth", value: "~1.5 million km" },
  { label: "Orbital Period", value: "~178 days" },
  { label: "Launch Date", value: "Sept 2, 2023" },
  { label: "L1 Insertion", value: "Jan 6, 2024" },
  { label: "Mission Life", value: "5 years (est.)" },
];

export default function SystemStatusPage() {
  return (
    <div>
      <Topbar
        title="SYSTEM STATUS"
        badge="ALL SYSTEMS GO"
        badgeColor="green"
        subtitle="Aditya-L1 payload health, AI pipeline performance, and infrastructure metrics"
      />

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* System status */}
            <Panel
              title="SYSTEM STATUS"
              icon={<Server className="w-3.5 h-3.5" />}
              right={<span className="text-[10px] text-emerald-400 font-semibold">ALL SYSTEMS NOMINAL</span>}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {systemStatus.map((s) => (
                  <div key={s.name} className="bg-[#0b1018] border border-slate-800/60 rounded-md p-3">
                    <div className="text-sm font-semibold text-slate-200 mb-1">{s.name}</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {s.status} · {s.latency}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Architecture */}
            <Panel title="SYSTEM ARCHITECTURE" icon={<Layers className="w-3.5 h-3.5" />}>
              <div className="space-y-2">
                {architecture.map((layer, idx) => (
                  <div key={layer.title}>
                    <div className={`border rounded-md px-4 py-3 ${layer.color}`}>
                      <div className="text-[10px] font-bold tracking-widest mb-2">{layer.title}</div>
                      <div className="flex flex-wrap gap-2">
                        {layer.items.map((item) => (
                          <span key={item} className="text-xs text-slate-300 bg-slate-900/60 border border-slate-700/60 rounded px-2 py-1">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    {idx !== architecture.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowDown className="w-4 h-4 text-slate-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Panel>

            {/* Payload health */}
            <Panel title="ADITYA-L1 PAYLOAD HEALTH">
              <div className="space-y-4">
                {payloadHealth.map((p) => (
                  <div key={p.code} className="flex items-start justify-between border-b border-slate-800/60 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                      <div>
                        <div className="text-sm font-semibold text-slate-200">
                          <span className="text-cyan-300">{p.code}</span> — {p.name}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
                        <div className="text-[10px] text-slate-500 mt-1">Data rate: {p.rate}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 whitespace-nowrap ml-4">{p.up}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Panel title="AI PIPELINE METRICS" icon={<Cpu className="w-3.5 h-3.5" />}>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-500 tracking-widest border-b border-slate-800/60">
                    <th className="text-left py-2 font-normal">STAGE</th>
                    <th className="text-right py-2 font-normal">LATENCY</th>
                    <th className="text-right py-2 font-normal">THROUGHPUT</th>
                  </tr>
                </thead>
                <tbody>
                  {pipelineMetrics.map((m) => (
                    <tr key={m.stage} className="border-b border-slate-800/40">
                      <td className="py-2 flex items-center gap-1.5 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {m.stage}
                      </td>
                      <td className="py-2 text-right text-cyan-300 font-mono">{m.latency}</td>
                      <td className="py-2 text-right text-slate-400 font-mono">{m.throughput}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>

            <Panel title="ADITYA-L1 ORBIT">
              <div className="space-y-3">
                {orbitInfo.map((o) => (
                  <div key={o.label} className="flex justify-between text-sm">
                    <span className="text-slate-500">{o.label}</span>
                    <span className="text-cyan-300 font-semibold">{o.value}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
