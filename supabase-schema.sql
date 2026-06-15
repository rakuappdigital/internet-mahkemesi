-- Odalar tablosu
create table odalar (
  id uuid primary key default gen_random_uuid(),
  kod text unique not null,
  mod text not null check (mod in ('anlik', 'async')),
  durum text not null default 'lobi' check (durum in ('lobi', 'aktif', 'juri_tartisma', 'karar', 'bitti')),
  dava_id text,
  oyuncular jsonb default '[]',
  aktif_rol text,
  sonuc text,
  created_at timestamptz default now()
);

-- Mesajlar tablosu
create table mesajlar (
  id uuid primary key default gen_random_uuid(),
  oda_id uuid references odalar(id) on delete cascade,
  oyuncu_id text not null,
  takma_ad text not null,
  rol text not null,
  icerik text not null,
  kanal text not null check (kanal in ('mahkeme', 'juri')),
  is_bot boolean default false,
  created_at timestamptz default now()
);

-- UGC Davalar tablosu
create table ugc_davalar (
  id uuid primary key default gen_random_uuid(),
  baslik text not null,
  zorluk text not null check (zorluk in ('kolay', 'orta', 'zor')),
  kategori text,
  arka_plan text not null,
  davaci_ipucu text,
  davali_ipucu text,
  hakim_ipucu text,
  onaylandi boolean default false,
  created_at timestamptz default now()
);

-- Oyuncu profilleri
create table oyuncu_profilleri (
  oyuncu_id text primary key,
  takma_ad text not null,
  toplam_oyun integer default 0,
  kazanilan integer default 0,
  kaybedilen integer default 0,
  en_cok_rol text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Realtime
alter publication supabase_realtime add table odalar;
alter publication supabase_realtime add table mesajlar;

-- RLS
alter table odalar enable row level security;
alter table mesajlar enable row level security;
alter table ugc_davalar enable row level security;
alter table oyuncu_profilleri enable row level security;

create policy "Herkes okuyabilir" on odalar for select using (true);
create policy "Herkes yazabilir" on odalar for insert with check (true);
create policy "Herkes guncelleyebilir" on odalar for update using (true);

create policy "Herkes okuyabilir" on mesajlar for select using (true);
create policy "Herkes yazabilir" on mesajlar for insert with check (true);

create policy "Herkes gonderebilir" on ugc_davalar for insert with check (true);
create policy "Herkes okuyabilir" on ugc_davalar for select using (true);
create policy "Herkes guncelleyebilir" on ugc_davalar for update using (true);

create policy "Herkes okuyabilir" on oyuncu_profilleri for select using (true);
create policy "Herkes yazabilir" on oyuncu_profilleri for insert with check (true);
create policy "Herkes guncelleyebilir" on oyuncu_profilleri for update using (true);
