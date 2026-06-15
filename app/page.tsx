"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnaSayfa() {
  const router = useRouter();
  const [mod, setMod] = useState<"anlik" | "async">("anlik");
  const [katilKod, setKatilKod] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

  async function odaOlustur() {
    setYukleniyor(true);
    setHata("");
    try {
      const res = await fetch("/api/oda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mod }),
      });
      const oda = await res.json();
      if (!res.ok) throw new Error(oda.error);
      router.push(`/oda/${oda.id}/lobi`);
    } catch (e: unknown) {
      setHata(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setYukleniyor(false);
    }
  }

  async function odayaKatil() {
    if (!katilKod.trim()) return;
    setYukleniyor(true);
    setHata("");
    try {
      const res = await fetch(`/api/oda?kod=${katilKod.trim()}`);
      const oda = await res.json();
      if (!res.ok) throw new Error(oda.error);
      router.push(`/oda/${oda.id}/lobi`);
    } catch (e: unknown) {
      setHata(e instanceof Error ? e.message : "Oda bulunamadı");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-8">
      <div className="text-center">
        <div className="text-5xl mb-3">⚖️</div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--accent)" }}>
          Judge Me or Not
        </h1>
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          Absürt davaları yargıla. Avukat ol. Karar ver.
        </p>
      </div>

      <div className="card p-6 w-full max-w-sm flex flex-col gap-4">
        <h2 className="font-bold text-lg">Yeni Oda Oluştur</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setMod("anlik")}
            className={`flex-1 py-2 rounded-md text-sm font-semibold border transition-all ${
              mod === "anlik"
                ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10"
                : "border-[var(--border)] text-[var(--muted)]"
            }`}
          >
            ⚡ Anlık
          </button>
          <button
            onClick={() => setMod("async")}
            className={`flex-1 py-2 rounded-md text-sm font-semibold border transition-all ${
              mod === "async"
                ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10"
                : "border-[var(--border)] text-[var(--muted)]"
            }`}
          >
            🕐 Asenkron
          </button>
        </div>

        <div className="text-xs" style={{ color: "var(--muted)" }}>
          {mod === "anlik"
            ? "Herkes aynı anda online oynar. Gerçek zamanlı tartışma."
            : "Mesajlarını bırak, arkadaşların kendi zamanında cevaplar."}
        </div>

        <button className="btn-primary" onClick={odaOlustur} disabled={yukleniyor}>
          {yukleniyor ? "Oluşturuluyor..." : "Oda Oluştur →"}
        </button>
      </div>

      <div className="card p-6 w-full max-w-sm flex flex-col gap-3">
        <h2 className="font-bold text-lg">Odaya Katıl</h2>
        <input
          className="input uppercase tracking-widest"
          placeholder="ODA KODU (6 harf)"
          value={katilKod}
          onChange={(e) => setKatilKod(e.target.value.toUpperCase())}
          maxLength={6}
          onKeyDown={(e) => e.key === "Enter" && odayaKatil()}
        />
        <button className="btn-ghost" onClick={odayaKatil} disabled={yukleniyor || !katilKod.trim()}>
          Katıl
        </button>
      </div>

      {hata && (
        <p className="text-sm" style={{ color: "var(--suclu)" }}>
          {hata}
        </p>
      )}

      <div className="flex gap-4 text-sm">
        <a href="/dava-olustur" className="underline" style={{ color: "var(--muted)" }}>+ Dava Gönder</a>
        <a href="/liderlik" className="underline" style={{ color: "var(--muted)" }}>🏆 Liderlik</a>
        <a href="/admin" className="underline" style={{ color: "var(--muted)" }}>⚙️ Admin</a>
      </div>
    </div>
  );
}
