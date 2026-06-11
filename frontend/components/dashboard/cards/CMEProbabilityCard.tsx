import GaugeArc from "../charts/GaugeArc";

interface Props {
  percent?: number;
}

export default function CMEProbabilityCard({
  percent = 91,
}: Props) {
  return (
    <div className="bg-[#080e1d] rounded-xl border border-[#1a2540] flex flex-col items-center justify-center py-4 px-3">
      <GaugeArc percent={percent} />

      <div className="text-5xl font-black text-red-500 -mt-6 tabular-nums">
        {percent}%
      </div>

      <div className="text-[#4a6f8f] text-xs tracking-widest uppercase mt-1">
        CME Probability
      </div>

      <div className="mt-2 px-3 py-0.5 rounded text-red-400 border border-red-800 bg-red-900/30 text-[10px] font-bold tracking-widest">
        CRITICAL
      </div>
    </div>
  );
}