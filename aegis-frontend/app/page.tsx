"use client";

import Link from "next/link";
import Sun3D from "@/components/Sun3D";
import TwinklingStars from "@/components/TwinklingStars";

import { useEffect, useRef } from "react";

import Image from "next/image";

import logo from "@/app/assets/logo.png";

export default function LandingPage() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "#050914",
        color: "#f5f5f7",

        // Keep the landing-page typography independent
        // from the dashboard/sidebar styling.
        fontFamily:
          'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
      }}
    >
      {/* =========================================================
          BACKGROUND
         ========================================================= */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(
              circle at 75% 48%,
              rgba(255, 142, 35, 0.13) 0%,
              rgba(255, 100, 25, 0.055) 23%,
              transparent 43%
            ),
            radial-gradient(
              circle at 15% 30%,
              rgba(35, 55, 90, 0.09),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #060a15 0%,
              #040812 48%,
              #02060e 100%
            )
          `,
        }}
      />

      {/* Extra subtle darkness around edges */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.22) 100%)",
        }}
      />

      {/* =========================================================
          NATURAL TWINKLING STARS
         ========================================================= */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <TwinklingStars />
      </div>
        {/* =========================================================
    AEGIS TOP NAV
   ========================================================= */}

<header
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 108,
    zIndex: 50,

    display: "flex",
    alignItems: "center",

    padding: "0 3.2vw",

    


  }}
>
  {/* -------------------------------------------------------
      AEGIS BRAND
     ------------------------------------------------------- */}

  <Link
  href="/"
  style={{
    display: "flex",
    alignItems: "center",
    gap: 9, // 16 → 9
    textDecoration: "none",
    color: "inherit",
  }}
>
    {/* Logo */}

<div
  style={{
    width: 76, // 68 → 76
    height: 76,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    background: "rgba(7,12,24,0.78)",
  }}
>
  <Image
  src={logo}
  alt="AEGIS"
  width={68}
  height={68}
  priority
  style={{
    width: 68, // 56 → 68
    height: 68,
    objectFit: "contain",
    display: "block",
  }}
/>
</div>

    {/* Brand text */}

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          color: "#F4F5F7",
          fontSize: 30,
          lineHeight: 1,
          fontWeight: 800,
          letterSpacing: "0.12em",
        }}
      >
        AEGIS
      </div>

      <div
        style={{
          marginTop: 9,

          color: "#697386",

          fontSize: 9,
          lineHeight: 1,
          fontWeight: 500,

          letterSpacing: "0.27em",

          whiteSpace: "nowrap",
        }}
      >
        AI SPACE DEFENSE PLATFORM
      </div>
    </div>
  </Link>

  {/* -------------------------------------------------------
      CENTER NAV
     ------------------------------------------------------- */}

  <nav
    style={{
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",

      display: "flex",
      alignItems: "center",

      gap: 52,
    }}
  >
    {[
      "MISSION",
      "AI AGENTS",
      "MONITORING",
      "SYSTEM",
    ].map((item) => (
      <Link
        key={item}
        href={
          item === "MISSION"
            ? "/dashboard"
            : item === "AI AGENTS"
            ? "/agent-reasoning"
            : item === "MONITORING"
            ? "/solar-monitor"
            : "/system-status"
        }
        style={{
          color: "#737B8D",

          textDecoration: "none",

          fontSize: 12,
          fontWeight: 500,

          letterSpacing: "0.16em",

          whiteSpace: "nowrap",

          transition:
            "color 180ms ease",
        }}
      >
        {item}
      </Link>
    ))}
  </nav>

  {/* -------------------------------------------------------
      SYSTEM STATUS
     ------------------------------------------------------- */}

  <div
    style={{
      marginLeft: "auto",

      display: "flex",
      alignItems: "center",
      gap: 11,

      color: "#727A8B",

      fontSize: 10,
      fontWeight: 500,

      letterSpacing: "0.18em",

      whiteSpace: "nowrap",
    }}
  >
    <span
      style={{
        width: 9,
        height: 9,

        borderRadius: "50%",

        background: "#25D879",

        boxShadow:
          "0 0 14px rgba(37,216,121,0.75)",
      }}
    />

    SYSTEM ONLINE
  </div>
</header>
      {/* =========================================================
          HERO
         ========================================================= */}

      <section
        style={{
          position: "relative",
          zIndex: 5,
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding:
            "70px clamp(50px, 7vw, 110px) 55px",
          boxSizing: "border-box",
        }}
      >
        {/* =====================================================
            LEFT CONTENT
           ===================================================== */}

        <div
          style={{
            position: "relative",
            zIndex: 15,
            width: "52%",
            maxWidth: 720,
            marginTop: -10,
          }}
        >
          {/* ---------------------------------------------------
              MISSION BADGE
             --------------------------------------------------- */}

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 15px 8px 8px",
              marginBottom: 34,
              borderRadius: 30,

              background:
                "linear-gradient(180deg, rgba(22,28,46,0.82), rgba(12,18,33,0.72))",

              border:
                "1px solid rgba(148,163,184,0.17)",

              boxShadow:
                "0 8px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* Mission number */}

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",

                height: 32,
                padding: "0 16px",

                borderRadius: 18,

                background:
                  "rgba(255,133,34,0.10)",

                border:
                  "1px solid rgba(255,148,48,0.45)",

                color: "#ff9d32",

                fontFamily:
                  '"SFMono-Regular", Consolas, "Liberation Mono", monospace',

                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              MISSION 0042
            </span>

            {/* Mission description */}

            <span
              style={{
                color: "#b3b6c0",
                fontSize: 13,
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              Aditya-L1 · Lagrangian Halo
              Orbit
            </span>

            {/* Status */}

            <span
              style={{
                width: 7,
                height: 7,
                flexShrink: 0,
                borderRadius: "50%",
                background: "#35e6a0",
                boxShadow:
                  "0 0 10px rgba(53,230,160,0.9)",
              }}
            />
          </div>

          {/* ---------------------------------------------------
              HERO HEADING
             --------------------------------------------------- */}

          <h1
            style={{
              margin: 0,
              padding: 0,

              // Similar visual weight to the reference.
              fontSize:
                "clamp(58px, 6vw, 88px)",

              lineHeight: 0.98,
              letterSpacing: "-0.055em",
              fontWeight: 600,

              maxWidth: 720,
            }}
          >
            {/* AI Powered */}

            <span
              style={{
                display: "block",
                color: "#f7f7f8",
              }}
            >
              AI Powered
            </span>

            {/* Solar Flare */}

            <span
              style={{
                display: "block",

                background:
                  "linear-gradient(100deg, #ffc15b 0%, #ff9d28 43%, #ff553d 100%)",

                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Solar Flare
            </span>

            {/* Forecasting */}

            <span
              style={{
                display: "block",
                color: "#e4e5e9",
              }}
            >
              Forecasting.
            </span>
          </h1>

          {/* ---------------------------------------------------
              DESCRIPTION
             --------------------------------------------------- */}

          <p
            style={{
              margin:
                "30px 0 0 0",

              maxWidth: 580,

              color: "#9ea2ad",

              fontSize: 18.5,
              lineHeight: 1.65,
              fontWeight: 450,

              letterSpacing: "-0.012em",
            }}
          >
            Project Aegis ingests spectroscopic
            and magnetometer telemetry from
            ISRO&apos;s Aditya-L1 spacecraft and
            predicts the Sun&apos;s next major
            eruption.
          </p>

          {/* ---------------------------------------------------
              LAUNCH BUTTON
             --------------------------------------------------- */}

          <div
            style={{
              marginTop: 34,
            }}
          >
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 15,

                height: 58,
                padding: "0 25px",

                minWidth: 230,

                borderRadius: 14,

                background:
                  "linear-gradient(135deg, #ffb743 0%, #ff8f22 100%)",

                border:
                  "1px solid rgba(255,191,90,0.55)",

                color: "#090b10",

                fontSize: 14,
                fontWeight: 800,

                textDecoration: "none",

                boxShadow:
                  "0 10px 35px rgba(255,137,27,0.22), inset 0 1px 0 rgba(255,255,255,0.25)",

                transition:
                  "transform 180ms ease, box-shadow 180ms ease",
              }}
            >
              <span>
                Launch Dashboard
              </span>

              <span
                style={{
                  fontSize: 22,
                  lineHeight: 1,
                  fontWeight: 500,
                  marginTop: -2,
                }}
              >
                →
              </span>
            </Link>
          </div>
        </div>

        {/* =====================================================
            SUN / SPACECRAFT
           ===================================================== */}

        <div
          style={{
            position: "absolute",

            right: "-1%",
            top: "50%",

            transform:
              "translateY(-50%)",

            width: "58%",
            height: "78vh",

            minHeight: 560,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            zIndex: 6,

            pointerEvents: "none",
          }}
        >
          <Sun3D size={580} />
        </div>

        {/* =====================================================
            BOTTOM RIGHT DATA
           ===================================================== */}

        <div
          style={{
            position: "absolute",
            right: "6vw",
            bottom: 42,

            display: "flex",
            alignItems: "center",
            gap: 28,

            zIndex: 15,
          }}
        >
          <div
            style={{
              paddingLeft: 12,
              borderLeft:
                "1px solid rgba(255,159,28,0.42)",
            }}
          >
            <div
              style={{
                color: "#535c6c",
                fontSize: 8,
                letterSpacing: 1.5,
                marginBottom: 6,
              }}
            >
              L1 DISTANCE
            </div>

            <div
              style={{
                color: "#b5bac4",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              1.5M KM
            </div>
          </div>

          <div
            style={{
              paddingLeft: 12,
              borderLeft:
                "1px solid rgba(255,159,28,0.42)",
            }}
          >
            <div
              style={{
                color: "#535c6c",
                fontSize: 8,
                letterSpacing: 1.5,
                marginBottom: 6,
              }}
            >
              DATA STREAM
            </div>

            <div
              style={{
                color: "#b5bac4",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              ACTIVE
            </div>
          </div>
        </div>

        {/* =====================================================
            VERY SUBTLE FOOTER LABEL
           ===================================================== */}

        <div
          style={{
            position: "absolute",
            right: "6vw",
            bottom: 14,

            color: "#343b49",

            fontSize: 8,
            letterSpacing: 2,

            zIndex: 15,
          }}
        >
          AEGIS / SPACE WEATHER INTELLIGENCE
        </div>
      </section>
    </main>
  );
}