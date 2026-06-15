"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface UGCDava {
  id: string;
  baslik: string;
  zorluk: string;
  kategori: string;
  arka_plan: string;
  davaci_ipucu: string;
  davali_ipucu: string;
  onaylandi: boolean;
  created_at: string;
}

const ADMIN_SIFRE = "mahkeme2026";

export default function AdminSayfasi() {
  const router = useRouter();
  const [girisYapildi, setGirisYapildi] = useState(false);
  const [sifre, setSifre] = useState("");
  const [davalar, setDavalar] = useState<UGCDava[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [aktifSekme, setAktifSekme] = useState<"bekleyen" | "onaylanan">("bekleyen");

  function girisYap() {
    if (sifre === ADMIN_SIFRE) {
      setGirisYapildi(true);
      yukle();
    } else {
      alert("Yanlış şifre");
    }
  }

  async function yukle() {
    setYukleniyor(true);
    const { data } = await supabase
      .from("ugc_davalar")
      .select()
      .order("created_at", { ascending: false });
    setDavalar(data ?? []);
    setYukleniyor(false);
  }

  async function onayla(id: string) {
    await supabase.from("ugc_davalar").update({ onaylandi: true }).eq("id", id);
    setDavalar((prev) => prev.map((d) => d.id === id ? { ...d, onaylandi: true } : d));
  }

  async function reddet(id: string) {
    await supabase.from("ugc_davalar").delete().eq("id", id);
    setDavalar((prev) => prev.filter((d) => d.id !== id));
  }

  const gosterilenler = davalar.filter((d) => aktifSekme === "bekleyen" ? !d.onaylandi : d.onaylandi);

  if (!girisYapildi) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card p-6 w-full max-w-sm flex flex-col gap-4">
          <h1 className="font-bold text-lg" style={{ color: "var(--accent)" }}>⚖️ Admin Paneli</h1>
          <input
            className="input"
            type="password"
            placeholder="Şifre"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && girisYap()}
          />
          <button className="btn-primary" onClick={girisYap}>Giriş</button>
          <button className="btn-ghost text-sm" onClick={() => router.push("/")}>← Geri</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between pt-4">
        <h1 className="text-xl font-bold" style={{ color: "var(--accent)" }}>⚖️ Admin — Dava Moderasyonu</h1>
        <button onClick={() => router.push("/")} className="text-sm" style={{ color: "var(--muted)" }}>← Geri</button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setAktifSekme("bekleyen")}
          className={`px-3 py-1.5 rounded text-sm font-semibold border transition-all ${aktifSekme === "bekleyen" ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--muted)]"}`}
        >
          Bekleyen ({davalar.filter((d) => !d.onaylandi).length})
        </button>
        <button
          onClick={() => setAktifSekme("onaylanan")}
          className={`px-3 py-1.5 rounded text-sm font-semibold border transition-all ${aktifSekme === "onaylanan" ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--muted)]"}`}
        >
          Onaylanan ({davalar.filter((d) => d.onaylandi).length})
        </button>
      </div>

      {yukleniyor ? (
        <div className="text-center py-10" style={{ color: "var(--muted)" }}>Yükleniyor...</div>
      ) : gosterilenler.length === 0 ? (
        <div className="text-center py-10" style={{ color: "var(--muted)" }}>
          {aktifSekme === "bekleyen" ? "Bekleyen dava yok 🎉" : "Onaylanan dava yok"}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {gosterilenler.map((dava) => (
            <div key={dava.id} className="card p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm">{dava.baslik}</p>
                <span className="text-xs shrink-0 px-2 py-0.5 rounded" style={{ background: "var(--border)", color: "var(--muted)" }}>
                  {dava.zorluk} · {dava.kategori}
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--muted)" }}>{dava.arka_plan}</p>
              {dava.davaci_ipucu && <p className="text-xs" style={{ color: "var(--muted)" }}>🗣️ {dava.davaci_ipucu}</p>}
              {dava.davali_ipucu && <p className="text-xs" style={{ color: "var(--muted)" }}>🛡️ {dava.davali_ipucu}</p>}
              <p className="text-xs" style={{ color: "var(--muted)" }}>{new Date(dava.created_at).toLocaleDateString("tr-TR")}</p>
              {!dava.onaylandi && (
                <div className="flex gap-2 mt-1">
                  <button className="btn-primary text-xs flex-1" onClick={() => onayla(dava.id)}>✓ Onayla</button>
                  <button className="btn-ghost text-xs flex-1" onClick={() => reddet(dava.id)}>✗ Reddet</button>
                </div>
              )}
              {dava.onaylandi && (
                <div className="flex gap-2 mt-1">
                  <span className="text-xs" style={{ color: "var(--sucsuz)" }}>✓ Onaylandı</span>
                  <button className="text-xs underline ml-auto" style={{ color: "var(--suclu)" }} onClick={() => reddet(dava.id)}>Kaldır</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
