export default function RakuFooter() {
  return (
    <footer
      className="w-full flex items-center justify-center py-4 gap-2 select-none"
      style={{ borderTop: "1px solid var(--border)", opacity: 0.55 }}
    >
      {/* RAKU logosu — SVG ile yeniden çizildi, arkaplan yok */}
      <svg
        viewBox="0 0 110 36"
        width="66"
        height="21"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="RAKU"
      >
        {/* R */}
        <text x="0" y="28" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="32"
          fontWeight="300" letterSpacing="-1" fill="currentColor">R</text>
        {/* A — teal üçgen (sadece stroke, iç dolu değil) */}
        <polygon
          points="28,4 38,28 18,28"
          fill="none"
          stroke="#3a9e8a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* · küçük diamond */}
        <rect x="42" y="14" width="5" height="5" fill="currentColor"
          transform="rotate(45 44.5 16.5)" />
        {/* K */}
        <text x="50" y="28" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="32"
          fontWeight="300" letterSpacing="-1" fill="currentColor">K</text>
        {/* U */}
        <text x="73" y="28" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="32"
          fontWeight="300" letterSpacing="-1" fill="currentColor">U</text>
      </svg>

      <span className="text-xs" style={{ color: "var(--muted)" }}>
        © {new Date().getFullYear()} rakuapp
      </span>
    </footer>
  );
}
