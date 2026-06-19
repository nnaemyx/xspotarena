"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isHomePage = pathname === "/";

  return (
    <CartProvider>
      <Providers>
        <div className="min-h-screen flex flex-col">
          {!isAdminRoute && <Navbar />}
          <main className={`flex-grow ${!isAdminRoute && !isHomePage ? 'pt-[8rem]' : ''}`}>{children}</main>
          {!isAdminRoute && <Footer />}
        </div>
      </Providers>
      <Toaster />
    </CartProvider>
  );
}
