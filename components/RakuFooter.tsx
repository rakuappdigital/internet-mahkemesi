import Image from "next/image";

const UYGULAMALAR = [
  { href: "https://dk26simule.vercel.app",  label: "Dünya Kupası Simülatörü" },
  { href: "https://paginapasaj.vercel.app", label: "Günlük Kitap Pasajı" },
  { href: "https://biroluruz.vercel.app",   label: "WC2026 Tahmin Oyunu" },
];

export default function RakuFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)" }}>
      {/* Diğer uygulamalar bandı */}
      <div className="w-full flex flex-col items-center gap-3 py-5 px-6"
        style={{ borderBottom: "1px solid var(--border)" }}>
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--muted)" }}>
          Diğer Uygulamalarımız
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {UYGULAMALAR.map(({ href, label }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium transition-opacity hover:opacity-100"
              style={{ color: "var(--accent)", opacity: 0.75 }}>
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Alt bar: logo + copyright */}
      <div className="flex items-center justify-between px-6 py-3" style={{ opacity: 0.45 }}>
        <div className="flex items-center gap-2">
          <Image src="/raku-logo.png" alt="RAKU" width={50} height={16} style={{ objectFit: "contain" }} />
          <span className="text-xs" style={{ color: "var(--muted)" }}>© {new Date().getFullYear()} rakuapp</span>
        </div>
      </div>
    </footer>
  );
}
