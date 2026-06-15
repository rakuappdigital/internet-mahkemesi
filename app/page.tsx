"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Oyuncu, Rol } from "@/lib/types";
import { BOT_MAHKEME } from "@/lib/types";

export default function AnaSayfa() {
  const router = useRouter();
  const [mod, setMod] = useState<"anlik" | "async">("anlik");
  const [katilKod, setKatilKod] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [demoYukleniyor, setDemoYukleniyor] = useState(false);
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

  async function demoBaslat() {
    setDemoYukleniyor(true);
    setHata("");
    try {
      // Oda oluştur
      const res = await fetch("/api/oda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mod: "anlik" }),
      });
      const oda = await res.json();
      if (!res.ok) throw new Error(oda.error);

      // İlk davayı çek
      const { default: davalar } = await import("@/data/davalar.json");
      const dava = davalar[Math.floor(Math.random() * Math.min(5, davalar.length))];

      // Hakim (kullanıcı) + botlar
      const hakim: Oyuncu = { id: crypto.randomUUID(), takma_ad: "Sen (Hakim)", rol: "hakim", avatar: 0 };
      const botlar: Oyuncu[] = (["davaci", "davali", "davaci_avukat", "davali_avukat"] as Rol[]).map((rol) => {
        const b = BOT_MAHKEME[rol];
        return { id: b.id, takma_ad: b.takma_ad, rol, is_bot: true };
      });
      const juriBotlar: Oyuncu[] = [1, 2, 3].map((i) => ({
        id: `bot-j${i}`, takma_ad: `Jüri-${i} 🤖`, rol: "juri" as Rol, juri_index: i, is_bot: true,
      }));

      const { supabase } = await import("@/lib/supabase");
      await supabase.from("odalar").update({
        oyuncular: [hakim, ...botlar, ...juriBotlar],
        dava_id: dava.id,
        durum: "aktif",
      }).eq("id", oda.id);

      localStorage.setItem(`oyuncu-${oda.id}`, JSON.stringify(hakim));
      router.push(`/oda/${oda.id}/mahkeme`);
    } catch (e: unknown) {
      setHata(e instanceof Error ? e.message : "Demo başlatılamadı");
      setDemoYukleniyor(false);
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

      {/* Demo — tek tıkla başla */}
      <div className="w-full max-w-sm flex flex-col gap-2">
        <button
          className="btn-primary w-full py-4 text-base font-bold"
          onClick={demoBaslat}
          disabled={demoYukleniyor}
        >
          {demoYukleniyor ? "⏳ Başlatılıyor..." : "🧪 Hemen Dene — Tek Tıkla Başla"}
        </button>
        <p className="text-xs text-center" style={{ color: "var(--muted)" }}>
          Sen hakim ol, geri kalanı yapay zeka bots oynar. İsim gerekmez.
        </p>
      </div>

      <div className="flex items-center gap-3 w-full max-w-sm">
        <hr className="flex-1" style={{ borderColor: "var(--border)" }} />
        <span className="text-xs" style={{ color: "var(--muted)" }}>ya da</span>
        <hr className="flex-1" style={{ borderColor: "var(--border)" }} />
      </div>

      <div className="card p-6 w-full max-w-sm flex flex-col gap-4">
        <h2 className="font-bold text-lg">Arkadaşlarla Oyna</h2>

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
