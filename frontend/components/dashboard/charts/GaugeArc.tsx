interface GaugeArcProps {
  percent: number;
}

export default function GaugeArc({
  percent,
}: GaugeArcProps) {
  const r = 80;
  const cx = 110;
  const cy = 110;

  const startAngle = -210;
  const sweepAngle = 240;

  const toRad = (d: number) => (d * Math.PI) / 180;

  const arc = (angle: number) => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  });

  const endAngle =
    startAngle + sweepAngle * (percent / 100);

  const s = arc(startAngle);
  const e = arc(endAngle);
  const full = arc(startAngle + sweepAngle);

  const largeArc =
    sweepAngle * (percent / 100) > 180 ? 1 : 0;

  const largeTrack = sweepAngle > 180 ? 1 : 0;

  const needleAngle =
    startAngle + sweepAngle * (percent / 100);

  const nx =
    cx + (r - 10) * Math.cos(toRad(needleAngle));

  const ny =
    cy + (r - 10) * Math.sin(toRad(needleAngle));

  return (
    <svg width={220} height={160} viewBox="0 0 220 160">
      <defs>
        <linearGradient
          id="gaugeGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      <path
        d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${largeTrack} 1 ${full.x} ${full.y}`}
        fill="none"
        stroke="#1a2540"
        strokeWidth={12}
        strokeLinecap="round"
      />

      <path
        d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`}
        fill="none"
        stroke="url(#gaugeGrad)"
        strokeWidth={12}
        strokeLinecap="round"
      />

      <line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke="#ef4444"
        strokeWidth={2}
      />

      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#ef4444"
      />
    </svg>
  );
}