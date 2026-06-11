export default function SolarVisualizationCard() {
  return (
    <div className="bg-[#080e1d] rounded-xl border border-[#1a2540] flex flex-col items-center justify-center gap-3 py-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-orange-500 shadow-[0_0_60px_rgba(249,115,22,0.6),0_0_30px_rgba(249,115,22,0.4)]" />

        <div className="absolute top-3 left-6 w-4 h-4 rounded-full bg-orange-700/60 blur-sm" />
        <div className="absolute bottom-4 right-5 w-3 h-3 rounded-full bg-orange-800/50 blur-sm" />
      </div>

      <div className="text-center">
        <div className="text-[#3a5a7f] text-[10px] tracking-widest uppercase">
          VELC Feed
        </div>

        <div className="text-[#6a9abf] text-xs mt-1">
          Active Region AR-13842 — Class X2.1
        </div>
      </div>
    </div>
  );
}