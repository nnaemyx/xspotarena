import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Jersey Store",
  description: "Manage your Jersey Store inventory, orders, and customers",
  keywords: "admin dashboard, jersey store admin, inventory management, order management",
  authors: [{ name: "Jersey Store Admin" }],
  creator: "Jersey Store",
  publisher: "Jersey Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://jersey-store.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jersey-store.vercel.app/admin",
    title: "Admin Dashboard - Jersey Store",
    description: "Manage your Jersey Store inventory, orders, and customers",
    siteName: "Jersey Store Admin",
  },
  twitter: {
    card: "summary_large_image",
    title: "Admin Dashboard - Jersey Store",
    description: "Manage your Jersey Store inventory, orders, and customers",
    creator: "@jerseystore",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}; 