import Image from "next/image";

export default function RakuFooter() {
  return (
    <footer
      className="w-full flex items-center justify-between gap-4 px-6 py-4 flex-wrap"
      style={{ borderTop: "1px solid var(--border)", opacity: 0.55 }}
    >
      {/* Sol: Logo + copyright */}
      <div className="flex items-center gap-2">
        <Image src="/raku-logo.png" alt="RAKU" width={56} height={18} style={{ objectFit: "contain" }} />
        <span className="text-xs" style={{ color: "var(--muted)" }}>© {new Date().getFullYear()} rakuapp</span>
      </div>

      {/* Sağ: Diğer uygulamalar */}
      <div className="flex flex-col gap-1 text-right">
        <span className="text-xs font-semibold mb-0.5" style={{ color: "var(--muted)" }}>Diğer Uygulamalarımız</span>
        <a href="https://dk26simule.vercel.app" target="_blank" rel="noopener noreferrer"
          className="text-xs hover:underline" style={{ color: "var(--muted)" }}>
          Dünya Kupası Simülatörü
        </a>
        <a href="https://paginapasaj.vercel.app" target="_blank" rel="noopener noreferrer"
          className="text-xs hover:underline" style={{ color: "var(--muted)" }}>
          Günlük Kitap Pasajı
        </a>
        <a href="https://biroluruz.vercel.app" target="_blank" rel="noopener noreferrer"
          className="text-xs hover:underline" style={{ color: "var(--muted)" }}>
          WC2026 Tahmin Oyunu
        </a>
      </div>
    </footer>
  );
}
