import { supabase } from "./supabase";
import type { Oda, Oyuncu, OdaModu, Rol } from "./types";

export function rastgeleKod(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function odaOlustur(mod: OdaModu): Promise<Oda> {
  const kod = rastgeleKod();
  const { data, error } = await supabase
    .from("odalar")
    .insert({ kod, mod, durum: "lobi", oyuncular: [] })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function odayaKatil(kod: string): Promise<Oda> {
  const { data, error } = await supabase
    .from("odalar")
    .select()
    .eq("kod", kod.toUpperCase())
    .single();
  if (error) throw new Error("Oda bulunamadı");
  return data;
}

export async function oyuncuEkle(oda_id: string, oyuncu: Oyuncu): Promise<void> {
  const { data: oda } = await supabase
    .from("odalar")
    .select("oyuncular")
    .eq("id", oda_id)
    .single();

  const guncel = [...(oda?.oyuncular ?? []), oyuncu];
  await supabase.from("odalar").update({ oyuncular: guncel }).eq("id", oda_id);
}

export async function davaAta(oda_id: string, dava_id: string): Promise<void> {
  await supabase.from("odalar").update({ dava_id }).eq("id", oda_id);
}

export async function odaDurumGuncelle(oda_id: string, durum: string): Promise<void> {
  await supabase.from("odalar").update({ durum }).eq("id", oda_id);
}

export function eksikJuriRolleri(oyuncular: Oyuncu[]): number[] {
  const mevcutJuriler = oyuncular
    .filter((o) => o.rol === "juri")
    .map((o) => o.juri_index ?? 0);
  return [1, 2, 3, 4, 5].filter((i) => !mevcutJuriler.includes(i));
}
