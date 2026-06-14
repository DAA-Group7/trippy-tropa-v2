import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./trippy.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trippy Tropa",
  description: "Join the next generation of smart classrooms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} dark antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#0a0a1a] overflow-x-hidden text-white">{children}</body>
    </html>
  );
}
