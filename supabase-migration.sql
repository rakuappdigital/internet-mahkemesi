-- Mevcut odalar tablosuna yeni kolonlar ekle
alter table odalar add column if not exists aktif_rol text;
alter table odalar add column if not exists sonuc text;

-- UGC davalar tablosuna hakim_ipucu kolonu ekle
alter table ugc_davalar add column if not exists hakim_ipucu text;

-- Oyuncu profilleri tablosu (yeni)
create table if not exists oyuncu_profilleri (
  oyuncu_id text primary key,
  takma_ad text not null,
  toplam_oyun integer default 0,
  kazanilan integer default 0,
  kaybedilen integer default 0,
  en_cok_rol text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table oyuncu_profilleri enable row level security;

create policy "Herkes okuyabilir" on oyuncu_profilleri for select using (true);
create policy "Herkes yazabilir" on oyuncu_profilleri for insert with check (true);
create policy "Herkes guncelleyebilir" on oyuncu_profilleri for update using (true);

-- UGC için okuma politikasını güncelle (artık admin de görmeli)
drop policy if exists "Sadece onayli gorunur" on ugc_davalar;
create policy "Herkes okuyabilir" on ugc_davalar for select using (true);
create policy "Herkes guncelleyebilir" on ugc_davalar for update using (true);
