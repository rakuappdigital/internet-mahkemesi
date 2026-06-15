import type { Metadata } from "next";
import "./globals.css";
import RakuFooter from "@/components/RakuFooter";
import { Analytics } from "@vercel/analytics/next";

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
      <body className="flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        <RakuFooter />
        <Analytics />
      </body>
    </html>
  );
}
