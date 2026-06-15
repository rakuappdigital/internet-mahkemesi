"use client";
import { useEffect, useState } from "react";

interface Props {
  onDone: () => void;
  karar?: "suclu" | "sucsuz" | "kararsiz";
}

export default function KararScene({ onDone, karar = "sucsuz" }: Props) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1000);
    const t3 = setTimeout(() => setPhase(3), 1800);
    const t4 = setTimeout(() => onDone(), 2800);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, [onDone]);

  const kararRenk = karar === "suclu" ? "#e05252" : karar === "sucsuz" ? "#52b788" : "#c4a827";
  const kararYazi = karar === "suclu" ? "SUÇ​LU" : karar === "sucsuz" ? "SUÇSUZ" : "KARA​RSIZ";
  const kararAlt  = karar === "suclu" ? "Sanık mahkum edildi!" : karar === "sucsuz" ? "Sanık beraat etti!" : "Jüri karara varamadı.";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "rgba(15,14,23,0.97)" }}>

      <svg viewBox="0 0 320 240" width="320" height="240">
        <defs>
          <radialGradient id="kararGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={kararRenk} stopOpacity="0.3" />
            <stop offset="100%" stopColor={kararRenk} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Arka plan ışıltı */}
        {phase >= 2 && (
          <ellipse cx="160" cy="120" rx="140" ry="100" fill="url(#kararGlow)"
            style={{ opacity: phase >= 3 ? 0.8 : 0, transition: "opacity 0.6s" }} />
        )}

        {/* Terazi */}
        <g style={{
          transform: `translateY(${phase === 0 ? -30 : 0}px)`,
          opacity: phase >= 1 ? 1 : 0,
          transition: "transform 0.6s ease-out, opacity 0.4s",
        }}>
          {/* Direk */}
          <line x1="160" y1="30" x2="160" y2="90" stroke="#c4a827" strokeWidth="2" />
          <circle cx="160" cy="28" r="6" fill="#c4a827" />

          {/* Kol */}
          <line x1="90" y1="70" x2="230" y2="70" stroke="#c4a827" strokeWidth="2" />

          {/* Sol kefesi */}
          <g style={{
            transform: karar === "suclu"
              ? `translateY(30px) rotate(-8deg)`
              : karar === "sucsuz"
              ? `translateY(-15px) rotate(4deg)`
              : "translateY(0px)",
            transformOrigin: "90px 70px",
            transition: "transform 0.8s ease-in-out",
          }}>
            <line x1="90" y1="70" x2="90" y2="100" stroke="#c4a827" strokeWidth="1.5" />
            <line x1="78" y1="100" x2="102" y2="100" stroke="#c4a827" strokeWidth="1.5" />
            <ellipse cx="90" cy="108" rx="18" ry="6" fill={karar === "suclu" ? kararRenk : "#333"} opacity="0.8" />
          </g>

          {/* Sağ kefesi */}
          <g style={{
            transform: karar === "suclu"
              ? `translateY(-15px) rotate(4deg)`
              : karar === "sucsuz"
              ? `translateY(30px) rotate(-8deg)`
              : "translateY(0px)",
            transformOrigin: "230px 70px",
            transition: "transform 0.8s ease-in-out",
          }}>
            <line x1="230" y1="70" x2="230" y2="100" stroke="#c4a827" strokeWidth="1.5" />
            <line x1="218" y1="100" x2="242" y2="100" stroke="#c4a827" strokeWidth="1.5" />
            <ellipse cx="230" cy="108" rx="18" ry="6" fill={karar === "sucsuz" ? kararRenk : "#333"} opacity="0.8" />
          </g>
        </g>

        {/* Tokmak çarpma efekti */}
        {phase >= 2 && (
          <>
            <rect x="130" y="170" width="60" height="14" rx="7" fill="#5c3d1e"
              style={{ opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.3s" }} />
            <rect x="125" y="155" width="70" height="24" rx="10" fill="#6b4828"
              style={{
                transform: `translateY(${phase >= 2 ? 0 : -20}px)`,
                transition: "transform 0.2s ease-out",
              }} />
            {/* Çarpma dalgaları */}
            {[0,1,2].map(i => (
              <ellipse key={i} cx="160" cy="177" rx={30+i*20} ry={5+i*3}
                fill="none" stroke={kararRenk} strokeWidth="1"
                opacity={phase >= 3 ? 0.6 - i*0.2 : 0}
                style={{ transition: `opacity 0.4s ease-out ${i*0.1}s` }} />
            ))}
          </>
        )}
      </svg>

      {/* Karar metni */}
      <p className="text-3xl font-black tracking-[0.3em] mt-2"
        style={{
          color: kararRenk,
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "scale(1)" : "scale(0.5)",
          transition: "opacity 0.4s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          textShadow: `0 0 30px ${kararRenk}80`,
        }}>
        {kararYazi}
      </p>
      <p className="text-sm mt-2"
        style={{
          color: "var(--muted)",
          opacity: phase >= 3 ? 1 : 0,
          transition: "opacity 0.4s 0.2s",
        }}>
        {kararAlt}
      </p>
    </div>
  );
}
