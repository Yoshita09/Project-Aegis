import { ReactNode } from "react";

interface PanelProps {
  title?: string;
  icon?: ReactNode;
  right?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Panel({ title, icon, right, className = "", children }: PanelProps) {
  return (
    <div
      className={`bg-[#0d1320] border border-slate-800/60 rounded-lg p-5 ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-cyan-300 text-xs font-bold tracking-widest flex items-center gap-2">
            {icon}
            {title}
          </h2>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

interface StatCardProps {
  icon?: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}

export function StatCard({ icon, label, value, unit, color = "text-cyan-300" }: StatCardProps) {
  return (
    <div className="bg-[#0b1018] border border-slate-800/60 rounded-md p-3">
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 tracking-wide mb-1.5">
        {icon}
        {label}
      </div>
      <div className={`text-2xl font-bold ${color}`}>
        {value}
        {unit && <span className="text-xs text-slate-500 font-normal ml-1">{unit}</span>}
      </div>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  color?: string;
  trackColor?: string;
}

export function ProgressBar({ value, color = "bg-cyan-400", trackColor = "bg-slate-800" }: ProgressBarProps) {
  return (
    <div className={`w-full h-1.5 rounded-full ${trackColor} overflow-hidden`}>
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
