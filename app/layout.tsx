import type { Metadata } from "next";
import { Suspense } from "react";
import { Lora, Noto_Sans } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Sacrament Meetings | Parque Urquiza Ward",
    template: "%s | Sacrament Meetings",
  },

  description:
    "Plan and manage sacrament meeting schedules, agendas, hymns, speakers, and ward business for Parque Urquiza Ward.",

  applicationName: "Sacrament Meetings",

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sacrament Meetings",
    title: "Sacrament Meetings | Parque Urquiza Ward",
    description:
      "Plan and manage sacrament meeting schedules, agendas, hymns, speakers, and ward business for Parque Urquiza Ward.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${notoSans.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense
          fallback={
            <header className="center py-4 mt-12 text-center">
              Loading...
            </header>
          }
        >
          <Header />
        </Suspense>
        {children}
        <Suspense
          fallback={
            <footer className="py-4 mt-12 text-center bg-gray-400 text-white">
              Loading...
            </footer>
          }
        >
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
