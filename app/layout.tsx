import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "İnternet Mahkemesi",
  description: "Absürt davaları yargıla, jüri ol, karar ver.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
