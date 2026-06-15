"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Oda, Rol, Oyuncu, Dava } from "@/lib/types";
import { MAX_JURI, BOT_MAHKEME } from "@/lib/types";
import davalarData from "@/data/davalar.json";

const ROL_ETIKETLER: Record<Rol, { label: string; renk: string; aciklama: string }> = {
  davaci:        { label: "Davacı",          renk: "#e05252", aciklama: "Şikayetini anlat, argümanını sun." },
  davali:        { label: "Davalı",          renk: "#7c6fe0", aciklama: "Kendini savun, suçlamaları çür." },
  hakim:         { label: "Hakim",           renk: "#e8c547", aciklama: "Tarafları dinle, soru sor, kararı aç." },
  davaci_avukat: { label: "Davacı Avukatı", renk: "#f4845f", aciklama: "Davacıyı hukuki argümanlarla destekle." },
  davali_avukat: { label: "Davalı Avukatı", renk: "#9b72cf", aciklama: "Davalıyı savun, delilleri çür." },
  juri:          { label: "Jüri",            renk: "#52b788", aciklama: "Ayrı odada tartış, oy ver." },
  izleyici:      { label: "İzleyici",        renk: "#a7a9be", aciklama: "Sadece izle." },
};

const ROL_SIRASI: Rol[] = ["hakim", "davaci", "davaci_avukat", "davali", "davali_avukat", "juri", "izleyici"];
const TEKIL_ROLLER: Rol[] = ["davaci", "davali", "hakim", "davaci_avukat", "davali_avukat"];

export default function LobiSayfasi({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [oda, setOda] = useState<Oda | null>(null);
  const [takmaAd, setTakmaAd] = useState("");
  const [seciliRol, setSeciliRol] = useState<Rol | null>(null);
  const [seciliDava, setSeciliDava] = useState<Dava | null>(null);
  const [zorlukFiltre, setZorlukFiltre] = useState<string>("hepsi");
  const [benim, setBenim] = useState<Oyuncu | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    const kayitli = localStorage.getItem(`oyuncu-${id}`);
    if (kayitli) setBenim(JSON.parse(kayitli));

    supabase.from("odalar").select().eq("id", id).single().then(({ data }) => setOda(data));

    const kanal = supabase
      .channel(`oda-${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "odalar", filter: `id=eq.${id}` }, (payload) => {
        setOda(payload.new as Oda);
        if (payload.new.durum === "aktif") {
          const kayitliOyuncu = localStorage.getItem(`oyuncu-${id}`);
          if (kayitliOyuncu) {
            const o = JSON.parse(kayitliOyuncu) as Oyuncu;
            router.push(o.rol === "juri" ? `/oda/${id}/juri` : `/oda/${id}/mahkeme`);
          }
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(kanal); };
  }, [id, router]);

  const alinanRoller = oda?.oyuncular?.filter((o) => !o.is_bot).map((o) => o.rol) ?? [];
  const juriSayisi = oda?.oyuncular?.filter((o) => o.rol === "juri" && !o.is_bot).length ?? 0;
  const davaFiltreli = (davalarData as Dava[]).filter(
    (d) => zorlukFiltre === "hepsi" || d.zorluk === zorlukFiltre
  );

  async function katil() {
    if (!takmaAd.trim() || !seciliRol || !oda) return;
    if (seciliRol !== "izleyici" && !seciliDava && !oda.dava_id) return;
    setYukleniyor(true);

    const oyuncu: Oyuncu = {
      id: crypto.randomUUID(),
      takma_ad: takmaAd.trim(),
      rol: seciliRol,
      juri_index: seciliRol === "juri" ? juriSayisi + 1 : undefined,
    };

    const guncelOyuncular = [...(oda.oyuncular ?? []), oyuncu];
    await supabase.from("odalar").update({
      oyuncular: guncelOyuncular,
      ...(seciliDava && !oda.dava_id ? { dava_id: seciliDava.id } : {}),
    }).eq("id", id);

    localStorage.setItem(`oyuncu-${id}`, JSON.stringify(oyuncu));
    setBenim(oyuncu);
    setYukleniyor(false);
  }

  async function oyunuBaslat() {
    if (!oda || !benim) return;
    // Eksik rolleri botlarla doldur
    const mevcutRoller = oda.oyuncular.map((o) => o.rol);
    const botEkle: Oyuncu[] = [];

    (["davaci", "davali", "davaci_avukat", "davali_avukat"] as Rol[]).forEach((rol) => {
      if (!mevcutRoller.includes(rol)) {
        const botInfo = BOT_MAHKEME[rol];
        botEkle.push({ id: botInfo.id, takma_ad: botInfo.takma_ad, rol, is_bot: true });
      }
    });

    // Eksik jürileri bot olarak ekle
    for (let i = juriSayisi + 1; i <= MAX_JURI; i++) {
      botEkle.push({ id: `bot-j${i}`, takma_ad: `Jüri-${i} 🤖`, rol: "juri", juri_index: i, is_bot: true });
    }

    await supabase.from("odalar").update({
      oyuncular: [...oda.oyuncular, ...botEkle],
      durum: "aktif",
    }).eq("id", id);
  }

  async function demoBaslat() {
    if (!takmaAd.trim()) { alert("Önce takma adını gir"); return; }
    setYukleniyor(true);
    const dava = (davalarData as Dava[])[0];
    const hakim: Oyuncu = { id: crypto.randomUUID(), takma_ad: takmaAd.trim(), rol: "hakim" };
    const botlar: Oyuncu[] = (["davaci", "davali", "davaci_avukat", "davali_avukat"] as Rol[]).map((rol) => {
      const b = BOT_MAHKEME[rol];
      return { id: b.id, takma_ad: b.takma_ad, rol, is_bot: true };
    });
    const juriBot: Oyuncu[] = [1, 2, 3].map((i) => ({
      id: `bot-j${i}`, takma_ad: `Jüri-${i} 🤖`, rol: "juri" as Rol, juri_index: i, is_bot: true,
    }));

    await supabase.from("odalar").update({
      oyuncular: [hakim, ...botlar, ...juriBot],
      dava_id: dava.id,
      durum: "aktif",
    }).eq("id", id);
    localStorage.setItem(`oyuncu-${id}`, JSON.stringify(hakim));
    router.push(`/oda/${id}/mahkeme`);
  }

  const hakimBuBenim = benim?.rol === "hakim";
  const herkesHazir = alinanRoller.includes("hakim");

  if (!oda) return <div className="min-h-screen flex items-center justify-center" style={{ color: "var(--muted)" }}>Yükleniyor...</div>;

  if (benim) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-center">
          <div className="text-4xl mb-2">⚖️</div>
          <h1 className="text-xl font-bold" style={{ color: "var(--accent)" }}>Oda Bekleniyor</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Kod: <span className="font-bold tracking-widest">{oda.kod}</span>
          </p>
        </div>

        <div className="card p-5 w-full max-w-sm">
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--muted)" }}>Odadaki Oyuncular</p>
          <div className="flex flex-col gap-2">
            {ROL_SIRASI.filter((r) => r !== "izleyici").map((rol) => {
              if (rol === "juri") {
                return (
                  <div key="juri" className="flex items-center gap-2 text-sm">
                    <span className="rol-badge" style={{ background: "#52b78822", color: "#52b788" }}>Jüri</span>
                    <span>{juriSayisi}/{MAX_JURI} <span style={{ color: "var(--muted)" }}>(kalan botlarla dolar)</span></span>
                  </div>
                );
              }
              const oyuncu = oda.oyuncular?.find((o) => o.rol === rol && !o.is_bot);
              const { label, renk } = ROL_ETIKETLER[rol];
              return (
                <div key={rol} className="flex items-center gap-2 text-sm">
                  <span className="rol-badge" style={{ background: renk + "22", color: renk }}>{label}</span>
                  <span>{oyuncu ? oyuncu.takma_ad : <span style={{ color: "var(--muted)" }}>Bot (otomatik)</span>}</span>
                </div>
              );
            })}
          </div>
        </div>

        {hakimBuBenim && (
          <button className="btn-primary" onClick={oyunuBaslat} disabled={!herkesHazir}>
            Mahkemeyi Aç →
          </button>
        )}
        {!hakimBuBenim && (
          <p className="text-sm" style={{ color: "var(--muted)" }}>Hakim mahkemeyi açana kadar bekle.</p>
        )}

        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Paylaş: <strong>{typeof window !== "undefined" ? window.location.href : ""}</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto p-6 gap-6 py-12">
      <div className="text-center">
        <div className="text-4xl mb-2">⚖️</div>
        <h1 className="text-xl font-bold" style={{ color: "var(--accent)" }}>Odaya Katıl</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>Kod: <strong>{oda.kod}</strong> · {oda.mod === "anlik" ? "⚡ Anlık" : "🕐 Asenkron"}</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">Takma Adın</label>
        <input className="input" placeholder="Mahkemede nasıl anılmak istersin?" value={takmaAd} onChange={(e) => setTakmaAd(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold">Rolün</label>
        {ROL_SIRASI.map((rol) => {
          const info = ROL_ETIKETLER[rol];
          const dolu = TEKIL_ROLLER.includes(rol) && alinanRoller.includes(rol);
          const juriDolu = rol === "juri" && juriSayisi >= MAX_JURI;
          const disabled = dolu || juriDolu;
          return (
            <button
              key={rol}
              disabled={disabled}
              onClick={() => !disabled && setSeciliRol(rol)}
              className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                seciliRol === rol ? "border-current" : "border-[var(--border)]"
              } ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
              style={{ color: info.renk }}
            >
              <span className="rol-badge mt-0.5" style={{ background: info.renk + "22", color: info.renk, flexShrink: 0 }}>
                {info.label}
              </span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {info.aciklama}{dolu ? " — Dolu" : ""}
              </span>
            </button>
          );
        })}
      </div>

      {seciliRol && seciliRol !== "izleyici" && !oda.dava_id && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Dava Seç</label>
          <div className="flex gap-2 mb-1">
            {["hepsi", "kolay", "orta", "zor"].map((z) => (
              <button key={z} onClick={() => setZorlukFiltre(z)}
                className={`text-xs px-2 py-1 rounded border transition-all ${zorlukFiltre === z ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--muted)]"}`}>
                {z}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {davaFiltreli.map((dava) => (
              <button key={dava.id} onClick={() => setSeciliDava(dava)}
                className={`p-3 rounded-lg border text-left text-sm transition-all ${
                  seciliDava?.id === dava.id ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-[var(--border)]"
                }`}>
                <span className="font-medium">{dava.baslik}</span>
                <span className="ml-2 text-xs opacity-60">[{dava.zorluk}]</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {oda.dava_id && (
        <div className="card p-3">
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>Seçili Dava</p>
          <p className="text-sm">{(davalarData as Dava[]).find((d) => d.id === oda.dava_id)?.baslik}</p>
        </div>
      )}

      <button className="btn-primary w-full" onClick={katil}
        disabled={yukleniyor || !takmaAd.trim() || !seciliRol || (!oda.dava_id && seciliRol !== "izleyici" && !seciliDava)}>
        {yukleniyor ? "Katılınıyor..." : "Katıl →"}
      </button>

    </div>
  );
}
