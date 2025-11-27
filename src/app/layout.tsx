import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollTracker from "@/components/ScrollTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Engineering Lab",
  description: "Juan Flores — Experiments in performance and systems",
  icons: {
    icon: [
      { url: "/favicon.ico", rel: "icon" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.05),_transparent_70%)] 
              dark:bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.15),_transparent_80%)] 
              text-foreground`}>
        <Header />
        <ScrollTracker />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
