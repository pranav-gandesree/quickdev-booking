import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

import {
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { SolanaProvider } from "@/components/canvas/SolanaProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quick dev",
  description: "Find your next developer quickly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#262526]`}>


        <SolanaProvider>
            <Providers>
              {children}
              <Toaster />
            </Providers>
        </SolanaProvider>
        

      </body>
    </html>
  );
}
