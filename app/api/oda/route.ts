import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { rastgeleKod } from "@/lib/oda";

export async function POST(req: NextRequest) {
  const { mod } = await req.json();
  const kod = rastgeleKod();

  const { data, error } = await supabase
    .from("odalar")
    .insert({ kod, mod, durum: "lobi", oyuncular: [] })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function GET(req: NextRequest) {
  const kod = req.nextUrl.searchParams.get("kod");
  if (!kod) return NextResponse.json({ error: "Kod gerekli" }, { status: 400 });

  const { data, error } = await supabase
    .from("odalar")
    .select()
    .eq("kod", kod.toUpperCase())
    .single();

  if (error) return NextResponse.json({ error: "Oda bulunamadı" }, { status: 404 });
  return NextResponse.json(data);
}
