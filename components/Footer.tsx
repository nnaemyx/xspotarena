import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Logo from "@/public/images/logo 1.png";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Image src={Logo} alt="Calcio Threads Logo" width={200} height={40} className="w-auto mb-4" />
            <p className="text-sm text-zinc-600 leading-relaxed">
              Orchestrating premium football kits, retro classics, and bespoke jersey customization. 
              Crafted for players, built for supporters, engineered for ultimate class.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-black">Shop Collections</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-zinc-500 hover:text-black transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-jersey"
                  className="text-sm text-zinc-500 hover:text-black transition-colors"
                >
                  Custom Jersey Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-zinc-500 hover:text-black transition-colors"
                >
                  Official Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-black">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-zinc-500 hover:text-black transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-zinc-500 hover:text-black transition-colors"
                >
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-zinc-500 hover:text-black transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-black">Connect With Us</h3>
            <p className="text-sm text-zinc-600 mb-4">Follow the pitch updates, new kit drops, and exclusive offers.</p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:text-white hover:bg-black hover:border-black transition-all duration-300"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="https://twitter.com"
                className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:text-white hover:bg-black hover:border-black transition-all duration-300"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://instagram.com"
                className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:text-white hover:bg-black hover:border-black transition-all duration-300"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Calcio Threads. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

