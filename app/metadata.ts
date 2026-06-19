import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calcio Threads - Premium Custom Football Jerseys",
  description: "Shop the latest sports jerseys and orchestrate your custom team designs. Authentic jerseys for football, custom kits, retro classics.",
  keywords: "sports jerseys, football jerseys, soccer jerseys, custom jerseys, custom kits, retro jerseys, calcio threads",
  authors: [{ name: "Calcio Threads" }],
  creator: "Calcio Threads",
  publisher: "Calcio Threads",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://calcio-threads.vercel.app",
    title: "Calcio Threads - Premium Custom Football Jerseys",
    description: "Shop the latest sports jerseys and orchestrate your custom team designs. Authentic jerseys for football, custom kits, retro classics.",
    siteName: "Calcio Threads",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calcio Threads - Premium Custom Football Jerseys",
    description: "Shop the latest sports jerseys and orchestrate your custom team designs. Authentic jerseys for football, custom kits, retro classics.",
    creator: "@calciothreads",
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