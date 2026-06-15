"use client";
import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Oda, Mesaj, Oyuncu, Dava, JuriOyu, Rol } from "@/lib/types";
import davalarData from "@/data/davalar.json";
import CourtBackground from "@/components/CourtBackground";
import AvatarSVG from "@/components/avatars/AvatarSVG";
import GavelScene from "@/components/transitions/GavelScene";
import JuriScene from "@/components/transitions/JuriScene";
import KararScene from "@/components/transitions/KararScene";
import { rolToGroup } from "@/lib/avatarData";

const ROL_RENK: Record<string, string> = {
  davaci:        "#e05252",
  davali:        "#7c6fe0",
  hakim:         "#e8c547",
  davaci_avukat: "#f4845f",
  davali_avukat: "#9b72cf",
  juri:          "#52b788",
  izleyici:      "#a7a9be",
};

const ROL_LABEL: Record<string, string> = {
  davaci:        "Davacı",
  davali:        "Davalı",
  hakim:         "Hakim",
  davaci_avukat: "Davacı Avk.",
  davali_avukat: "Davalı Avk.",
  juri:          "Jüri",
  izleyici:      "İzleyici",
};

const TUR_SIRASI: Rol[] = ["davaci", "davaci_avukat", "davali", "davali_avukat", "hakim"];

export default function MahkemeSayfasi({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [oda, setOda] = useState<Oda | null>(null);
  const [benim, setBenim] = useState<Oyuncu | null>(null);
  const [mesajlar, setMesajlar] = useState<Mesaj[]>([]);
  const [yeniMesaj, setYeniMesaj] = useState("");
  const [dava, setDava] = useState<Dava | null>(null);
  const [juriOylari, setJuriOylari] = useState<JuriOyu[]>([]);
  const [hakimKarar, setHakimKarar] = useState("");
  const [gonderiyor, setGonderiyor] = useState(false);
  const [juriYukleniyor, setJuriYukleniyor] = useState(false);
  const [sahne, setSahne] = useState<"acilis" | "juri" | "karar" | null>("acilis");
  const [kararSonuc, setKararSonuc] = useState<"suclu" | "sucsuz" | "kararsiz">("sucsuz");
  const altRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const kayitli = localStorage.getItem(`oyuncu-${id}`);
    if (!kayitli) { router.push(`/oda/${id}/lobi`); return; }
    setBenim(JSON.parse(kayitli));

    supabase.from("odalar").select().eq("id", id).single().then(({ data }) => {
      setOda(data);
      if (data?.dava_id) {
        const d = (davalarData as Dava[]).find((x) => x.id === data.dava_id);
        if (d) setDava(d);
      }
      // Karar aşamasındaysa oyları çek
      if (data?.durum === "karar") fetchJuriOylari();
    });

    supabase.from("mesajlar").select().eq("oda_id", id).eq("kanal", "mahkeme").order("created_at").then(({ data }) => {
      if (data) setMesajlar(data);
    });

    const odaKanal = supabase.channel(`oda-mhk-${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "odalar", filter: `id=eq.${id}` }, (payload) => {
        setOda(payload.new as Oda);
        if (payload.new.durum === "karar") fetchJuriOylari();
      })
      .subscribe();

    const mesajKanal = supabase.channel(`mahkeme-msg-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mesajlar", filter: `oda_id=eq.${id}` }, (payload) => {
        const m = payload.new as Mesaj;
        if (m.kanal === "mahkeme") setMesajlar((prev) => [...prev, m]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(odaKanal);
      supabase.removeChannel(mesajKanal);
    };
  }, [id, router]);

  useEffect(() => {
    altRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mesajlar]);

  async function fetchJuriOylari() {
    const { data } = await supabase
      .from("mesajlar")
      .select()
      .eq("oda_id", id)
      .eq("kanal", "juri")
      .ilike("icerik", "🗳️%");
    if (data && data.length > 0) {
      // insan jüri oylarını parse et (bot oyları ayrı endpoint'ten gelir)
    }
  }

  async function mesajGonder() {
    if (!yeniMesaj.trim() || !benim || !oda || gonderiyor) return;
    setGonderiyor(true);

    await supabase.from("mesajlar").insert({
      oda_id: id,
      oyuncu_id: benim.id,
      takma_ad: benim.takma_ad,
      rol: benim.rol,
      icerik: yeniMesaj.trim(),
      kanal: "mahkeme",
    });
    setYeniMesaj("");

    // Söz sırasındaki bot varsa sadece o yanıt versin; yoksa tüm botlar
    const botOyuncular = oda.oyuncular?.filter(
      (o) => o.is_bot && ["davaci", "davali", "davaci_avukat", "davali_avukat"].includes(o.rol)
    ) ?? [];

    if (botOyuncular.length > 0 && dava) {
      const guncelMesajlar = await supabase
        .from("mesajlar").select().eq("oda_id", id).eq("kanal", "mahkeme").order("created_at");

      // Söz sırası: sadece bir sonraki rolden bot konuşsun
      const aktifRol = (oda as Oda & { aktif_rol?: string }).aktif_rol;
      const botlarKonusacak = aktifRol
        ? botOyuncular.filter((o) => o.rol === aktifRol)
        : botOyuncular;

      for (const bot of botlarKonusacak) {
        await fetch("/api/mahkeme-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oda_id: id, dava, mesajlar: guncelMesajlar.data ?? [], bot_rol: bot.rol }),
        });
      }
    }

    setGonderiyor(false);
  }

  async function sozVer(rol: Rol) {
    await supabase.from("odalar").update({ aktif_rol: rol }).eq("id", id);
  }

  async function sozuKaldir() {
    await supabase.from("odalar").update({ aktif_rol: null }).eq("id", id);
  }

  async function juriTartismasinaGec() {
    if (!dava) return;
    setSahne("juri");
    setJuriYukleniyor(true);
    await supabase.from("odalar").update({ durum: "juri_tartisma" }).eq("id", id);

    try {
      let juriMesajlar: Mesaj[] = [];
      for (let i = 0; i < 3; i++) {
        const res = await fetch("/api/juri-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oda_id: id, dava,
            mahkeme_mesajlari: mesajlar,
            juri_mesajlari: juriMesajlar,
            bot_index: i,
          }),
        });
        const { icerik } = await res.json();
        juriMesajlar = [...juriMesajlar, {
          id: `tmp-${i}`, oda_id: id, oyuncu_id: `bot-j${i+1}`,
          takma_ad: `Jüri-${i+1}`, rol: "juri", icerik,
          kanal: "juri", created_at: new Date().toISOString(), is_bot: true,
        }];
      }

      const oyRes = await fetch("/api/juri-oy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dava, mahkeme_mesajlari: mesajlar, juri_mesajlari: juriMesajlar }),
      });
      const { oylar } = await oyRes.json();
      setJuriOylari(oylar);
      await supabase.from("odalar").update({ durum: "karar" }).eq("id", id);
    } catch (e) {
      console.error("Jüri hatası:", e);
      await supabase.from("odalar").update({ durum: "karar" }).eq("id", id);
    } finally {
      setJuriYukleniyor(false);
    }
  }

  async function kararAcikla() {
    if (!hakimKarar.trim()) return;
    const suclu = juriOylari.filter((o) => o.karar === "suclu").length;
    const sucsuz = juriOylari.filter((o) => o.karar === "sucsuz").length;
    const kararsiz = juriOylari.filter((o) => o.karar === "kararsiz").length;
    const kararResult: "suclu" | "sucsuz" | "kararsiz" = suclu > sucsuz ? "suclu" : suclu < sucsuz ? "sucsuz" : "kararsiz";
    setKararSonuc(kararResult);
    setSahne("karar");
    const sonuc = suclu > sucsuz ? "SUÇLU" : suclu < sucsuz ? "SUÇSUZ" : "BERABERLİK";

    await supabase.from("mesajlar").insert({
      oda_id: id,
      oyuncu_id: "sistem",
      takma_ad: "⚖️ HAKİM KARARI",
      rol: "hakim",
      icerik: `━━━ KARAR: ${sonuc} ━━━\n\n${hakimKarar}\n\nJüri: ${suclu} Suçlu · ${sucsuz} Suçsuz · ${kararsiz} Kararsız`,
      kanal: "mahkeme",
    });

    // Profil istatistiklerini güncelle
    if (benim) {
      await supabase.from("oyuncu_profilleri").upsert({
        oyuncu_id: benim.id,
        takma_ad: benim.takma_ad,
        toplam_oyun: 1,
      }, { onConflict: "oyuncu_id", ignoreDuplicates: false });
    }

    await supabase.from("odalar").update({ durum: "bitti", sonuc }).eq("id", id);
  }

  const hakimBuBenim = benim?.rol === "hakim";
  const aktifRol = (oda as (Oda & { aktif_rol?: string }) | null)?.aktif_rol;
  const benimSiram = !aktifRol || aktifRol === benim?.rol;
  const konusabilir = benim?.rol !== "izleyici" && benim?.rol !== "juri" && oda?.durum === "aktif" && benimSiram;

  const durumEtiket: Record<string, string> = {
    aktif: "🔴 Aktif",
    juri_tartisma: "🔒 Jüri Müzakere",
    karar: "⚖️ Karar",
    bitti: "✅ Tamamlandı",
  };

  if (!oda || !benim) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ color: "var(--muted)" }}>
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto w-full relative">
      {/* Sahne geçişleri */}
      {sahne === "acilis" && <GavelScene label="Mahkeme Açılıyor" onDone={() => setSahne(null)} />}
      {sahne === "juri" && <JuriScene onDone={() => setSahne(null)} />}
      {sahne === "karar" && <KararScene karar={kararSonuc} onDone={() => setSahne(null)} />}

      {/* Mahkeme arkaplanı */}
      <div className="fixed inset-0 -z-10 overflow-hidden opacity-20 pointer-events-none">
        <CourtBackground />
      </div>

      {/* Başlık */}
      <div className="card m-2 sm:m-3 p-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm" style={{ color: "var(--accent)" }}>⚖️ Mahkeme</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--border)", color: "var(--muted)" }}>
              {durumEtiket[oda.durum] ?? oda.durum}
            </span>
            {aktifRol && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: ROL_RENK[aktifRol] + "22", color: ROL_RENK[aktifRol] }}>
                Söz: {ROL_LABEL[aktifRol]}
              </span>
            )}
          </div>
          {dava && <p className="text-xs mt-1 truncate" style={{ color: "var(--muted)" }}>{dava.baslik}</p>}
        </div>
        <div className="text-right text-xs shrink-0" style={{ color: "var(--muted)" }}>
          <div style={{ color: ROL_RENK[benim.rol] }}>{benim.takma_ad}</div>
          <div style={{ color: ROL_RENK[benim.rol] }}>{ROL_LABEL[benim.rol]}</div>
        </div>
      </div>

      {/* Dava özeti */}
      {dava && (
        <div className="mx-2 sm:mx-3 mb-2 p-3 rounded-lg text-xs" style={{ background: "var(--accent)11", borderLeft: "3px solid var(--accent)" }}>
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>Dava: </span>
          <span style={{ color: "var(--muted)" }}>{dava.arka_plan}</span>
          {benim.rol !== "izleyici" && benim.rol !== "juri" && (
            <div className="mt-1" style={{ color: "var(--text)" }}>
              <strong>İpucu: </strong>
              {benim.rol === "davaci" || benim.rol === "davaci_avukat" ? dava.davaci_ipucu
                : benim.rol === "davali" || benim.rol === "davali_avukat" ? dava.davali_ipucu
                : dava.hakim_ipucu}
            </div>
          )}
        </div>
      )}

      {/* Hakim: söz ver paneli */}
      {hakimBuBenim && oda.durum === "aktif" && (
        <div className="mx-2 sm:mx-3 mb-2 card p-2">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-xs mr-1" style={{ color: "var(--muted)" }}>Söz ver:</span>
            {TUR_SIRASI.map((rol) => (
              <button
                key={rol}
                onClick={() => aktifRol === rol ? sozuKaldir() : sozVer(rol)}
                className="text-xs px-2 py-1 rounded border transition-all"
                style={{
                  borderColor: aktifRol === rol ? ROL_RENK[rol] : "var(--border)",
                  color: aktifRol === rol ? ROL_RENK[rol] : "var(--muted)",
                  background: aktifRol === rol ? ROL_RENK[rol] + "15" : "transparent",
                }}
              >
                {ROL_LABEL[rol]}
              </button>
            ))}
            {aktifRol && (
              <button onClick={sozuKaldir} className="text-xs px-2 py-1 rounded border" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                × Serbest
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mesajlar */}
      <div
        className="flex-1 overflow-y-auto px-2 sm:px-3 flex flex-col gap-2 pb-2"
        style={{ maxHeight: "calc(100vh - 320px)" }}
      >
        {mesajlar.length === 0 && (
          <div className="text-center py-8 text-sm" style={{ color: "var(--muted)" }}>
            Henüz kimse konuşmadı. Davayı başlat!
          </div>
        )}
        {mesajlar.map((m) => {
          const sender = oda.oyuncular?.find((o) => o.id === m.oyuncu_id);
          const avatarVariant = sender?.avatar ?? 0;
          const isMine = m.oyuncu_id === benim.id;
          return (
            <div key={m.id} className={`flex gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
              <div className="flex-shrink-0 self-end">
                <AvatarSVG rolGroup={rolToGroup(m.rol)} variant={avatarVariant} size={36} />
              </div>
              <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: ROL_RENK[m.rol] }}>{m.takma_ad}</span>
                  <span className="text-xs opacity-50" style={{ color: "var(--muted)" }}>[{ROL_LABEL[m.rol] ?? m.rol}]</span>
                </div>
                <div
                  className="max-w-[80%] sm:max-w-xs px-3 py-2 rounded-lg text-sm whitespace-pre-wrap break-words"
                  style={{
                    background: isMine ? "var(--accent2)33" : "var(--surface)",
                    border: `1px solid ${isMine ? "var(--accent2)" : "var(--border)"}`,
                  }}
                >
                  {m.icerik}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={altRef} />
      </div>

      {/* Hakim: jüri müzakere butonu */}
      {hakimBuBenim && oda.durum === "aktif" && (
        <div className="mx-2 sm:mx-3 mb-2">
          <button
            className="btn-primary w-full text-sm"
            onClick={juriTartismasinaGec}
            disabled={juriYukleniyor}
          >
            {juriYukleniyor ? "⏳ Jüri müzakere ediyor..." : "🔒 Jüri Müzakeresini Başlat"}
          </button>
        </div>
      )}

      {/* Jüri müzakere yükleniyor göstergesi */}
      {oda.durum === "juri_tartisma" && (
        <div className="mx-2 sm:mx-3 mb-2 p-3 rounded-lg text-sm text-center" style={{ background: "var(--surface)", color: "var(--muted)" }}>
          <span className="animate-pulse">🔒</span> Jüri müzakere ediyor...
          {benim.rol === "juri" && (
            <button className="ml-2 underline text-xs" onClick={() => router.push(`/oda/${id}/juri`)}>
              Jüri odasına git
            </button>
          )}
        </div>
      )}

      {/* Hakim kararı paneli */}
      {hakimBuBenim && oda.durum === "karar" && (
        <div className="mx-2 sm:mx-3 mb-2 card p-3 flex flex-col gap-2">
          <p className="text-sm font-semibold">⚖️ Karar Zamanı</p>
          {juriOylari.length > 0 && (
            <div className="flex gap-3 text-sm">
              <span style={{ color: "var(--suclu)" }}>Suçlu: {juriOylari.filter((o) => o.karar === "suclu").length}</span>
              <span style={{ color: "var(--sucsuz)" }}>Suçsuz: {juriOylari.filter((o) => o.karar === "sucsuz").length}</span>
              <span style={{ color: "var(--muted)" }}>Kararsız: {juriOylari.filter((o) => o.karar === "kararsiz").length}</span>
            </div>
          )}
          <textarea
            className="input text-sm"
            rows={3}
            placeholder="Kararınızı açıklayın..."
            value={hakimKarar}
            onChange={(e) => setHakimKarar(e.target.value)}
          />
          <button className="btn-primary text-sm" onClick={kararAcikla} disabled={!hakimKarar.trim()}>
            ⚖️ Kararı Açıkla
          </button>
        </div>
      )}

      {/* Dava bitti */}
      {oda.durum === "bitti" && (
        <div className="mx-2 sm:mx-3 mb-2 text-center py-3 text-sm" style={{ color: "var(--sucsuz)" }}>
          ✅ Dava tamamlandı.
          <button className="ml-2 underline" onClick={() => router.push("/")}>Ana sayfa</button>
        </div>
      )}

      {/* Mesaj giriş */}
      {benim.rol !== "izleyici" && benim.rol !== "juri" && oda.durum === "aktif" && (
        <div className="p-2 sm:p-3 border-t" style={{ borderColor: "var(--border)" }}>
          {!benimSiram && (
            <p className="text-xs text-center mb-1" style={{ color: "var(--muted)" }}>
              Şu an söz <strong style={{ color: ROL_RENK[aktifRol!] }}>{ROL_LABEL[aktifRol!]}</strong>'da
            </p>
          )}
          <div className="flex gap-2">
            <input
              className="input text-sm flex-1"
              placeholder={konusabilir ? `${ROL_LABEL[benim.rol]} olarak konuş...` : "Söz sende değil..."}
              value={yeniMesaj}
              onChange={(e) => setYeniMesaj(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && konusabilir && (e.preventDefault(), mesajGonder())}
              disabled={!konusabilir || gonderiyor}
            />
            <button
              className="btn-primary text-sm px-4"
              onClick={mesajGonder}
              disabled={!konusabilir || gonderiyor || !yeniMesaj.trim()}
            >
              {gonderiyor ? "⏳" : "↵"}
            </button>
          </div>
        </div>
      )}

      {benim.rol === "juri" && oda.durum === "aktif" && (
        <div className="p-2 sm:p-3 border-t" style={{ borderColor: "var(--border)" }}>
          <button className="btn-ghost w-full text-sm" onClick={() => router.push(`/oda/${id}/juri`)}>
            🔒 Jüri Odasına Geç
          </button>
        </div>
      )}
    </div>
  );
}
