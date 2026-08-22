"use client";

import { useEffect, useRef } from "react";

function hashNoise(ix: number, iy: number, seed: number) {
  let h = ix * 374761393 + iy * 668265263 + seed * 144269504;
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);

  return (
    (((h % 2147483647) + 2147483647) % 2147483647) /
    2147483647
  );
}

function smoothNoise(x: number, y: number, seed: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);

  const fx = x - ix;
  const fy = y - iy;

  const v00 = hashNoise(ix, iy, seed);
  const v10 = hashNoise(ix + 1, iy, seed);
  const v01 = hashNoise(ix, iy + 1, seed);
  const v11 = hashNoise(ix + 1, iy + 1, seed);

  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);

  const a = v00 + (v10 - v00) * sx;
  const b = v01 + (v11 - v01) * sx;

  return a + (b - a) * sy;
}

function fbm(
  x: number,
  y: number,
  seed: number,
  octaves = 5
) {
  let total = 0;
  let amp = 0.5;
  let freq = 1;
  let max = 0;

  for (let i = 0; i < octaves; i++) {
    total +=
      smoothNoise(
        x * freq,
        y * freq,
        seed + i * 17
      ) * amp;

    max += amp;
    amp *= 0.55;
    freq *= 2.1;
  }

  return total / max;
}

/*
 * Dark navy / cyan / muted red palette
 * to match the AEGIS dashboard.
 */
function diverge(v: number): [number, number, number] {
  v = Math.max(-1, Math.min(1, v));

  // Positive = RED
  if (v > 0) {
    const t = v;

    return [
      255,
      Math.round(255 - t * 170),
      Math.round(255 - t * 170),
    ];
  }

  // Negative = BLUE
  if (v < 0) {
    const t = -v;

    return [
      Math.round(255 - t * 190),
      Math.round(255 - t * 110),
      255,
    ];
  }

  // Zero = WHITE
  return [255, 255, 255];
}

export default function CoronalDifferenceCanvas({
  size = 200,
}: {
  size?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;

    if (!canvas) return;

    canvas.width = size;
    canvas.height = size;

    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const cx = size / 2;
    const cy = size / 2;

    const rOuter = size * 0.43;
    const rInner = size * 0.095;

    const img = ctx.createImageData(size, size);

    const seed = 91731;

    for (let py = 0; py < size; py++) {
      for (let px = 0; px < size; px++) {
        const dx = px - cx;
        const dy = py - cy;

        const dist = Math.sqrt(dx * dx + dy * dy);

        const idx = (py * size + px) * 4;

        /*
         * IMPORTANT:
         * Outside the solar disk is transparent instead of black.
         * This removes the ugly black square around the image.
         */
        if (dist > rOuter || dist < rInner) {
          img.data[idx] = 0;
          img.data[idx + 1] = 0;
          img.data[idx + 2] = 0;
          img.data[idx + 3] = 0;
          continue;
        }

        const theta = Math.atan2(dy, dx);
        const rNorm = dist / rOuter;

        /*
         * Large-scale solar structures.
         */
        const sectorBias =
          Math.sin(theta * 3.4 + rNorm * 2.4) * 0.55 +
          Math.sin(
            theta * 1.6 -
              rNorm * 3.2 +
              1.3
          ) * 0.35;

        const streaks = fbm(
          Math.cos(theta) * rNorm * 5.5,
          Math.sin(theta) * rNorm * 5.5 +
            theta * 2.5,
          seed,
          4
        );

        const speckle = fbm(
          px * 0.11,
          py * 0.11,
          seed + 500,
          3
        );

        let v =
          sectorBias * 0.6 +
          (streaks - 0.5) * 1.35 +
          (speckle - 0.5) * 0.9;

        v *= 0.7 + 0.45 * (1 - rNorm);

        const [r, g, b] = diverge(v);

        /*
         * Slight transparency so the image feels
         * integrated into the dashboard rather than pasted in.
         */
        const alpha = Math.round(
          190 + 50 * (1 - rNorm)
        );

        img.data[idx] = r;
        img.data[idx + 1] = g;
        img.data[idx + 2] = b;
        img.data[idx + 3] = alpha;
      }
    }

    ctx.putImageData(img, 0, 0);

    /*
     * Soft cyan glow behind the solar disk.
     */
    const glow = ctx.createRadialGradient(
      cx,
      cy,
      rInner,
      cx,
      cy,
      rOuter * 1.05
    );

    glow.addColorStop(
      0,
      "rgba(34,211,238,0.10)"
    );

    glow.addColorStop(
      0.65,
      "rgba(14,165,233,0.035)"
    );

    glow.addColorStop(
      1,
      "rgba(14,165,233,0)"
    );

    ctx.beginPath();
    ctx.arc(
      cx,
      cy,
      rOuter,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = glow;
    ctx.fill();

    /*
     * Outer solar boundary.
     */
    ctx.beginPath();

    ctx.arc(
      cx,
      cy,
      rOuter,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle =
      "rgba(34,211,238,0.35)";

    ctx.lineWidth = 1;

    ctx.stroke();

    /*
     * Inner subtle boundary.
     */
    ctx.beginPath();

    ctx.arc(
      cx,
      cy,
      rOuter * 0.96,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle =
      "rgba(71,85,105,0.35)";

    ctx.lineWidth = 1;

    ctx.stroke();

    /*
     * Occulting disk.
     */
    ctx.beginPath();

    ctx.arc(
      cx,
      cy,
      rInner,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = "#020617";

    ctx.fill();

    /*
     * Occulting disk border.
     */
    ctx.beginPath();

    ctx.arc(
      cx,
      cy,
      rInner,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle =
      "rgba(34,211,238,0.45)";

    ctx.lineWidth = 1;

    ctx.stroke();

    /*
     * Small central glow.
     */
    const centerGlow =
      ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        rInner * 1.8
      );

    centerGlow.addColorStop(
      0,
      "rgba(34,211,238,0.18)"
    );

    centerGlow.addColorStop(
      1,
      "rgba(34,211,238,0)"
    );

    ctx.beginPath();

    ctx.arc(
      cx,
      cy,
      rInner * 1.8,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = centerGlow;

    ctx.fill();

    /*
     * FOV rings.
     */
    const drawDashedRing = (
      r: number,
      color: string
    ) => {
      ctx.beginPath();

      ctx.setLineDash([3, 4]);

      ctx.arc(
        cx,
        cy,
        r,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle = color;

      ctx.lineWidth = 0.8;

      ctx.stroke();

      ctx.setLineDash([]);
    };

    drawDashedRing(
      rOuter * 0.78,
      "rgba(71,85,105,0.35)"
    );

    drawDashedRing(
      rOuter * 0.92,
      "rgba(34,211,238,0.18)"
    );
  }, [size]);

  return (
    <canvas
      ref={ref}
      style={{
        width: size,
        height: size,
        display: "block",
      }}
    />
  );
}