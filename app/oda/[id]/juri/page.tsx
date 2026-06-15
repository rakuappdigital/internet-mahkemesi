"use client";
import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Mesaj, Oyuncu, Oda, Dava } from "@/lib/types";
import davalarData from "@/data/davalar.json";

export default function JuriSayfasi({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [benim, setBenim] = useState<Oyuncu | null>(null);
  const [oda, setOda] = useState<Oda | null>(null);
  const [mesajlar, setMesajlar] = useState<Mesaj[]>([]);
  const [dava, setDava] = useState<Dava | null>(null);
  const [yeniMesaj, setYeniMesaj] = useState("");
  const [oyum, setOyum] = useState<"suclu" | "sucsuz" | "kararsiz" | null>(null);
  const altRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const kayitli = localStorage.getItem(`oyuncu-${id}`);
    if (!kayitli) { router.push(`/oda/${id}/lobi`); return; }
    const o = JSON.parse(kayitli) as Oyuncu;
    if (o.rol !== "juri") { router.push(`/oda/${id}/mahkeme`); return; }
    setBenim(o);

    supabase.from("odalar").select().eq("id", id).single().then(({ data }) => {
      setOda(data);
      if (data?.dava_id) {
        const d = (davalarData as Dava[]).find((x) => x.id === data.dava_id);
        if (d) setDava(d);
      }
    });

    supabase.from("mesajlar").select().eq("oda_id", id).eq("kanal", "juri").order("created_at").then(({ data }) => {
      if (data) setMesajlar(data);
    });

    const kanal = supabase.channel(`juri-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mesajlar", filter: `oda_id=eq.${id}` }, (payload) => {
        const m = payload.new as Mesaj;
        if (m.kanal === "juri") setMesajlar((prev) => [...prev, m]);
      })
      .subscribe();

    const odaKanal = supabase.channel(`oda-juri-${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "odalar", filter: `id=eq.${id}` }, (payload) => {
        setOda(payload.new as Oda);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(kanal);
      supabase.removeChannel(odaKanal);
    };
  }, [id, router]);

  useEffect(() => {
    altRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mesajlar]);

  async function mesajGonder() {
    if (!yeniMesaj.trim() || !benim) return;
    await supabase.from("mesajlar").insert({
      oda_id: id,
      oyuncu_id: benim.id,
      takma_ad: benim.takma_ad,
      rol: "juri",
      icerik: yeniMesaj.trim(),
      kanal: "juri",
      is_bot: false,
    });
    setYeniMesaj("");
  }

  async function oyVer(karar: "suclu" | "sucsuz" | "kararsiz") {
    if (!benim) return;
    setOyum(karar);
    await supabase.from("mesajlar").insert({
      oda_id: id,
      oyuncu_id: benim.id,
      takma_ad: benim.takma_ad,
      rol: "juri",
      icerik: `🗳️ Oyumu kullandım: ${karar === "suclu" ? "SUÇLU" : karar === "sucsuz" ? "SUÇSUZ" : "KARARSIZ"}`,
      kanal: "juri",
    });
  }

  const botMesajlari = mesajlar.filter((m) => m.is_bot);
  const insanMesajlari = mesajlar.filter((m) => !m.is_bot);

  if (!benim || !oda) return (
    <div className="min-h-screen flex items-center justify-center" style={{ color: "var(--muted)" }}>
      Yükleniyor...
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto">
      {/* Başlık */}
      <div className="card m-3 p-3 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span className="font-bold text-sm" style={{ color: "#52b788" }}>Jüri Odası</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--border)", color: "var(--muted)" }}>
              {oda.durum === "juri_tartisma" ? "🤫 Müzakere" : oda.durum === "karar" ? "🗳️ Oylama" : oda.durum}
            </span>
          </div>
          {dava && <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{dava.baslik}</p>}
        </div>
        <button className="btn-ghost text-xs" onClick={() => router.push(`/oda/${id}/mahkeme`)}>
          → Mahkeme
        </button>
      </div>

      {/* Bot aktivitesi göstergesi */}
      {oda.durum === "juri_tartisma" && botMesajlari.length < 15 && (
        <div className="mx-3 mb-2 text-xs px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: "var(--accent)11", color: "var(--muted)" }}>
          <span className="animate-pulse">🤖</span> AI Jüri üyeleri müzakere ediyor...
        </div>
      )}

      {/* Mesajlar */}
      <div className="flex-1 overflow-y-auto px-3 flex flex-col gap-2 pb-2" style={{ maxHeight: "calc(100vh - 250px)" }}>
        {mesajlar.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.oyuncu_id === benim.id ? "items-end" : "items-start"}`}>
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-xs font-semibold" style={{ color: m.is_bot ? "#a7a9be" : "#52b788" }}>
                {m.is_bot ? "🤖" : "👤"} {m.takma_ad}
              </span>
            </div>
            <div
              className="max-w-xs px-3 py-2 rounded-lg text-sm"
              style={{
                background: m.oyuncu_id === benim.id ? "#52b78822" : m.is_bot ? "var(--bg)" : "var(--surface)",
                border: `1px solid ${m.oyuncu_id === benim.id ? "#52b788" : m.is_bot ? "var(--border)" : "#52b78844"}`,
                opacity: m.is_bot ? 0.8 : 1,
              }}
            >
              {m.icerik}
            </div>
          </div>
        ))}
        <div ref={altRef} />
      </div>

      {/* Oylama (müzakere bittiyse) */}
      {(oda.durum === "karar" || botMesajlari.length >= 3) && !oyum && (
        <div className="mx-3 mb-2 card p-3 flex flex-col gap-2">
          <p className="text-sm font-semibold">🗳️ Oyunu Kullan</p>
          <div className="flex gap-2">
            <button onClick={() => oyVer("suclu")} className="flex-1 py-2 rounded-lg text-sm font-bold" style={{ background: "var(--suclu)22", color: "var(--suclu)", border: "1px solid var(--suclu)" }}>Suçlu</button>
            <button onClick={() => oyVer("sucsuz")} className="flex-1 py-2 rounded-lg text-sm font-bold" style={{ background: "var(--sucsuz)22", color: "var(--sucsuz)", border: "1px solid var(--sucsuz)" }}>Suçsuz</button>
            <button onClick={() => oyVer("kararsiz")} className="flex-1 py-2 rounded-lg text-sm font-bold" style={{ background: "var(--border)", color: "var(--muted)", border: "1px solid var(--border)" }}>Kararsız</button>
          </div>
        </div>
      )}

      {oyum && (
        <div className="mx-3 mb-2 text-center text-sm py-2" style={{ color: "var(--muted)" }}>
          ✅ Oyunu kullandın: <strong>{oyum === "suclu" ? "SUÇLU" : oyum === "sucsuz" ? "SUÇSUZ" : "KARARSIZ"}</strong>
        </div>
      )}

      {/* Mesaj giriş */}
      {oda.durum === "juri_tartisma" && (
        <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex gap-2">
            <input
              className="input text-sm flex-1"
              placeholder="Jüri olarak görüşünü paylaş..."
              value={yeniMesaj}
              onChange={(e) => setYeniMesaj(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), mesajGonder())}
            />
            <button className="btn-primary text-sm px-4" onClick={mesajGonder}>↵</button>
          </div>
        </div>
      )}
    </div>
  );
}
