"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Wind } from "lucide-react";

interface MiniChartProps {
  data: {
    t: string;
    v: number;
  }[];

  color: string;
  label: string;
  unit: string;
}

export default function MiniChart({
  data,
  color,
  label,
  unit,
}: MiniChartProps) {
  return (
    <div className="bg-[#080e1d] rounded-xl border border-[#1a2540] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-[#4a8ab4] text-xs font-semibold tracking-wider uppercase">
          <Wind size={12} />
          {label}
        </div>

        <span className="text-[#2a4060] text-[10px]">
          {unit}
        </span>
      </div>

      <ResponsiveContainer
        width="100%"
        height={80}
      >
        <LineChart data={data}>
          <XAxis dataKey="t" hide />
          <YAxis hide />

          <Tooltip
            contentStyle={{
              background: "#0a1525",
              border: "1px solid #1a2540",
              borderRadius: 6,
              fontSize: 11,
              color: "#8ab4d4",
            }}
            itemStyle={{
              color,
            }}
          />

          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}