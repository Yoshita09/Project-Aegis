import { Zap } from "lucide-react";

export default function ArrivalPredictionCard() {
  return (
    <div className="bg-[#080e1d] rounded-xl border border-[#1a2540] p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-amber-400" />

          <span className="text-white text-sm font-bold tracking-wider uppercase">
            CME Arrival Prediction
          </span>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded border border-[#2a4060] text-[#4a8ab4] bg-[#0a1525]">
          PINN Model
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {[
          {
            icon: "🕐",
            label: "Arrival Time",
            value: "17",
            unit: "hrs",
            color: "text-white",
          },
          {
            icon: "⚡",
            label: "CME Speed",
            value: "1150",
            unit: "km/s",
            color: "text-amber-400",
          },
          {
            icon: "🌍",
            label: "Earth Impact",
            value: "82",
            unit: "%",
            color: "text-red-400",
          },
          {
            icon: "📊",
            label: "Kp Index (est)",
            value: "7.5",
            unit: "",
            color: "text-violet-400",
          },
        ].map(({ icon, label, value, unit, color }) => (
          <div key={label}>
            <div className="text-[#3a5a7f] text-[10px] flex items-center gap-1 mb-1">
              <span>{icon}</span>
              {label}
            </div>

            <div className={`text-3xl font-black tabular-nums ${color}`}>
              {value}

              <span className="text-sm font-normal ml-1 text-[#4a6f8f]">
                {unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2">
        <div className="flex justify-between text-[9px] text-[#2a4060] mb-1">
          <span>Sun</span>
          <span>L1 Point</span>
          <span>Earth</span>
        </div>

        <div className="h-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-red-500 relative overflow-hidden">
          <div
            className="absolute top-0 h-full w-3 bg-white/40 animate-pulse rounded-full"
            style={{ left: "40%" }}
          />
        </div>
      </div>
    </div>
  );
}