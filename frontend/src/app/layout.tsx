import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

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
    <body className={`${inter.className} min-h-screen relative antialiased flex`}>
      <Sidebar />
      <main className="flex-1 min-w-0 pl-[80px]">
        {children}
      </main>
    </body>
  );
}
