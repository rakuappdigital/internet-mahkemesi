import Image from "next/image";

export default function RakuFooter() {
  return (
    <footer
      className="w-full flex items-center justify-center gap-3 py-4"
      style={{ borderTop: "1px solid var(--border)", opacity: 0.5 }}
    >
      <Image
        src="/raku-logo.png"
        alt="RAKU"
        width={64}
        height={20}
        style={{ objectFit: "contain" }}
      />
      <span className="text-xs" style={{ color: "var(--muted)" }}>
        © {new Date().getFullYear()} rakuapp
      </span>
    </footer>
  );
}
