"use client";
import { useEffect, useState } from "react";

interface Props {
  onDone: () => void;
  label?: string;
}

export default function GavelScene({ onDone, label = "Mahkeme Açılıyor" }: Props) {
  const [phase, setPhase] = useState(0); // 0:hazır, 1:iniyor, 2:çarpıyor, 3:bitiyor

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1500);
    const t4 = setTimeout(() => onDone(), 2200);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "rgba(15,14,23,0.96)" }}>

      <svg viewBox="0 0 300 260" width="300" height="260">
        <defs>
          <radialGradient id="glowG" cx="50%" cy="70%" r="50%">
            <stop offset="0%" stopColor="#c4a827" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#c4a827" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Tokmak tabanı */}
        <rect x="80" y="185" width="140" height="18" rx="9" fill="#5c3d1e" />
        <rect x="90" y="180" width="120" height="10" rx="5" fill="#8b5e3c" />

        {/* Dalga efekti (çarpınca) */}
        {phase >= 2 && (
          <>
            <ellipse cx="150" cy="192" rx="60" ry="8" fill="none" stroke="#c4a827" strokeWidth="2"
              opacity={phase === 2 ? 0.8 : 0} style={{ transition: "opacity 0.3s" }} />
            <ellipse cx="150" cy="192" rx="90" ry="14" fill="none" stroke="#c4a827" strokeWidth="1"
              opacity={phase === 2 ? 0.4 : 0} style={{ transition: "opacity 0.3s" }} />
          </>
        )}

        {/* Tokmak gövdesi */}
        <g style={{
          transform: `translateY(${phase === 0 ? -80 : phase === 1 ? -20 : phase === 2 ? 0 : -10}px)`,
          transition: phase === 1 ? "transform 0.5s ease-in" : phase === 2 ? "transform 0.1s ease-out" : "transform 0.3s ease-out",
        }}>
          {/* Sap */}
          <rect x="143" y="80" width="14" height="100" rx="7" fill="#8b5e3c" />
          <rect x="146" y="82" width="5" height="96" rx="2" fill="#a06e48" opacity="0.5" />
          {/* Baş */}
          <rect x="110" y="60" width="80" height="36" rx="10" fill="#6b4828" />
          <rect x="113" y="63" width="74" height="30" rx="8" fill="#8b5e3c" />
          {/* Altın çizgiler */}
          <rect x="110" y="73" width="80" height="3" fill="#c4a827" opacity="0.5" />
          <rect x="110" y="79" width="80" height="2" fill="#c4a827" opacity="0.3" />
        </g>

        {/* Işık efekti (taban) */}
        {phase >= 2 && <ellipse cx="150" cy="192" rx="70" ry="20" fill="url(#glowG)" />}

        {/* Terazi sembolü */}
        <g opacity={phase >= 2 ? 0.6 : 0.2} style={{ transition: "opacity 0.5s" }}>
          <line x1="150" y1="30" x2="150" y2="55" stroke="#c4a827" strokeWidth="1.5" />
          <line x1="120" y1="38" x2="180" y2="38" stroke="#c4a827" strokeWidth="1.5" />
          <ellipse cx="120" cy="50" rx="12" ry="4" fill="none" stroke="#c4a827" strokeWidth="1" />
          <ellipse cx="180" cy="50" rx="12" ry="4" fill="none" stroke="#c4a827" strokeWidth="1" />
          <line x1="120" y1="38" x2="120" y2="50" stroke="#c4a827" strokeWidth="1" />
          <line x1="180" y1="38" x2="180" y2="50" stroke="#c4a827" strokeWidth="1" />
        </g>
      </svg>

      <p className="text-xl font-bold tracking-widest mt-4"
        style={{ color: "var(--accent)", opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
        {label}
      </p>
      <p className="text-sm mt-2" style={{ color: "var(--muted)", opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.5s" }}>
        Judge Me or Not
      </p>
    </div>
  );
}
