interface Props {
  title: string;
}

export default function AegisCard({
  title,
}: Props) {
  return (
    <div className="aegis-card aegis-glow h-72 p-5">
      <h3
        className="text-cyan-400 text-sm tracking-wider"
        style={{
          fontFamily: "var(--font-orbitron)",
        }}
      >
        {title}
      </h3>
    </div>
  );
}