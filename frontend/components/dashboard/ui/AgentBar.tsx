interface AgentBarProps {
  label: string;
  value: number;
  color: string;
}

export default function AgentBar({
  label,
  value,
  color,
}: AgentBarProps) {
  return (
    <div className="flex items-center justify-between text-[11px] mb-1.5">
      <span className="text-[#4a6f8f] w-28 truncate">
        {label}
      </span>

      <div className="flex items-center gap-2 flex-1 ml-2">
        <div className="flex-1 h-1 bg-[#1a2540] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${value}%`,
              background: color,
            }}
          />
        </div>

        <span
          style={{ color }}
          className="w-7 text-right font-bold"
        >
          {value}%
        </span>
      </div>
    </div>
  );
}