import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { BOT_JURILERI } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { oda_id, dava, mahkeme_mesajlari, juri_mesajlari, bot_index } = await req.json();

  const bot = BOT_JURILERI[bot_index];
  if (!bot) return NextResponse.json({ error: "Bot bulunamadı" }, { status: 400 });

  const mahkemeOzet = mahkeme_mesajlari.slice(-10)
    .map((m: { takma_ad: string; rol: string; icerik: string }) => `[${m.takma_ad} (${m.rol})]: ${m.icerik}`)
    .join("\n");

  const juriOzet = juri_mesajlari.slice(-8)
    .map((m: { takma_ad: string; icerik: string }) => `[${m.takma_ad}]: ${m.icerik}`)
    .join("\n");

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 180,
    temperature: 0.8,
    messages: [
      {
        role: "system",
        content: `Sen bir internet mahkemesinde jüri üyesisin. ${bot.kisilik}

DAVA: ${dava.baslik}
ARKA PLAN: ${dava.arka_plan}

Mahkemede söylenenler:
${mahkemeOzet || "(Henüz argüman sunulmadı)"}

Jüri odasındaki önceki konuşmalar:
${juriOzet || "(İlk konuşmayı sen başlatıyorsun)"}

KURALLAR:
- 1-2 cümle yaz, kısa tut
- Kendi kişiliğine uygun davran
- Diğer jüri üyelerine doğrudan tepki ver
- Mahkemede dinlediklerini yorumla
- Türkçe yaz`,
      },
      { role: "user", content: "Görüşün?" },
    ],
  });

  const icerik = response.choices[0]?.message?.content?.trim() ?? "(sessiz kaldı)";

  await supabase.from("mesajlar").insert({
    oda_id,
    oyuncu_id: bot.id,
    takma_ad: bot.takma_ad,
    rol: "juri",
    icerik,
    kanal: "juri",
    is_bot: true,
  });

  return NextResponse.json({ icerik });
}
