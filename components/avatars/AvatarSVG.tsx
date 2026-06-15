import { FACE_VARIANTS, type RolGroup } from "@/lib/avatarData";

interface Props {
  rolGroup: RolGroup;
  variant: number;
  size?: number;
}

function HairPath({ style, color, cx, cy }: { style: number; color: string; cx: number; cy: number }) {
  const s = cy - 20;
  switch (style) {
    case 0: // Kısa düz
      return <path d={`M${cx-18},${s+8} Q${cx-20},${s-10} ${cx},${s-14} Q${cx+20},${s-10} ${cx+18},${s+8}`} fill={color} />;
    case 1: // Uzun
      return (
        <g>
          <path d={`M${cx-18},${s+8} Q${cx-20},${s-10} ${cx},${s-14} Q${cx+20},${s-10} ${cx+18},${s+8}`} fill={color} />
          <rect x={cx-18} y={s+6} width="7" height="32" rx="3" fill={color} />
          <rect x={cx+11} y={s+6} width="7" height="32" rx="3" fill={color} />
        </g>
      );
    case 2: // Kıvırcık
      return (
        <g>
          {[-14,-7,0,7,14].map(dx => (
            <circle key={dx} cx={cx+dx} cy={s} r="9" fill={color} />
          ))}
          <rect x={cx-18} y={s} width="36" height="14" rx="0" fill={color} />
        </g>
      );
    case 3: // Kel
      return null;
    case 4: // Topuz
      return (
        <g>
          <path d={`M${cx-18},${s+8} Q${cx-20},${s-10} ${cx},${s-14} Q${cx+20},${s-10} ${cx+18},${s+8}`} fill={color} />
          <circle cx={cx} cy={s-16} r="8" fill={color} />
          <circle cx={cx} cy={s-16} r="5" fill={color} opacity="0.7" />
        </g>
      );
    default: return null;
  }
}

function FaceFeatures({ variant, cx, cy }: { variant: number; cx: number; cy: number }) {
  const f = FACE_VARIANTS[variant];
  const eyeY = cy - 2;
  const mouthY = cy + 10;

  const mouthPath = {
    neutral:   `M${cx-7},${mouthY} Q${cx},${mouthY+3} ${cx+7},${mouthY}`,
    serious:   `M${cx-7},${mouthY+2} L${cx+7},${mouthY+2}`,
    confident: `M${cx-7},${mouthY} Q${cx},${mouthY+6} ${cx+7},${mouthY}`,
    worried:   `M${cx-7},${mouthY+2} Q${cx},${mouthY-3} ${cx+7},${mouthY+2}`,
  }[f.expression];

  return (
    <g>
      {/* Gözler */}
      <ellipse cx={cx-8} cy={eyeY} rx="4" ry="4.5" fill="white" />
      <ellipse cx={cx+8} cy={eyeY} rx="4" ry="4.5" fill="white" />
      <circle cx={cx-8} cy={eyeY} r="2.5" fill={f.eyeColor} />
      <circle cx={cx+8} cy={eyeY} r="2.5" fill={f.eyeColor} />
      <circle cx={cx-7} cy={eyeY-1} r="0.8" fill="white" />
      <circle cx={cx+9} cy={eyeY-1} r="0.8" fill="white" />
      {/* Kaşlar */}
      <path d={`M${cx-12},${eyeY-7} Q${cx-8},${eyeY-9} ${cx-4},${eyeY-7}`} fill="none" stroke={f.hairColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d={`M${cx+4},${eyeY-7} Q${cx+8},${eyeY-9} ${cx+12},${eyeY-7}`} fill="none" stroke={f.hairColor} strokeWidth="1.5" strokeLinecap="round" />
      {/* Burun */}
      <path d={`M${cx-2},${cy+4} Q${cx},${cy+8} ${cx+2},${cy+4}`} fill="none" stroke={f.skin} strokeWidth="1.2" opacity="0.6" />
      {/* Ağız */}
      <path d={mouthPath} fill="none" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" />
      {/* Gözlük */}
      {f.hasGlasses && (
        <g stroke="#888" strokeWidth="1.2" fill="none">
          <rect x={cx-14} y={eyeY-5} width="10" height="9" rx="2.5" />
          <rect x={cx+4} y={eyeY-5} width="10" height="9" rx="2.5" />
          <line x1={cx-4} y1={eyeY} x2={cx+4} y2={eyeY} />
          <line x1={cx-14} y1={eyeY} x2={cx-17} y2={eyeY-1} />
          <line x1={cx+14} y1={eyeY} x2={cx+17} y2={eyeY-1} />
        </g>
      )}
      {/* Sakal */}
      {f.hasBeard && (
        <path d={`M${cx-12},${cy+8} Q${cx-14},${cy+18} ${cx-6},${cy+22} Q${cx},${cy+25} ${cx+6},${cy+22} Q${cx+14},${cy+18} ${cx+12},${cy+8}`}
          fill={f.hairColor} opacity="0.75" />
      )}
    </g>
  );
}

function HakimCostume({ cx, cy, skin }: { cx: number; cy: number; skin: string }) {
  return (
    <g>
      {/* Cüppe (siyah) */}
      <path d={`M${cx-28},${cy+28} L${cx-22},${cy+110} L${cx+22},${cy+110} L${cx+28},${cy+28}`} fill="#1a1a1a" />
      <path d={`M${cx-28},${cy+28} Q${cx-32},${cy+60} ${cx-30},${cy+110} L${cx-22},${cy+110} L${cx-22},${cy+28}`} fill="#111" />
      <path d={`M${cx+28},${cy+28} Q${cx+32},${cy+60} ${cx+30},${cy+110} L${cx+22},${cy+110} L${cx+22},${cy+28}`} fill="#111" />
      {/* Beyaz yaka (jabot) */}
      <path d={`M${cx-10},${cy+28} L${cx-6},${cy+52} L${cx},${cy+55} L${cx+6},${cy+52} L${cx+10},${cy+28}`} fill="white" opacity="0.9" />
      <path d={`M${cx-6},${cy+38} Q${cx},${cy+42} ${cx+6},${cy+38}`} fill="none" stroke="#ddd" strokeWidth="0.8" />
      <path d={`M${cx-5},${cy+46} Q${cx},${cy+50} ${cx+5},${cy+46}`} fill="none" stroke="#ddd" strokeWidth="0.8" />
      {/* Boyun */}
      <rect x={cx-7} y={cy+20} width="14" height="12" rx="3" fill={skin} />
      {/* Omuzlar */}
      <ellipse cx={cx-22} cy={cy+30} rx="10" ry="6" fill="#222" />
      <ellipse cx={cx+22} cy={cy+30} rx="10" ry="6" fill="#222" />
      {/* Tokmak (elde) */}
      <rect x={cx+18} y={cy+65} width="20" height="7" rx="3.5" fill="#8b5e3c" />
      <rect x={cx+25} y={cy+55} width="7" height="14" rx="2" fill="#6b4828" />
    </g>
  );
}

function AvukatCostume({ cx, cy, skin }: { cx: number; cy: number; skin: string }) {
  return (
    <g>
      {/* Ceket (lacivert) */}
      <path d={`M${cx-28},${cy+28} L${cx-22},${cy+110} L${cx+22},${cy+110} L${cx+28},${cy+28}`} fill="#1e2d4a" />
      {/* Sol yaka */}
      <path d={`M${cx-8},${cy+28} L${cx-20},${cy+50} L${cx-2},${cy+70} L${cx},${cy+28}`} fill="#25386b" />
      {/* Sağ yaka */}
      <path d={`M${cx+8},${cy+28} L${cx+20},${cy+50} L${cx+2},${cy+70} L${cx},${cy+28}`} fill="#25386b" />
      {/* Beyaz gömlek */}
      <rect x={cx-7} y={cy+28} width="14" height="55" fill="white" opacity="0.9" />
      {/* Kravat */}
      <path d={`M${cx-3},${cy+28} L${cx-4},${cy+65} L${cx},${cy+75} L${cx+4},${cy+65} L${cx+3},${cy+28}`} fill="#8b1a1a" />
      <path d={`M${cx-3},${cy+28} L${cx+3},${cy+28} L${cx+2},${cy+36} L${cx-2},${cy+36}`} fill="#6b1010" />
      {/* Boyun */}
      <rect x={cx-7} y={cy+20} width="14" height="12" rx="3" fill={skin} />
      {/* Omuzlar */}
      <ellipse cx={cx-22} cy={cy+30} rx="10" ry="6" fill="#1e2d4a" />
      <ellipse cx={cx+22} cy={cy+30} rx="10" ry="6" fill="#1e2d4a" />
      {/* Dosya (elde) */}
      <rect x={cx+14} y={cy+55} width="22" height="28" rx="2" fill="#e8d8a0" />
      <rect x={cx+16} y={cy+60} width="14" height="2" rx="1" fill="#888" opacity="0.6" />
      <rect x={cx+16} y={cy+65} width="10" height="2" rx="1" fill="#888" opacity="0.6" />
    </g>
  );
}

function SerbostCostume({ cx, cy, skin, variant }: { cx: number; cy: number; skin: string; variant: number }) {
  const clothes = [
    { top: "#2d5a27", type: "hoodie" },
    { top: "#8b1a1a", type: "tshirt" },
    { top: "#1a3a8b", type: "hoodie" },
    { top: "#4a4a4a", type: "jacket" },
    { top: "#2d4a6b", type: "tshirt" },
    { top: "#5a2d6b", type: "hoodie" },
    { top: "#6b5a1a", type: "jacket" },
    { top: "#1a6b5a", type: "tshirt" },
    { top: "#8b4a1a", type: "hoodie" },
    { top: "#3a3a6b", type: "jacket" },
  ];
  const c = clothes[variant % 10];

  return (
    <g>
      {c.type === "hoodie" && (
        <>
          <path d={`M${cx-28},${cy+28} L${cx-22},${cy+110} L${cx+22},${cy+110} L${cx+28},${cy+28}`} fill={c.top} />
          <path d={`M${cx-8},${cy+28} L${cx-4},${cy+80} L${cx+4},${cy+80} L${cx+8},${cy+28}`} fill={c.top} opacity="0.5" />
          {/* Kapüşon */}
          <path d={`M${cx-22},${cy+28} Q${cx-18},${cy+20} ${cx-8},${cy+24} L${cx},${cy+28} L${cx+8},${cy+24} Q${cx+18},${cy+20} ${cx+22},${cy+28}`} fill={c.top} opacity="0.8" />
          <rect x={cx-7} y={cy+20} width="14" height="12" rx="3" fill={skin} />
          <ellipse cx={cx-22} cy={cy+30} rx="10" ry="6" fill={c.top} opacity="0.9" />
          <ellipse cx={cx+22} cy={cy+30} rx="10" ry="6" fill={c.top} opacity="0.9" />
        </>
      )}
      {c.type === "tshirt" && (
        <>
          <path d={`M${cx-28},${cy+28} L${cx-22},${cy+110} L${cx+22},${cy+110} L${cx+28},${cy+28}`} fill={c.top} />
          <rect x={cx-7} y={cy+20} width="14" height="12" rx="3" fill={skin} />
          <ellipse cx={cx-22} cy={cy+30} rx="10" ry="6" fill={c.top} />
          <ellipse cx={cx+22} cy={cy+30} rx="10" ry="6" fill={c.top} />
        </>
      )}
      {c.type === "jacket" && (
        <>
          <path d={`M${cx-28},${cy+28} L${cx-22},${cy+110} L${cx+22},${cy+110} L${cx+28},${cy+28}`} fill={c.top} />
          <path d={`M${cx-8},${cy+28} L${cx-3},${cy+80} L${cx+3},${cy+80} L${cx+8},${cy+28}`} fill="#333" />
          {[cy+40,cy+55,cy+68].map(y => (
            <circle key={y} cx={cx} cy={y} r="2" fill="#666" />
          ))}
          <rect x={cx-7} y={cy+20} width="14" height="12" rx="3" fill={skin} />
          <ellipse cx={cx-22} cy={cy+30} rx="10" ry="6" fill={c.top} />
          <ellipse cx={cx+22} cy={cy+30} rx="10" ry="6" fill={c.top} />
        </>
      )}
    </g>
  );
}

export default function AvatarSVG({ rolGroup, variant, size = 100 }: Props) {
  const v = Math.abs(variant) % 10;
  const f = FACE_VARIANTS[v];
  const cx = 50, headCy = 42;

  return (
    <svg viewBox="0 0 100 130" width={size} height={size * 1.3} xmlns="http://www.w3.org/2000/svg">
      {/* Arka plan daire */}
      <circle cx={cx} cy={65} r="48" fill="#1a1929" opacity="0.6" />

      {/* Kostüm */}
      {rolGroup === "hakim" && <HakimCostume cx={cx} cy={headCy} skin={f.skin} />}
      {rolGroup === "avukat" && <AvukatCostume cx={cx} cy={headCy} skin={f.skin} />}
      {rolGroup === "serbest" && <SerbostCostume cx={cx} cy={headCy} skin={f.skin} variant={v} />}

      {/* Boyun */}
      <rect x={cx-7} y={headCy+20} width="14" height="10" rx="3" fill={f.skin} />

      {/* Kafa */}
      <ellipse cx={cx} cy={headCy} rx="20" ry="23" fill={f.skin} />

      {/* Saç */}
      <HairPath style={f.hairStyle} color={f.hairColor} cx={cx} cy={headCy} />

      {/* Yüz özellikleri */}
      <FaceFeatures variant={v} cx={cx} cy={headCy} />

      {/* Kulaklar */}
      <ellipse cx={cx-21} cy={headCy+2} rx="3.5" ry="5" fill={f.skin} />
      <ellipse cx={cx+21} cy={headCy+2} rx="3.5" ry="5" fill={f.skin} />
    </svg>
  );
}
