import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { BOT_MAHKEME } from "@/lib/types";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { oda_id, dava, mesajlar, bot_rol } = await req.json();

  const botInfo = BOT_MAHKEME[bot_rol];
  if (!botInfo) return NextResponse.json({ error: "Geçersiz rol" }, { status: 400 });

  // Son 12 mesajı al — context'i kısa tut ama yeterli bilgi ver
  const sonMesajlar = mesajlar.slice(-12);
  const konusma = sonMesajlar
    .map((m: { takma_ad: string; rol: string; icerik: string }) => `[${m.takma_ad}]: ${m.icerik}`)
    .join("\n");

  const ipucu = dava[botInfo.ipucu_alan];

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 200,
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `Sen bir internet mahkemesinde rolün: ${botInfo.takma_ad}. ${botInfo.kisilik}

DAVA: ${dava.baslik}
ARKA PLAN: ${dava.arka_plan}
ROL İPUCU: ${ipucu}

Son konuşmalar:
${konusma || "(Henüz kimse konuşmadı — ilk sen konuş)"}

KURALLAR:
- Maksimum 2 cümle yaz
- Türkçe yaz, doğal konuş
- Son söylenen şeye doğrudan tepki ver
- Kendi rolüne ve kişiliğine sadık kal
- Tekrar etme, yeni bir şey söyle`,
      },
      { role: "user", content: "Söz sende." },
    ],
  });

  const icerik = response.choices[0]?.message?.content?.trim() ?? "(sessiz kaldı)";

  await supabase.from("mesajlar").insert({
    oda_id,
    oyuncu_id: botInfo.id,
    takma_ad: botInfo.takma_ad,
    rol: bot_rol,
    icerik,
    kanal: "mahkeme",
    is_bot: true,
  });

  return NextResponse.json({ icerik });
}
