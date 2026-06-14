"use client";

import { useEffect, useState } from "react";

type BadgeColor = "green" | "red" | "cyan" | "purple" | "amber";

interface TopbarProps {
  title: string;
  badge?: string;
  badgeColor?: BadgeColor;
  subtitle?: string;
}

export default function Topbar({
  title,
  badge,
  badgeColor = "green",
  subtitle,
}: TopbarProps) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();

      const istTime = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
      });

      setTime(`${istTime} IST`);
    };

    update();
    const id = setInterval(update, 1000);

    return () => clearInterval(id);
  }, []);

  const badgeColors: Record<BadgeColor, string> = {
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    red: "bg-red-500/10 text-red-400 border-red-500/30",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  };

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-slate-800/60">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-100 tracking-wide">
            {title}
          </h1>

          {badge && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badgeColors[badgeColor]}`}
            >
              {badge}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>

      <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        {time}
      </div>
    </header>
  );
}