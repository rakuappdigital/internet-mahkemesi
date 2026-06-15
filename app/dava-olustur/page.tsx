"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DavaOlustur() {
  const router = useRouter();
  const [form, setForm] = useState({
    baslik: "",
    zorluk: "orta",
    kategori: "",
    arka_plan: "",
    davaci_ipucu: "",
    davali_ipucu: "",
  });
  const [yukleniyor, setYukleniyor] = useState(false);
  const [tamam, setTamam] = useState(false);

  function guncelle(alan: string, deger: string) {
    setForm((prev) => ({ ...prev, [alan]: deger }));
  }

  async function gonder() {
    if (!form.baslik.trim() || !form.arka_plan.trim()) return;
    setYukleniyor(true);
    const { error } = await supabase.from("ugc_davalar").insert({
      ...form,
      onaylandi: false,
    });
    setYukleniyor(false);
    if (!error) setTamam(true);
  }

  if (tamam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="text-4xl">✅</div>
        <h1 className="text-xl font-bold" style={{ color: "var(--accent)" }}>Dava Gönderildi!</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>Incelendikten sonra dava havuzuna eklenecek.</p>
        <button className="btn-primary" onClick={() => router.push("/")}>Ana Sayfaya Dön</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto p-6 gap-5 py-12">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--accent)" }}>Dava Gönder</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Kendi absürt davanı oluştur, toplulukla paylaş.</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">Dava Başlığı *</label>
        <input className="input" placeholder="Arkadaşım benim..." value={form.baslik} onChange={(e) => guncelle("baslik", e.target.value)} />
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-semibold">Zorluk</label>
          <select className="input" value={form.zorluk} onChange={(e) => guncelle("zorluk", e.target.value)}>
            <option value="kolay">Kolay</option>
            <option value="orta">Orta</option>
            <option value="zor">Zor</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-semibold">Kategori</label>
          <input className="input" placeholder="arkadaşlık, yemek..." value={form.kategori} onChange={(e) => guncelle("kategori", e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">Arka Plan / Olay Özeti *</label>
        <textarea className="input" rows={3} placeholder="Ne oldu? Kısaca açıkla..." value={form.arka_plan} onChange={(e) => guncelle("arka_plan", e.target.value)} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">Davacı İpucu</label>
        <input className="input" placeholder="Davacıya ne önerirsin?" value={form.davaci_ipucu} onChange={(e) => guncelle("davaci_ipucu", e.target.value)} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">Davalı İpucu</label>
        <input className="input" placeholder="Davalıya ne önerirsin?" value={form.davali_ipucu} onChange={(e) => guncelle("davali_ipucu", e.target.value)} />
      </div>

      <button className="btn-primary" onClick={gonder} disabled={yukleniyor || !form.baslik.trim() || !form.arka_plan.trim()}>
        {yukleniyor ? "Gönderiliyor..." : "Davayı Gönder →"}
      </button>

      <button className="btn-ghost" onClick={() => router.push("/")}>← Geri</button>
    </div>
  );
}
