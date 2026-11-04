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

export const metadata: Metadata = {
  title: "Sacrament Meetings",
  description: "Plan and review meeting agendas",
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
            <header
              className="center py-4 mt-12 text-center bg-gray-800 text-white">
              Loading...
            </header>
        }>
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
