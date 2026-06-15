import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Judge Me or Not",
  description: "Absürt davaları arkadaşlarınla yargıla. Hakim, avukat, jüri ol — karar ver.",
  openGraph: {
    title: "Judge Me or Not",
    description: "Absürt davaları arkadaşlarınla yargıla.",
    siteName: "Judge Me or Not",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
