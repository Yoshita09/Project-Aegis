import {
  Wifi,
  Database,
  Cpu,
  HardDrive,
} from "lucide-react";

const systemHealth = [
  { label: "Aditya-L1 Downlink", value: "1.2s", ok: true, icon: Wifi },
  { label: "Data Fusion Layer", value: "45ms", ok: true, icon: Database },
  { label: "AI Inference Cluster", value: "120ms", ok: true, icon: Cpu },
  { label: "Historical DB (RAG)", value: "85ms", ok: true, icon: HardDrive },
];

export default function SystemHealthCard() {
  return (
    <div className="mt-3 pt-3 border-t border-[#1a2540]">
      <div className="text-[#2a4060] text-[9px] tracking-widest uppercase mb-2">
        System Health
      </div>

      <div className="space-y-1.5">
        {systemHealth.map(({ label, value, ok, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-1.5 text-[#4a6f8f] text-[10px]">
              <Icon size={10} />
              {label}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#3a5a7f] text-[10px]">
                {value}
              </span>

              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  ok ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}