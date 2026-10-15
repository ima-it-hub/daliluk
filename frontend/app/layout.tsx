import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const bahij = localFont({
  src: "../public/fonts/Bahij TheSansArabic.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "بوصلة طموحك | IMA Plomberie",
  description: "تقييم شخصي تفاعلي لتوجيهك نحو الوظيفة الأنسب في صالون التوظيف",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${bahij.className} antialiased`}>{children}</body>
    </html>
  );
}
