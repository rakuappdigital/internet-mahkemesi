"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Profil {
  oyuncu_id: string;
  takma_ad: string;
  toplam_oyun: number;
  kazanilan: number;
  kaybedilen: number;
  en_cok_rol: string;
}

const ROL_EMOJI: Record<string, string> = {
  hakim: "⚖️", davaci: "🗣️", davali: "🛡️",
  davaci_avukat: "📋", davali_avukat: "🔒", juri: "👥",
};

export default function LiderlikSayfasi() {
  const router = useRouter();
  const [profiller, setProfiller] = useState<Profil[]>([]);
  const [benim, setBenim] = useState<Profil | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    supabase
      .from("oyuncu_profilleri")
      .select()
      .order("toplam_oyun", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setProfiller(data ?? []);
        setYukleniyor(false);
      });

    // Kendi profilini bul
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("oyuncu-"));
    if (keys.length > 0) {
      const son = JSON.parse(localStorage.getItem(keys[keys.length - 1]) ?? "{}");
      if (son.id) {
        supabase.from("oyuncu_profilleri").select().eq("oyuncu_id", son.id).single().then(({ data }) => {
          if (data) setBenim(data);
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen max-w-lg mx-auto p-4 flex flex-col gap-5">
      <div className="flex items-center gap-3 pt-4">
        <button onClick={() => router.push("/")} className="text-sm" style={{ color: "var(--muted)" }}>← Geri</button>
        <h1 className="text-xl font-bold" style={{ color: "var(--accent)" }}>🏆 Liderlik Tablosu</h1>
      </div>

      {benim && (
        <div className="card p-4 border" style={{ borderColor: "var(--accent)" }}>
          <p className="text-xs mb-1" style={{ color: "var(--accent)" }}>Senin İstatistiklerin</p>
          <div className="flex items-center justify-between">
            <span className="font-bold">{benim.takma_ad}</span>
            <div className="flex gap-3 text-sm">
              <span>{benim.toplam_oyun} oyun</span>
              {benim.en_cok_rol && <span>{ROL_EMOJI[benim.en_cok_rol] ?? "🎭"} {benim.en_cok_rol}</span>}
            </div>
          </div>
        </div>
      )}

      {yukleniyor ? (
        <div className="text-center py-10" style={{ color: "var(--muted)" }}>Yükleniyor...</div>
      ) : profiller.length === 0 ? (
        <div className="text-center py-10" style={{ color: "var(--muted)" }}>
          Henüz kimse oynamadı. İlk sen ol!
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {profiller.map((p, i) => (
            <div key={p.oyuncu_id} className="card p-3 flex items-center gap-3">
              <span className="text-lg font-bold w-7 text-center" style={{ color: i < 3 ? "var(--accent)" : "var(--muted)" }}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{p.takma_ad}</p>
                {p.en_cok_rol && (
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {ROL_EMOJI[p.en_cok_rol] ?? "🎭"} En çok: {p.en_cok_rol}
                  </p>
                )}
              </div>
              <div className="text-sm text-right shrink-0" style={{ color: "var(--muted)" }}>
                <div>{p.toplam_oyun} oyun</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
