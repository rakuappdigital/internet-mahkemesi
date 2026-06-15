export type Rol = "davaci" | "davali" | "hakim" | "davaci_avukat" | "davali_avukat" | "juri" | "izleyici";
export type OdaModu = "anlik" | "async";
export type OdaDurumu = "lobi" | "aktif" | "juri_tartisma" | "karar" | "bitti";
export type Zorluk = "kolay" | "orta" | "zor";

export interface Dava {
  id: string;
  baslik: string;
  zorluk: Zorluk;
  kategori: string;
  arka_plan: string;
  davaci_ipucu: string;
  davali_ipucu: string;
  hakim_ipucu: string;
}

export interface Oyuncu {
  id: string;
  takma_ad: string;
  rol: Rol;
  juri_index?: number; // 1-3
  is_bot?: boolean;
  avatar?: number; // 0-9 face variant index
}

export interface Mesaj {
  id: string;
  oda_id: string;
  oyuncu_id: string;
  takma_ad: string;
  rol: Rol;
  icerik: string;
  kanal: "mahkeme" | "juri";
  created_at: string;
  is_bot?: boolean;
}

export interface Oda {
  id: string;
  kod: string;
  mod: OdaModu;
  durum: OdaDurumu;
  dava_id: string | null;
  dava?: Dava;
  oyuncular: Oyuncu[];
  created_at: string;
}

export interface JuriOyu {
  oyuncu_id: string;
  karar: "suclu" | "sucsuz" | "kararsiz";
  is_bot?: boolean;
}

export interface Karar {
  juri_oylar: JuriOyu[];
  hakim_aciklama: string;
  sonuc: "suclu" | "sucsuz" | "beraberlik";
}

export const MAX_JURI = 3;

export const BOT_JURILERI = [
  { id: "bot-j1", takma_ad: "Jüri-1 (Mantıkçı)", kisilik: "Katı bir mantıkçısın. Sadece somut delillere ve mantıksal argümanlara önem verirsin. Duygusal ifadelerden etkilenmezsin. Kısa ve keskin konuşursun." },
  { id: "bot-j2", takma_ad: "Jüri-2 (Şüpheci)", kisilik: "Her şeyi sorgularsın. Her iki tarafın da bir şeyler sakladığını düşünürsün. Biraz paranoyak ama zekisindir." },
  { id: "bot-j3", takma_ad: "Jüri-3 (Dengeleyici)", kisilik: "Her zaman dengeli ve tarafsız kalmaya çalışırsın. Her iki tarafın haklı yanlarını görürsün. Jürinin özetini çıkarmaya çalışırsın." },
];

export const BOT_MAHKEME: Record<string, { id: string; takma_ad: string; kisilik: string; ipucu_alan: "davaci_ipucu" | "davali_ipucu" }> = {
  davaci: {
    id: "bot-davaci",
    takma_ad: "Davacı 🤖",
    kisilik: "Sen bu davayı açan tarafsın. Şikayetini savun, argümanlarını güçlü sun. Duygusal olabilirsin ama abartma.",
    ipucu_alan: "davaci_ipucu",
  },
  davali: {
    id: "bot-davali",
    takma_ad: "Davalı 🤖",
    kisilik: "Sen suçlanan tarafsın. Kendini savun, suçlamaları çür. Mantıklı ve sakin kal ama kararlı ol.",
    ipucu_alan: "davali_ipucu",
  },
  davaci_avukat: {
    id: "bot-davaci-avukat",
    takma_ad: "Davacı Avukatı 🤖",
    kisilik: "Davacının avukatısın. Müvekkilini en güçlü hukuki argümanlarla savun. Profesyonel, ikna edici ve stratejik konuş.",
    ipucu_alan: "davaci_ipucu",
  },
  davali_avukat: {
    id: "bot-davali-avukat",
    takma_ad: "Davalı Avukatı 🤖",
    kisilik: "Davalının avukatısın. Müvekkilini savun, delilleri çür, şüphe oluştur. Soğukkanlı ve keskin bir hukuki dil kullan.",
    ipucu_alan: "davali_ipucu",
  },
};
