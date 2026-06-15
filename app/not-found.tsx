import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="text-5xl">⚖️</div>
      <h1 className="text-2xl font-bold" style={{ color: "var(--accent)" }}>404 — Dava Bulunamadı</h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Aradığın sayfa mahkeme kayıtlarında mevcut değil.
      </p>
      <Link href="/" className="btn-primary mt-2">Ana Sayfaya Dön</Link>
    </div>
  );
}
