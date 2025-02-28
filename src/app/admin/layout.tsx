import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PATH } from "@/utils/const";
import Link from "next/link";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="flex justify-between items-center p-4 bg-gray-100">
          <div>
            <Link href={PATH.admin} className="text-lg font-bold">
              Logo - Admin
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href={PATH.orders} className="text-sm">
              Orders
            </Link>
          </div>
        </header>
        <div className="max-w-[1200px] mx-auto">{children}</div>
      </body>
    </html>
  );
}
