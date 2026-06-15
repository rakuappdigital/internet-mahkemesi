"use client";
import AvatarSVG from "./AvatarSVG";
import { type RolGroup } from "@/lib/avatarData";
import { FACE_VARIANTS } from "@/lib/avatarData";

interface Props {
  rolGroup: RolGroup;
  selected: number;
  onChange: (v: number) => void;
}

export default function AvatarPicker({ rolGroup, selected, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold">Avatarını Seç</label>
      <div className="grid grid-cols-5 gap-2">
        {FACE_VARIANTS.map((f, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            title={f.label}
            className="rounded-lg p-1 transition-all border"
            style={{
              borderColor: selected === i ? "var(--accent)" : "var(--border)",
              background: selected === i ? "var(--accent)15" : "var(--surface)",
            }}
          >
            <AvatarSVG rolGroup={rolGroup} variant={i} size={52} />
          </button>
        ))}
      </div>
      <p className="text-xs" style={{ color: "var(--muted)" }}>{FACE_VARIANTS[selected].label}</p>
    </div>
  );
}
