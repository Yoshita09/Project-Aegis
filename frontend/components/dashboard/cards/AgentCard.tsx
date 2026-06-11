import { Activity } from "lucide-react";
import AgentBar from "../ui/AgentBar";

interface Metric {
  label: string;
  value: number;
  color: string;
}

interface Agent {
  id: string;
  name: string;
  desc: string;
  model: string;
  modelColor: string;
  status: string;
  metrics: Metric[];
}

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({
  agent,
}: AgentCardProps) {
  return (
    <div className="bg-[#080e1d] rounded-xl border border-[#1a2540] p-4 hover:border-[#2a4060] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              agent.status === "active"
                ? "bg-green-500"
                : "bg-amber-500"
            }`}
          />

          <span className="text-[#3a5a7f] text-[10px] tracking-widest">
            {agent.id}
          </span>
        </div>

        <Activity
          size={10}
          className="text-[#2a4060]"
        />
      </div>

      <div className="text-white text-sm font-bold mb-1">
        {agent.name}
      </div>

      <p className="text-[#3a5a7f] text-[10px] leading-relaxed mb-3">
        {agent.desc}
      </p>

      <div>
        {agent.metrics.map((metric) => (
          <AgentBar
            key={metric.label}
            label={metric.label}
            value={metric.value}
            color={metric.color}
          />
        ))}
      </div>

      <div className="mt-3">
        <span
          className="text-[10px] px-2 py-0.5 rounded-full border"
          style={{
            color: agent.modelColor,
            borderColor: `${agent.modelColor}40`,
            background: `${agent.modelColor}10`,
          }}
        >
          {agent.model}
        </span>
      </div>
    </div>
  );
}