"use client";
import { useEffect, useRef } from "react";

function hashNoise(ix: number, iy: number, seed: number) {
  let h = ix * 374761393 + iy * 668265263 + seed * 144269504;
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return (((h % 2147483647) + 2147483647) % 2147483647) / 2147483647;
}

function smoothNoise(x: number, y: number, seed: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
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

function fbm(x: number, y: number, seed: number, octaves = 5) {
  let total = 0, amp = 0.5, freq = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    total += smoothNoise(x * freq, y * freq, seed + i * 17) * amp;
    max += amp;
    amp *= 0.55;
    freq *= 2.1;
  }
  return total / max;
}

function diverge(v: number): [number, number, number] {
  v = Math.max(-1, Math.min(1, v));
  if (v >= 0) {
    const t = v;
    return [255, Math.round(255 - t * 215), Math.round(255 - t * 215)];
  }
  const t = -v;
  return [Math.round(255 - t * 225), Math.round(255 - t * 175), 255];
}

export default function CoronalDifferenceCanvas({ size = 200 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    // No DPR scaling here on purpose: putImageData writes raw pixels into
    // the backing store and ignores ctx.scale/setTransform entirely. If the
    // backing store is size*dpr but the ImageData is only size x size, only
    // a corner gets painted — that was the wedge/offset-hole bug. Rendering
    // 1:1 avoids the whole class of bug; the noise pattern doesn't need
    // retina sharpness anyway.
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = size / 2;
    const cy = size / 2;
    const rOuter = size * 0.46;
    const rInner = size * 0.095;
    const img = ctx.createImageData(size, size);
    const seed = 91731;

    for (let py = 0; py < size; py++) {
      for (let px = 0; px < size; px++) {
        const dx = px - cx, dy = py - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const idx = (py * size + px) * 4;

        if (dist > rOuter || dist < rInner) {
          img.data[idx] = 0; img.data[idx + 1] = 0; img.data[idx + 2] = 0; img.data[idx + 3] = 255;
          continue;
        }

        const theta = Math.atan2(dy, dx);
        const rNorm = dist / rOuter;

        const sectorBias =
          Math.sin(theta * 3.4 + rNorm * 2.4) * 0.55 +
          Math.sin(theta * 1.6 - rNorm * 3.2 + 1.3) * 0.35;

        const streaks = fbm(Math.cos(theta) * rNorm * 5.5, Math.sin(theta) * rNorm * 5.5 + theta * 2.5, seed, 4);
        const speckle = fbm(px * 0.11, py * 0.11, seed + 500, 3);

        let v = sectorBias * 0.6 + (streaks - 0.5) * 1.35 + (speckle - 0.5) * 0.9;
        v *= 0.7 + 0.45 * (1 - rNorm);

        const [r, g, b] = diverge(v);
        img.data[idx] = r; img.data[idx + 1] = g; img.data[idx + 2] = b; img.data[idx + 3] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);

    // Occulting disk
    ctx.beginPath();
    ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, rInner * 0.55, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Outer field-of-view edge
    ctx.beginPath();
    ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(100,116,139,0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Dashed FOV boundary rings, drawn on the SAME canvas/coordinate space
    // as the disk so they can never drift out of alignment with it.
    const drawDashedRing = (r: number, color: string) => {
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    };
    drawDashedRing(rOuter * 0.78, "rgba(148,163,184,0.55)");
    drawDashedRing(rOuter * 1.02, "rgba(100,116,139,0.45)");
  }, [size]);

  return (
    <canvas
      ref={ref}
      style={{ width: size, height: size, display: "block" }}
    />
  );
}