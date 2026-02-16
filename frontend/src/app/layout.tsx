import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "O ai | High-Interactivity RPG Chat",
  description: "Create and chat with AI characters having continuous memory and unique personalities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen relative`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
