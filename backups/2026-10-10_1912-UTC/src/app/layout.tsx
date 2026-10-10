import type { Metadata } from "next";
import { Amiri, Cairo, Inter } from "next/font/google";
import "./globals.css";
const amiri = Amiri({ subsets: ["arabic"], weight: ["400","700"], variable: "--font-amiri" });
const cairo = Cairo({ subsets: ["arabic","latin"], weight: ["300","400","500","600","700","800"], variable: "--font-cairo" });
const inter = Inter({ subsets: ["latin"], weight: ["300","400","500","600","700"], variable: "--font-inter" });
export const metadata: Metadata = {
  title: "Seen Automation | Investor Briefcase v5.0",
  description: "Interactive Investor Briefcase — Automate. Elevate. Halal.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${amiri.variable} ${cairo.variable} ${inter.variable}`}>
      <body className="bg-background dark:bg-dark-bg text-foreground dark:text-white font-cairo antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}