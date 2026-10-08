import type { Metadata } from "next";
import { Amiri, Cairo } from "next/font/google";
import "./globals.css";

const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri" });
const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "600", "700"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: "Seen Automation | لوحة التحكم",
  description: "Interactive Visual Reference for Seen Automation Business Plan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${cairo.variable}`}>
      <body className="bg-background text-foreground font-cairo antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}