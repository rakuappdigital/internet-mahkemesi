import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { BOT_JURILERI } from "@/lib/types";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { dava, mahkeme_mesajlari, juri_mesajlari } = await req.json();

  const mahkemeOzet = mahkeme_mesajlari.slice(-15)
    .map((m: { takma_ad: string; rol: string; icerik: string }) => `[${m.takma_ad} (${m.rol})]: ${m.icerik}`)
    .join("\n");

  const juriTartisma = juri_mesajlari
    .map((m: { takma_ad: string; icerik: string }) => `[${m.takma_ad}]: ${m.icerik}`)
    .join("\n");

  const oylar = await Promise.all(
    BOT_JURILERI.map(async (bot) => {
      const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        max_tokens: 50,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: `Sen bir jüri üyesisin. ${bot.kisilik}

DAVA: ${dava.baslik}
ARKA PLAN: ${dava.arka_plan}

Mahkemede olanlar:
${mahkemeOzet}

Jüri tartışması:
${juriTartisma}

Kendi kişiliğine göre karar ver. Sadece şu formatı kullan:
KARAR: suclu
veya
KARAR: sucsuz
veya
KARAR: kararsiz`,
          },
          { role: "user", content: "Kararın nedir?" },
        ],
      });

      const yanit = response.choices[0]?.message?.content ?? "";
      const match = yanit.match(/KARAR:\s*(suclu|sucsuz|kararsiz)/i);
      const karar = match ? match[1].toLowerCase() : "kararsiz";

      return { oyuncu_id: bot.id, takma_ad: bot.takma_ad, karar, is_bot: true };
    })
  );

  return NextResponse.json({ oylar });
}
