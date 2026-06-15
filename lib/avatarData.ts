export interface FaceVariant {
  skin: string;
  hairColor: string;
  hairStyle: 0 | 1 | 2 | 3 | 4; // 0:kısa düz, 1:uzun, 2:kıvırcık, 3:kel, 4:topuz
  eyeColor: string;
  hasGlasses: boolean;
  hasBeard: boolean;
  expression: "neutral" | "serious" | "confident" | "worried";
  label: string;
}

export const FACE_VARIANTS: FaceVariant[] = [
  { skin: "#FDBCB4", hairColor: "#3B2314", hairStyle: 0, eyeColor: "#3B2314", hasGlasses: false, hasBeard: false, expression: "neutral",    label: "Açık ten, koyu kısa saç" },
  { skin: "#F0C27F", hairColor: "#1a1a1a", hairStyle: 1, eyeColor: "#2c1810", hasGlasses: false, hasBeard: false, expression: "serious",    label: "Buğday ten, siyah uzun saç" },
  { skin: "#C68642", hairColor: "#0d0d0d", hairStyle: 2, eyeColor: "#1a0f00", hasGlasses: false, hasBeard: false, expression: "confident",  label: "Esmer ten, kıvırcık saç" },
  { skin: "#FDBCB4", hairColor: "#D4A017", hairStyle: 0, eyeColor: "#4a7c59", hasGlasses: true,  hasBeard: false, expression: "confident",  label: "Açık ten, sarı saç, gözlük" },
  { skin: "#8D5524", hairColor: "#1a1a1a", hairStyle: 3, eyeColor: "#1a0f00", hasGlasses: false, hasBeard: false, expression: "serious",    label: "Koyu esmer, kel" },
  { skin: "#F0C27F", hairColor: "#7a3b1e", hairStyle: 2, eyeColor: "#5c3317", hasGlasses: false, hasBeard: true,  expression: "worried",   label: "Buğday, kızıl kıvırcık, sakal" },
  { skin: "#FDBCB4", hairColor: "#9B9B9B", hairStyle: 0, eyeColor: "#3B2314", hasGlasses: true,  hasBeard: false, expression: "neutral",    label: "Açık ten, gri saç, gözlük" },
  { skin: "#C68642", hairColor: "#0d0d0d", hairStyle: 1, eyeColor: "#1a0f00", hasGlasses: false, hasBeard: true,  expression: "confident",  label: "Esmer, uzun saç, sakal" },
  { skin: "#FDBCB4", hairColor: "#8B3A0F", hairStyle: 4, eyeColor: "#2e5d34", hasGlasses: false, hasBeard: false, expression: "neutral",    label: "Açık ten, kahve topuz" },
  { skin: "#8D5524", hairColor: "#0d0d0d", hairStyle: 4, eyeColor: "#1a0f00", hasGlasses: false, hasBeard: false, expression: "confident",  label: "Koyu esmer, siyah topuz" },
];

export type RolGroup = "hakim" | "avukat" | "serbest";

export function rolToGroup(rol: string): RolGroup {
  if (rol === "hakim") return "hakim";
  if (rol === "davaci_avukat" || rol === "davali_avukat") return "avukat";
  return "serbest";
}
