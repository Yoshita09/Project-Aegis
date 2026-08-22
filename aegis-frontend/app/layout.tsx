import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AnalysisProvider } from "@/context/AnalysisContext";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AEGIS — AI Space Defense Platform",
  description: "Advanced space weather threat monitoring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#07111f] text-white`}>
        <AnalysisProvider>
          {children}
        </AnalysisProvider>
      </body>
    </html>
  );
}