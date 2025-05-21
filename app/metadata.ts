import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jersey Store - Premium Sports Jerseys",
  description: "Shop the latest sports jerseys from top brands. Authentic jerseys for football, basketball, soccer, and more.",
  keywords: "sports jerseys, football jerseys, basketball jerseys, soccer jerseys, authentic jerseys",
  authors: [{ name: "Jersey Store" }],
  creator: "Jersey Store",
  publisher: "Jersey Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jersey-store.vercel.app",
    title: "Jersey Store - Premium Sports Jerseys",
    description: "Shop the latest sports jerseys from top brands. Authentic jerseys for football, basketball, soccer, and more.",
    siteName: "Jersey Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jersey Store - Premium Sports Jerseys",
    description: "Shop the latest sports jerseys from top brands. Authentic jerseys for football, basketball, soccer, and more.",
    creator: "@jerseystore",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}; 