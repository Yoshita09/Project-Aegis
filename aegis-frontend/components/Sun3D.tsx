"use client";

import { useEffect, useRef, useState } from "react";

interface Sun3DProps {
  size?: number;
}

export default function Sun3D({
  size = 620,
}: Sun3DProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #FFF2B8 0%, #FFD15C 35%, #FF8A16 65%, #B83B12 100%)",
          filter: "blur(25px)",
          opacity: 0.45,
        }}
      />
    );
  }

  return <SunCanvas size={size} />;
}

function SunCanvas({ size }: { size: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);

    let raf = 0;
    let t = 0;

    const cx = size / 2;
    const cy = size / 2;
    const sunR = size * 0.28;

    /* ---------------- PLASMA CELLS ---------------- */

    const blobs = Array.from(
      { length: 70 },
      () => ({
        a: Math.random() * Math.PI * 2,
        r: Math.random() * sunR * 0.95,
        s: 6 + Math.random() * 20,
        ph: Math.random() * Math.PI * 2,
        hue: 25 + Math.random() * 20,
      })
    );

    /* ---------------- SOLAR FLARES ---------------- */

    const flares = Array.from(
      { length: 8 },
      (_, i) => ({
        a: (i / 8) * Math.PI * 2,
        len:
          sunR *
          (0.4 + Math.random() * 0.7),
        ph: Math.random() * Math.PI * 2,
      })
    );

    /* ---------------- PARTICLES ---------------- */

    type Particle = {
      a: number;
      r: number;
      v: number;
      life: number;
      size: number;
    };

    const particles: Particle[] = [];

    /* ---------------- DRAW ---------------- */

    const draw = () => {
      t += 0.012;

      ctx.clearRect(
        0,
        0,
        size,
        size
      );

      /* ---------------- CORONA ---------------- */

      // ================= SOFT CORONA =================

const coronaRadius = sunR * 1.99;

const corona = ctx.createRadialGradient(
  cx,
  cy,
  sunR * 0.65,
  cx,
  cy,
  coronaRadius
);

corona.addColorStop(
  0,
  "rgba(255,185,65,0.34)"
);

corona.addColorStop(
  0.28,
  "rgba(255,145,35,0.18)"
);

corona.addColorStop(
  0.55,
  "rgba(255,105,25,0.07)"
);

corona.addColorStop(
  0.78,
  "rgba(255,75,20,0.025)"
);

corona.addColorStop(
  1,
  "rgba(255,60,20,0)"
);

// IMPORTANT:
// draw a circle instead of filling the entire canvas.
// This removes the visible rectangular canvas edge.
ctx.fillStyle = corona;

ctx.beginPath();
ctx.arc(
  cx,
  cy,
  coronaRadius,
  0,
  Math.PI * 2
);

ctx.fill();

      /* ---------------- CORONA STREAMERS ---------------- */

      ctx.save();

      ctx.translate(cx, cy);
      ctx.rotate(t * 0.05);

      for (let i = 0; i < 44; i++) {
        const a =
          (i / 44) *
          Math.PI *
          2;

        const len =
          sunR *
          (
            1.35 +
            Math.sin(
              t * 1.2 + i
            ) *
              0.3
          );

        const gradient =
          ctx.createLinearGradient(
            0,
            0,
            Math.cos(a) * len,
            Math.sin(a) * len
          );

        gradient.addColorStop(
          0,
          "rgba(255,210,110,0.38)"
        );

        gradient.addColorStop(
          0.45,
          "rgba(255,145,40,0.16)"
        );

        gradient.addColorStop(
          1,
          "rgba(255,70,20,0)"
        );

        ctx.strokeStyle =
          gradient;

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.moveTo(
          Math.cos(a) * sunR,
          Math.sin(a) * sunR
        );

        ctx.lineTo(
          Math.cos(a) * len,
          Math.sin(a) * len
        );

        ctx.stroke();
      }

      ctx.restore();

      /* ---------------- SUN BODY ---------------- */

      const sunGradient =
        ctx.createRadialGradient(
          cx - sunR * 0.3,
          cy - sunR * 0.32,
          sunR * 0.05,
          cx,
          cy,
          sunR
        );

      sunGradient.addColorStop(
        0,
        "#FFFBE2"
      );

      sunGradient.addColorStop(
        0.18,
        "#FFF0B0"
      );

      sunGradient.addColorStop(
        0.42,
        "#FFD66A"
      );

      sunGradient.addColorStop(
        0.68,
        "#FF9D20"
      );

      sunGradient.addColorStop(
        0.86,
        "#F87512"
      );

      sunGradient.addColorStop(
        1,
        "#B93A12"
      );

      ctx.fillStyle =
        sunGradient;

      ctx.beginPath();

      ctx.arc(
        cx,
        cy,
        sunR,
        0,
        Math.PI * 2
      );

      ctx.fill();

      /* ---------------- PLASMA ---------------- */

      ctx.save();

      ctx.beginPath();

      ctx.arc(
        cx,
        cy,
        sunR,
        0,
        Math.PI * 2
      );

      ctx.clip();

      ctx.globalCompositeOperation =
        "screen";

      for (const blob of blobs) {
        const a =
          blob.a + t * 0.18;

        const x =
          cx +
          Math.cos(a) *
            blob.r;

        const y =
          cy +
          Math.sin(a) *
            blob.r *
            0.96;

        const pulse =
          0.5 +
          Math.sin(
            t * 2 + blob.ph
          ) *
            0.5;

        const gradient =
          ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            blob.s
          );

        gradient.addColorStop(
          0,
          `hsla(
            ${blob.hue},
            100%,
            ${60 + pulse * 15}%,
            ${0.5 + pulse * 0.3}
          )`
        );

        gradient.addColorStop(
          1,
          "rgba(255,90,20,0)"
        );

        ctx.fillStyle =
          gradient;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          blob.s,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }

      /* ---------------- SUNSPOTS ---------------- */

      ctx.globalCompositeOperation =
        "multiply";

      const sunspots = [
        [-0.42, -0.34, 18],
        [0.38, -0.10, 22],
        [-0.08, 0.42, 15],
        [0.34, 0.38, 12],
        [-0.55, 0.08, 10],
      ];

      for (const [
        px,
        py,
        radius,
      ] of sunspots) {
        const x =
          cx + px * sunR;

        const y =
          cy + py * sunR;

        const spot =
          ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            radius
          );

        spot.addColorStop(
          0,
          "rgba(244, 128, 55,0.42)"
        );

        spot.addColorStop(
          0.45,
          "rgba(244, 128, 55,0.25)"
        );

        spot.addColorStop(
          1,
          "rgba(244, 128, 55,0)"
        );

        ctx.fillStyle = spot;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          radius,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }

      ctx.restore();

      /* ---------------- RIM ---------------- */

     // ================= SUBTLE SUN EDGE =================

ctx.save();

ctx.globalCompositeOperation = "screen";

const rim = ctx.createRadialGradient(
  cx,
  cy,
  sunR * 0.88,
  cx,
  cy,
  sunR
);

rim.addColorStop(
  0,
  "rgba(255,220,130,0)"
);

rim.addColorStop(
  0.1,
  "rgba(255,200,90,0.015)"
);

rim.addColorStop(
  0.11,
  "rgba(255,175,60,0.08)"
);

ctx.fillStyle = rim;

ctx.beginPath();
ctx.arc(
  cx,
  cy,
  sunR,
  0,
  Math.PI * 2
);

ctx.fill();

ctx.restore();

      /* ---------------- SOLAR FLARES ---------------- */

      for (const flare of flares) {
        const a =
          flare.a + t * 0.1;

        const intensity =
          0.5 +
          Math.sin(
            t * 1.4 + flare.ph
          ) *
            0.5;

        const x0 =
          cx +
          Math.cos(a) *
            sunR;

        const y0 =
          cy +
          Math.sin(a) *
            sunR;

        const x1 =
          cx +
          Math.cos(a) *
            (
              sunR +
              flare.len *
                intensity
            );

        const y1 =
          cy +
          Math.sin(a) *
            (
              sunR +
              flare.len *
                intensity
            );

        const gradient =
          ctx.createLinearGradient(
            x0,
            y0,
            x1,
            y1
          );

        gradient.addColorStop(
          0,
          `rgba(
            255,
            240,
            170,
            ${0.9 * intensity}
          )`
        );

        gradient.addColorStop(
          0.5,
          `rgba(
            255,
            155,
            45,
            ${0.45 * intensity}
          )`
        );

        gradient.addColorStop(
          1,
          "rgba(255,70,20,0)"
        );

        ctx.strokeStyle =
          gradient;

        ctx.lineWidth =
          2 + intensity * 2;

        ctx.beginPath();

        ctx.moveTo(x0, y0);

        const mx =
          (x0 + x1) / 2 +
          Math.cos(a + 1.2) *
            14 *
            intensity;

        const my =
          (y0 + y1) / 2 +
          Math.sin(a + 1.2) *
            14 *
            intensity;

        ctx.quadraticCurveTo(
          mx,
          my,
          x1,
          y1
        );

        ctx.stroke();
      }

      /* ---------------- SOLAR WIND ---------------- */

      if (Math.random() < 0.65) {
        particles.push({
          a:
            Math.random() *
            Math.PI *
            2,
          r: sunR + 2,
          v:
            0.3 +
            Math.random() * 0.65,
          life: 1,
          size:
            0.4 +
            Math.random() * 1.2,
        });
      }

      ctx.globalCompositeOperation =
        "screen";

      for (
        let i =
          particles.length - 1;
        i >= 0;
        i--
      ) {
        const p =
          particles[i];

        p.r += p.v;
        p.life -= 0.006;

        if (
          p.life <= 0 ||
          p.r > size * 0.5
        ) {
          particles.splice(i, 1);
          continue;
        }

        const x =
          cx +
          Math.cos(p.a) *
            p.r;

        const y =
          cy +
          Math.sin(p.a) *
            p.r;

        ctx.fillStyle =
          `rgba(
            255,
            205,
            110,
            ${p.life}
          )`;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          p.size,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }

      ctx.globalCompositeOperation =
        "source-over";

      /* ---------------- LENS FLARE ---------------- */

      const lens =
        ctx.createRadialGradient(
          cx - sunR * 0.38,
          cy - sunR * 0.48,
          0,
          cx - sunR * 0.38,
          cy - sunR * 0.48,
          70
        );

      lens.addColorStop(
        0,
        "rgba(255,255,255,0.7)"
      );

      lens.addColorStop(
        0.25,
        "rgba(255,245,190,0.25)"
      );

      lens.addColorStop(
        1,
        "rgba(255,255,255,0)"
      );

      ctx.fillStyle = lens;

      ctx.beginPath();

      ctx.arc(
        cx - sunR * 0.38,
        cy - sunR * 0.48,
        70,
        0,
        Math.PI * 2
      );

      ctx.fill();

      /* ---------------- ORBIT ---------------- */

      const orbitR =
        sunR * 1.8;

      ctx.strokeStyle =
        "rgba(255,210,130,0.16)";

      ctx.lineWidth = 1;

      ctx.beginPath();

      ctx.ellipse(
        cx,
        cy,
        orbitR,
        orbitR * 0.32,
        -0.4,
        0,
        Math.PI * 2
      );

      ctx.stroke();

      /* second orbit */

      ctx.strokeStyle =
        "rgba(255,170,80,0.07)";

      ctx.beginPath();

      ctx.ellipse(
        cx,
        cy,
        orbitR * 1.15,
        orbitR * 0.38,
        -0.4,
        0,
        Math.PI * 2
      );

      ctx.stroke();

      /* ---------------- ADITYA-L1 ---------------- */

const satelliteAngle = t * 0.4;

const sx =
  cx +
  Math.cos(satelliteAngle) *
    orbitR *
    Math.cos(-0.4) -
  Math.sin(satelliteAngle) *
    orbitR *
    0.32 *
    Math.sin(-0.4);

const sy =
  cy +
  Math.cos(satelliteAngle) *
    orbitR *
    Math.sin(-0.4) +
  Math.sin(satelliteAngle) *
    orbitR *
    0.32 *
    Math.cos(-0.4);

ctx.save();

ctx.translate(sx, sy);

ctx.rotate(
  satelliteAngle + Math.PI / 2
);

/* satellite glow */
ctx.shadowBlur = 16;
ctx.shadowColor = "rgba(80,180,255,0.95)";

/* body */
ctx.fillStyle = "#F4F6FA";

ctx.fillRect(
  -4.5,
  -7,
  9,
  14
);

/* panels */
ctx.shadowBlur = 0;

ctx.fillStyle = "#2457A6";

/* left panel */
ctx.fillRect(
  -20,
  -3,
  14,
  6
);

/* right panel */
ctx.fillRect(
  6,
  -3,
  14,
  6
);

/* panel borders */
ctx.strokeStyle =
  "rgba(255,255,255,0.65)";

ctx.lineWidth = 0.9;

ctx.strokeRect(
  -20,
  -3,
  14,
  6
);

ctx.strokeRect(
  6,
  -3,
  14,
  6
);

/* antenna */
ctx.strokeStyle = "#F4F6FA";

ctx.lineWidth = 1.2;

ctx.beginPath();

ctx.moveTo(0, -7);
ctx.lineTo(0, -15);

ctx.stroke();

ctx.restore();

/* satellite glow point */

ctx.fillStyle =
  "rgba(80,180,255,0.9)";

ctx.shadowBlur = 15;

ctx.shadowColor =
  "rgba(80,180,255,1)";

ctx.beginPath();

ctx.arc(
  sx,
  sy,
  2.8,
  0,
  Math.PI * 2
);

ctx.fill();

ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () =>
      cancelAnimationFrame(raf);
  }, [size]);

  return (
    <canvas
      ref={ref}
      style={{
        display: "circle",
        filter:
          "drop-shadow(0 0 70px rgba(255,150,35,0.62))",
      }}
    />
  );
}