import SystemHealthCard from "./SystemHealthCard";

const alerts = [
  {
    title: "CME Genesis Detected",
    time: "14:32 UTC",
    body: "Multi-agent consensus: 91% eruption probability. Coronal loop expansion confirmed.",
    icon: "⚡",
    color: "#ef4444",
  },
  {
    title: "Magnetic Stress Elevated",
    time: "14:28 UTC",
    body: "Bz component showing sustained southward turning. Reconnection probability: 84%.",
    icon: "⚠",
    color: "#f59e0b",
  },
  {
    title: "Solar Wind Anomaly",
    time: "14:15 UTC",
    body: "SWIS-ASPEX detecting velocity spike. Proton flux 3.2x above baseline.",
    icon: "ℹ",
    color: "#38bdf8",
  },
  {
    title: "Satellite Safe Mode Advisory",
    time: "13:52 UTC",
    body: "INSAT-3D and GSAT-30 recommended for safe mode transition in T-12h.",
    icon: "✓",
    color: "#22c55e",
  },
];

export default function AlertTimelineCard() {
  return (
    <div className="bg-[#080e1d] rounded-xl border border-[#1a2540] p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white text-xs font-bold tracking-wider uppercase">
          Alert Timeline
        </span>

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
            style={{
              background: `${a.color}08`,
              border: `1px solid ${a.color}20`,
            }}
          >
            <div className="flex items-center justify-between mb-0.5">
              <span
                className="text-xs font-semibold"
                style={{ color: a.color }}
              >
                {a.icon} {a.title}
              </span>

              <span className="text-[9px] text-[#2a4060]">
                {a.time}
              </span>
            </div>

            <p className="text-[10px] text-[#4a6f8f] leading-relaxed">
              {a.body}
            </p>
          </div>
        ))}
      </div>

      <SystemHealthCard />
    </div>
  );
}