"use client";

import { useAnalysis } from "@/context/AnalysisContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface MetricRowProps {
  label: string;
  value: string;
  bar?: number; // 0–100, optional
  color?: "cyan" | "orange";
}

function MetricRow({ label, value, bar, color = "cyan" }: MetricRowProps) {
  const barColor = color === "orange" ? "bg-orange-400" : "bg-cyan-400";
  const textColor = color === "orange" ? "text-orange-300" : "text-cyan-300";

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-400">{label}</span>
        <span className={`font-mono font-bold ${textColor}`}>{value}</span>
      </div>
      {bar !== undefined && (
        <div className="h-1.5 rounded-full bg-slate-700">
          <div
            className={`h-full rounded-full ${barColor} transition-all`}
            style={{ width: `${bar}%` }}
          />
        </div>
      )}
    </div>
  );
}

function SectionCard({
  title,
  tag,
  children,
}: {
  title: string;
  tag: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
          {tag}
        </span>
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function SolarMonitorPage() {
  const { analysisComplete } = useAnalysis();
  const router = useRouter();

  useEffect(() => {
    if (!analysisComplete) router.replace("/data-input");
  }, [analysisComplete, router]);

  if (!analysisComplete) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-mono text-cyan-500 tracking-widest mb-1">
          ANALYSIS RESULTS
        </p>
        <h1 className="text-3xl font-bold text-white">Solar Monitor</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Live instrument results from ADITYA-L1 payload analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SectionCard title="VELC Results" tag="VELC">
          <MetricRow label="Coronal Loop Expansion" value="0.94%" />
          <MetricRow label="Flux Rope Risk" value="1.56%" />
          <MetricRow label="Pre-Eruption Signal" value="4.51%" />
        </SectionCard>

        <SectionCard title="SWIS Results" tag="SWIS">
          <MetricRow label="Plasma Instability" value="81%" bar={81} />
          <MetricRow label="Wind Anomaly" value="72%" bar={72} />
        </SectionCard>

        <SectionCard title="MAG Results" tag="MAG">
          <MetricRow
            label="Magnetic Stress"
            value="89%"
            bar={89}
            color="orange"
          />
          <MetricRow
            label="Reconnection Probability"
            value="84%"
            bar={84}
            color="orange"
          />
        </SectionCard>
      </div>
    </div>
  );
}