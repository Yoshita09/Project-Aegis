"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Radar,
  ShieldAlert,
  Satellite,
  Brain,
  Server,
} from "lucide-react";

const navItems = [
  {
    name: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Solar Monitor",
    href: "/solar-monitor",
    icon: Activity,
  },
  {
    name: "CME Prediction",
    href: "/cme-prediction",
    icon: Radar,
  },
  {
    name: "Arrival & Impact",
    href: "/arrival-impact",
    icon: ShieldAlert,
  },
  {
    name: "Satellite Risk",
    href: "/satellite-risk",
    icon: Satellite,
  },
  {
    name: "Agent Reasoning",
    href: "/agent-reasoning",
    icon: Brain,
  },
  {
    name: "System Status",
    href: "/system-status",
    icon: Server,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen border-r border-slate-800 bg-[#07111f]">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-cyan-400">
          AEGIS
        </h1>

        <p className="text-xs text-slate-500 mt-1">
          AI Space Defense Platform
        </p>
      </div>

      <div className="px-4">
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-red-400 text-sm font-semibold">
            ● CRITICAL
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Threat Level: 91%
          </p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  active
                    ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}