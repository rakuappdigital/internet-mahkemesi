export default function CourtBackground() {
  return (
    <svg
      viewBox="0 0 800 480"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1528" />
          <stop offset="100%" stopColor="#2a1f3d" />
        </linearGradient>
        <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5c3d1e" />
          <stop offset="100%" stopColor="#3d2710" />
        </linearGradient>
        <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a5230" />
          <stop offset="100%" stopColor="#4a3020" />
        </linearGradient>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1e14" />
          <stop offset="100%" stopColor="#1a1008" />
        </linearGradient>
        <linearGradient id="carpetGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a0a0a" />
          <stop offset="50%" stopColor="#6b1010" />
          <stop offset="100%" stopColor="#4a0a0a" />
        </linearGradient>
        <linearGradient id="windowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4e0f8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#7ab8e8" stopOpacity="0.08" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <pattern id="woodPattern" x="0" y="0" width="40" height="120" patternUnits="userSpaceOnUse">
          <rect width="40" height="120" fill="#4a3020" />
          <rect x="0" y="0" width="38" height="118" fill="#5c3d1e" />
          <line x1="0" y1="40" x2="40" y2="40" stroke="#3d2710" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="80" x2="40" y2="80" stroke="#3d2710" strokeWidth="1" opacity="0.5" />
          <line x1="20" y1="0" x2="20" y2="40" stroke="#6b4a28" strokeWidth="0.5" opacity="0.4" />
        </pattern>
      </defs>

      {/* === ARKA DUVAR === */}
      <rect x="0" y="0" width="800" height="480" fill="url(#wallGrad)" />

      {/* Duvar panelleri */}
      <rect x="0" y="0" width="800" height="260" fill="url(#woodPattern)" opacity="0.6" />
      <rect x="0" y="258" width="800" height="3" fill="#c4a827" opacity="0.4" />

      {/* Sol duvar paneli detayları */}
      {[0, 1, 2].map(i => (
        <g key={i}>
          <rect x={20 + i * 90} y="20" width="70" height="220" rx="2" fill="none" stroke="#c4a827" strokeWidth="0.8" opacity="0.25" />
          <rect x={26 + i * 90} y="26" width="58" height="208" rx="1" fill="none" stroke="#c4a827" strokeWidth="0.4" opacity="0.15" />
        </g>
      ))}

      {/* Sağ duvar paneli detayları */}
      {[0, 1, 2].map(i => (
        <g key={i}>
          <rect x={530 + i * 90} y="20" width="70" height="220" rx="2" fill="none" stroke="#c4a827" strokeWidth="0.8" opacity="0.25" />
          <rect x={536 + i * 90} y="26" width="58" height="208" rx="1" fill="none" stroke="#c4a827" strokeWidth="0.4" opacity="0.15" />
        </g>
      ))}

      {/* === PENCERELER === */}
      {/* Sol pencere */}
      <rect x="60" y="30" width="80" height="160" rx="4" fill="url(#windowGrad)" stroke="#c4a827" strokeWidth="1" opacity="0.6" />
      <rect x="63" y="33" width="74" height="154" rx="2" fill="#7ab8e8" opacity="0.06" />
      <line x1="100" y1="33" x2="100" y2="187" stroke="#c4a827" strokeWidth="0.8" opacity="0.3" />
      <line x1="63" y1="110" x2="137" y2="110" stroke="#c4a827" strokeWidth="0.8" opacity="0.3" />
      {/* Pencere ışığı */}
      <ellipse cx="100" cy="110" rx="35" ry="80" fill="#7ab8e8" opacity="0.04" />

      {/* Sağ pencere */}
      <rect x="660" y="30" width="80" height="160" rx="4" fill="url(#windowGrad)" stroke="#c4a827" strokeWidth="1" opacity="0.6" />
      <rect x="663" y="33" width="74" height="154" rx="2" fill="#7ab8e8" opacity="0.06" />
      <line x1="700" y1="33" x2="700" y2="187" stroke="#c4a827" strokeWidth="0.8" opacity="0.3" />
      <line x1="663" y1="110" x2="737" y2="110" stroke="#c4a827" strokeWidth="0.8" opacity="0.3" />
      <ellipse cx="700" cy="110" rx="35" ry="80" fill="#7ab8e8" opacity="0.04" />

      {/* === TERAZI (Adalet Sembolü) === */}
      <g transform="translate(400, 60)" filter="url(#glow)">
        {/* Terazi gövdesi */}
        <line x1="0" y1="0" x2="0" y2="80" stroke="#c4a827" strokeWidth="2.5" opacity="0.7" />
        <line x1="-60" y1="30" x2="60" y2="30" stroke="#c4a827" strokeWidth="2" opacity="0.7" />
        {/* Asma halat */}
        <line x1="-60" y1="30" x2="-60" y2="55" stroke="#c4a827" strokeWidth="1.2" opacity="0.6" />
        <line x1="60" y1="30" x2="60" y2="55" stroke="#c4a827" strokeWidth="1.2" opacity="0.6" />
        {/* Kefeler */}
        <ellipse cx="-60" cy="58" rx="22" ry="6" fill="none" stroke="#c4a827" strokeWidth="1.5" opacity="0.6" />
        <ellipse cx="60" cy="58" rx="22" ry="6" fill="none" stroke="#c4a827" strokeWidth="1.5" opacity="0.6" />
        {/* Üst top */}
        <circle cx="0" cy="0" r="5" fill="#c4a827" opacity="0.7" />
        {/* Alt taban */}
        <rect x="-15" y="80" width="30" height="5" rx="2" fill="#c4a827" opacity="0.6" />
      </g>

      {/* === HAKİM KÜRSÜsü === */}
      {/* Platform */}
      <rect x="280" y="155" width="240" height="18" rx="2" fill="#c4a827" opacity="0.5" />
      <rect x="270" y="173" width="260" height="100" rx="3" fill="url(#benchGrad)" />
      <rect x="272" y="175" width="256" height="96" rx="2" fill="#6b4a28" opacity="0.3" />
      {/* Kürsü ön panel detayı */}
      <rect x="290" y="185" width="90" height="75" rx="2" fill="none" stroke="#c4a827" strokeWidth="0.8" opacity="0.35" />
      <rect x="420" y="185" width="90" height="75" rx="2" fill="none" stroke="#c4a827" strokeWidth="0.8" opacity="0.35" />
      {/* Mikrofon */}
      <line x1="400" y1="172" x2="400" y2="155" stroke="#888" strokeWidth="1.5" opacity="0.6" />
      <circle cx="400" cy="152" r="5" fill="#666" opacity="0.7" />
      {/* Tokmak */}
      <rect x="455" y="176" width="35" height="10" rx="5" fill="#8b5e3c" opacity="0.8" />
      <rect x="468" y="168" width="9" height="12" rx="2" fill="#6b4828" opacity="0.8" />
      {/* "HAKİM" yazısı */}
      <text x="400" y="245" textAnchor="middle" fill="#c4a827" fontSize="11" opacity="0.5" fontFamily="serif" letterSpacing="3">HAKİM</text>

      {/* === ZEMİN === */}
      <rect x="0" y="280" width="800" height="200" fill="url(#floorGrad)" />
      {/* Halı */}
      <rect x="150" y="280" width="500" height="200" fill="url(#carpetGrad)" opacity="0.4" />
      {/* Halı bordürü */}
      <rect x="150" y="280" width="500" height="200" fill="none" stroke="#8b0a0a" strokeWidth="3" opacity="0.5" />
      <rect x="156" y="286" width="488" height="188" fill="none" stroke="#c4a827" strokeWidth="1" opacity="0.3" />

      {/* Zemin ızgara çizgileri (perspektif) */}
      {[0,1,2,3,4,5,6].map(i => (
        <line key={i} x1={0 + i * 115} y1="480" x2={250 + i * 50} y2="280" stroke="#c4a827" strokeWidth="0.3" opacity="0.08" />
      ))}
      {[280, 320, 360, 400, 440, 480].map(y => (
        <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#c4a827" strokeWidth="0.3" opacity="0.06" />
      ))}

      {/* === SOL MASA (Davacı/Avukat) === */}
      <rect x="80" y="310" width="220" height="12" rx="2" fill="url(#woodGrad)" />
      <rect x="85" y="322" width="210" height="70" rx="2" fill="#4a3020" opacity="0.8" />
      {/* Masa bacakları */}
      <rect x="90" y="392" width="12" height="40" rx="2" fill="#3d2710" opacity="0.7" />
      <rect x="278" y="392" width="12" height="40" rx="2" fill="#3d2710" opacity="0.7" />
      {/* Masa üzeri kağıtlar */}
      <rect x="100" y="298" width="40" height="12" rx="1" fill="#e8e0d0" opacity="0.4" />
      <rect x="148" y="300" width="30" height="10" rx="1" fill="#e8e0d0" opacity="0.3" />
      <text x="190" y="342" textAnchor="middle" fill="#c4a827" fontSize="8" opacity="0.4" fontFamily="serif" letterSpacing="2">DAVACI</text>

      {/* === SAĞ MASA (Davalı/Avukat) === */}
      <rect x="500" y="310" width="220" height="12" rx="2" fill="url(#woodGrad)" />
      <rect x="505" y="322" width="210" height="70" rx="2" fill="#4a3020" opacity="0.8" />
      <rect x="510" y="392" width="12" height="40" rx="2" fill="#3d2710" opacity="0.7" />
      <rect x="698" y="392" width="12" height="40" rx="2" fill="#3d2710" opacity="0.7" />
      <rect x="520" y="298" width="40" height="12" rx="1" fill="#e8e0d0" opacity="0.4" />
      <rect x="568" y="300" width="30" height="10" rx="1" fill="#e8e0d0" opacity="0.3" />
      <text x="610" y="342" textAnchor="middle" fill="#c4a827" fontSize="8" opacity="0.4" fontFamily="serif" letterSpacing="2">DAVALI</text>

      {/* === JÜRİ SIRASI (arka) === */}
      <rect x="155" y="420" width="490" height="8" rx="2" fill="#5c3d1e" opacity="0.6" />
      <rect x="155" y="428" width="490" height="50" rx="2" fill="#3d2710" opacity="0.5" />
      {/* Jüri koltukları */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <rect key={i} x={165 + i * 58} y="415" width="48" height="13" rx="2" fill="#5c3d1e" opacity="0.7" />
      ))}
      <text x="400" y="450" textAnchor="middle" fill="#c4a827" fontSize="8" opacity="0.35" fontFamily="serif" letterSpacing="2">JÜRİ</text>

      {/* === KÖŞE LAMBASI (sol) === */}
      <rect x="25" y="250" width="8" height="30" fill="#5c3d1e" opacity="0.7" />
      <ellipse cx="29" cy="250" rx="12" ry="8" fill="#c4a827" opacity="0.15" />
      <ellipse cx="29" cy="250" rx="6" ry="4" fill="#f0d060" opacity="0.2" />

      {/* === KÖŞE LAMBASI (sağ) === */}
      <rect x="767" y="250" width="8" height="30" fill="#5c3d1e" opacity="0.7" />
      <ellipse cx="771" cy="250" rx="12" ry="8" fill="#c4a827" opacity="0.15" />
      <ellipse cx="771" cy="250" rx="6" ry="4" fill="#f0d060" opacity="0.2" />

      {/* Genel kararma — derin his */}
      <rect x="0" y="0" width="800" height="480" fill="#0f0e17" opacity="0.45" />
    </svg>
  );
}
