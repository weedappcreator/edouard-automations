import type { Metadata } from "next";
import { Syne, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Edouard Automations — AI Growth Partner | Santo Domingo, DR",
  description:
    "We connect AI, automation, CRM, marketing and high-converting web experiences into one growth operating system. Serving businesses in Santo Domingo and beyond.",
  keywords: [
    "AI automation Dominican Republic",
    "growth partner Santo Domingo",
    "CRM automation",
    "AI receptionist",
    "business automation n8n",
    "automatización con IA República Dominicana",
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
      suppressHydrationWarning
      className={`${syne.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body suppressHydrationWarning style={{ backgroundColor: "#07090C" }}>
        {children}
      </body>
    </html>
  );
}
