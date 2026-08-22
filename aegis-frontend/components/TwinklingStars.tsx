"use client";

import { useEffect, useState } from "react";

type Star = {
  id: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  glow: boolean;
};

export default function TwinklingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 160 }, (_, i) => {
      const size =
        Math.random() < 0.88
          ? Math.random() * 1.4 + 0.5
          : Math.random() * 2 + 1;

      return {
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size,
        opacity: 0.2 + Math.random() * 0.65,
        duration: 1.8 + Math.random() * 4.5,
        delay: Math.random() * 6,
        glow: size > 1.7,
      };
    });

    setStars(generatedStars);
  }, []);

  return (
    <>
      {/* Inline keyframes — nothing added to globals.css */}
      <style>{`
        @keyframes aegisStarTwinkle {
          0%, 100% {
            opacity: 0.18;
            transform: scale(0.7);
          }

          20% {
            opacity: 0.4;
            transform: scale(0.9);
          }

          45% {
            opacity: 0.95;
            transform: scale(1.15);
          }

          55% {
            opacity: 1;
            transform: scale(1.3);
          }

          75% {
            opacity: 0.5;
            transform: scale(0.95);
          }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {stars.map((star) => (
          <span
            key={star.id}
            style={{
              position: "absolute",
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: "50%",
              background: "#dbeafe",
              opacity: star.opacity,

              boxShadow: star.glow
                ? `
                    0 0 3px rgba(190, 220, 255, 0.8),
                    0 0 8px rgba(140, 190, 255, 0.35)
                  `
                : "0 0 2px rgba(180, 210, 255, 0.35)",

              animation: `aegisStarTwinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>
    </>
  );
}