import type { Metadata } from "next";
import { Amiri, Cairo, Inter } from "next/font/google";
import "./globals.css";

const amiri = Amiri({ subsets: ["arabic"], weight: ["400","700"], variable: "--font-amiri" });
const cairo = Cairo({ subsets: ["arabic","latin"], weight: ["300","400","500","600","700","800"], variable: "--font-cairo" });
const inter = Inter({ subsets: ["latin"], weight: ["300","400","500","600","700"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Seen Automation | بوابة المستثمر التفاعلية",
  description: "Interactive Visual Reference — Automate. Elevate. Halal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${cairo.variable} ${inter.variable}`}>
      <body className="bg-background text-foreground font-cairo antialiased min-h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}