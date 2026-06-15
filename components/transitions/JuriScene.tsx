"use client";
import { useEffect, useState } from "react";

interface Props { onDone: () => void; }

export default function JuriScene({ onDone }: Props) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => onDone(), 2400);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, [onDone]);

  const juriColors = ["#e05252","#7c6fe0","#52b788","#e8c547","#f4845f"];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "rgba(15,14,23,0.96)" }}>
      <svg viewBox="0 0 340 220" width="340" height="220">
        {/* Kapı */}
        <rect x="145" y="60" width="50" height="130" rx="3" fill="#3d2710"
          style={{
            transform: phase >= 2 ? "scaleX(0.1)" : "scaleX(1)",
            transformOrigin: "145px 125px",
            transition: "transform 0.6s ease-in-out",
          }} />
        <rect x="148" y="63" width="44" height="124" rx="2" fill="#4a3020"
          style={{
            transform: phase >= 2 ? "scaleX(0.1)" : "scaleX(1)",
            transformOrigin: "145px 125px",
            transition: "transform 0.6s ease-in-out",
          }} />
        <circle cx="185" cy="128" r="4" fill="#c4a827"
          style={{ opacity: phase >= 2 ? 0 : 1, transition: "opacity 0.3s" }} />
        {/* Duvar */}
        <rect x="0" y="55" width="145" height="165" fill="#2a1f3d" />
        <rect x="195" y="55" width="145" height="165" fill="#2a1f3d" />
        {/* Kapı çerçevesi */}
        <rect x="140" y="55" width="60" height="140" rx="4" fill="none" stroke="#c4a827" strokeWidth="2" opacity="0.5" />

        {/* Jüri figürleri (kapıya doğru yürüyor) */}
        {juriColors.map((color, i) => {
          const startX = 30 + i * 55;
          const endX = 155 + i * 4;
          const x = phase === 0 ? startX : phase === 1 ? startX + (endX - startX) * 0.5 : endX;
          const opacity = phase >= 2 ? Math.max(0, 1 - (i * 0.15)) : 1;
          return (
            <g key={i} style={{ transform: `translateX(${x}px)`, transition: "transform 0.8s ease-in-out", opacity, transitionDelay: `${i * 0.05}s` }}>
              <g transform="translate(0, 70)">
                {/* Vücut */}
                <ellipse cx="0" cy="0" rx="14" ry="18" fill={color} opacity="0.85" />
                {/* Kafa */}
                <circle cx="0" cy="-26" r="12" fill="#F0C27F" />
                {/* Saç */}
                <ellipse cx="0" cy="-34" rx="10" ry="8" fill={color} opacity="0.7" />
              </g>
            </g>
          );
        })}

        {/* İçeriden gelen ışık */}
        {phase >= 2 && (
          <path d="M145,55 L145,195 L195,195 L195,55" fill="#c4a82720"
            style={{ filter: "blur(4px)" }} />
        )}
      </svg>

      <p className="text-xl font-bold tracking-widest mt-4" style={{ color: "#52b788" }}>
        Jüri Müzakereye Geçiyor
      </p>
      <p className="text-sm mt-2" style={{ color: "var(--muted)", opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
        Karar için toplanıyorlar...
      </p>
    </div>
  );
}
