"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="text-5xl">💥</div>
      <h1 className="text-xl font-bold" style={{ color: "var(--suclu)" }}>Mahkeme Ertelendi</h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>Beklenmedik bir hata oluştu.</p>
      <p className="text-xs font-mono px-3 py-2 rounded" style={{ background: "var(--surface)", color: "var(--muted)" }}>
        {error.message}
      </p>
      <button className="btn-primary" onClick={reset}>Tekrar Dene</button>
    </div>
  );
}
