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
  Upload,
  Lock,
} from "lucide-react";
import { useAnalysis } from "@/context/AnalysisContext";
import logo from "@/app/assets/logo.png";
import Image from "next/image";

const topNavItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Data Input",
    href: "/data-input",
    icon: Upload,
  },
];

const lockedNavItems = [
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
];

export default function Sidebar() {
  const pathname = usePathname();
  const { analysisComplete } = useAnalysis();

  return (
    <aside
  style={{
    width: "252px",
    height: "100vh",
    overflow: "hidden",
    flexShrink: 0,
    background: "#07111f",
    borderRight: "1px solid rgba(56, 189, 248, 0.12)",
  }}
>
      {/* =====================================================
          AEGIS BRANDING
      ===================================================== */}

      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          padding: "20px 20px 16px",
          gap: "7px",
        }}
      >
        <Image
          src={logo}
          alt="AEGIS"
          width={60}
          height={60}
          priority
          style={{
            width: "50px",
            height: "50px",
            objectFit: "contain",
            flexShrink: 0,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              color: "#f8fafc",
              fontSize: "23px",
              lineHeight: "1",
              fontWeight: 800,
              letterSpacing: "2.5px",
              whiteSpace: "nowrap",
            }}
          >
            AEGIS
          </div>

          <div
            style={{
              marginTop: "6px",
              color: "#64748b",
              fontSize: "7.3px",
              lineHeight: "1",
              letterSpacing: "2.1px",
              whiteSpace: "nowrap",
              fontWeight: 500,
            }}
          >
            AI SPACE DEFENSE PLATFORM
          </div>
        </div>
      </Link>

      {/* =====================================================
          SIDEBAR CONTENT
      ===================================================== */}

      <div
        style={{
          padding: "0 9px",
        }}
      >
        {/* Threat status

        <div
          style={{
            marginBottom: "18px",
            borderRadius: "18px",
            border: "1px solid rgba(248, 113, 113, 0.35)",
            background: "rgba(127, 29, 29, 0.16)",
            padding: "15px 20px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#ff646d",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            ● CRITICAL
          </p>

          <p
            style={{
              margin: "7px 0 0",
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
            Threat Level: 91%
          </p>
        </div> */}

        {/* Navigation */}

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3px",
          }}
        >
          {topNavItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  minHeight: "48px",
                  padding: "0 20px",
                  borderRadius: "16px",
                  textDecoration: "none",
                  color: active ? "#22d3ee" : "#94a3b8",
                  background: active
                    ? "rgba(34, 211, 238, 0.08)"
                    : "transparent",
                  border: active
                    ? "1px solid rgba(34, 211, 238, 0.32)"
                    : "1px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                />

                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Divider */}

          <div
            style={{
              height: "1px",
              background: "rgba(100, 116, 139, 0.17)",
              margin: "12px 0 17px",
            }}
          />

          {/* Locked items */}

          {lockedNavItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            if (!analysisComplete) {
              return (
                <div
                  key={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    minHeight: "48px",
                    padding: "0 20px",
                    color: "#334155",
                    opacity: 0.72,
                    cursor: "not-allowed",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.8}
                  />

                  <span
                    style={{
                      flex: 1,
                      fontSize: "15px",
                    }}
                  >
                    {item.name}
                  </span>

                  <Lock
                    size={15}
                    strokeWidth={1.8}
                  />
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  minHeight: "48px",
                  padding: "0 20px",
                  borderRadius: "16px",
                  textDecoration: "none",
                  color: active ? "#22d3ee" : "#94a3b8",
                  background: active
                    ? "rgba(34, 211, 238, 0.08)"
                    : "transparent",
                  border: active
                    ? "1px solid rgba(34, 211, 238, 0.32)"
                    : "1px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                />

                <span
                  style={{
                    flex: 1,
                    fontSize: "15px",
                  }}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}