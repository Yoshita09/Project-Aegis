"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Upload,
  Sun,
  Activity,
  Zap,
  Satellite,
  BrainCircuit,
  Server,
  Shield,
  LucideIcon,
} from "lucide-react";

interface NavItem {
  name?: string;
  href?: string;
  icon?: LucideIcon;
  divider?: string;
}

const navItems: NavItem[] = [
  { name: "Overview", href: "/overview", icon: LayoutGrid },
  { name: "Data Input", href: "/data-input", icon: Upload },
  { divider: "ANALYSIS OUTPUT" },
  { name: "Solar Monitor", href: "/solar-monitor", icon: Sun },
  { name: "CME Prediction", href: "/cme-prediction", icon: Activity },
  { name: "Arrival & Impact", href: "/arrival-impact", icon: Zap },
  { name: "Satellite Risk", href: "/satellite-risk", icon: Satellite },
  { name: "Agent Reasoning", href: "/agent-reasoning", icon: BrainCircuit },
  { name: "System Status", href: "/system-status", icon: Server },
];

interface SidebarProps {
  cmeValue?: number;
}

export default function Sidebar({ cmeValue = 84 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-[#0a0e1a] border-r border-slate-800/60 flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="w-8 h-8 rounded-md bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
          <Shield className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-cyan-300 font-bold text-sm tracking-wide leading-none">
            SOLARSHIELD
          </div>
          <div className="text-[10px] text-slate-500 leading-none mt-0.5">
            AI v2.0
          </div>
        </div>
      </div>

      <div className="px-3 mb-3">
        <div className="rounded-md border border-red-500/30 bg-red-950/40 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-semibold tracking-wide">
              CRITICAL
            </span>
          </div>
          <span className="text-red-400 text-xs font-mono">
            CME: {cmeValue}%
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item, idx) => {
          if (item.divider) {
            return (
              <div
                key={idx}
                className="text-[10px] text-slate-500 tracking-widest px-3 pt-4 pb-1 border-t border-slate-800/60 mt-2"
              >
                {item.divider}
              </div>
            );
          }
          const Icon = item.icon!;
          const active = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href!}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 text-[10px] text-slate-600 border-t border-slate-800/60">
        ADITYA-L1 · ISRO
      </div>
    </aside>
  );
}
