"use client";

import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/contexts/CartContext";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Providers>
            <div className="min-h-screen flex flex-col">
              {!isAdminRoute && <Navbar />}
              <main className={`flex-grow ${!isAdminRoute ? 'pt-16' : ''}`}>{children}</main>
              {!isAdminRoute && <Footer />}
            </div>
          </Providers>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
