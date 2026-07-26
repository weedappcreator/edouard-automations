import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Edouard Automations — AI Growth Partner | Santo Domingo, DR",
  description:
    "We connect AI, automation, CRM, marketing and high-converting web experiences into one growth operating system. Serving businesses in Santo Domingo and beyond.",
  keywords: [
    "AI automation",
    "growth partner",
    "CRM automation",
    "marketing systems",
    "Santo Domingo",
    "Dominican Republic",
  ],
  openGraph: {
    title: "Edouard Automations — AI Growth Partner",
    description:
      "One connected system from attention to operation. AI, automation, CRM, and web experiences.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body style={{ backgroundColor: "#07090C" }}>{children}</body>
    </html>
  );
}
