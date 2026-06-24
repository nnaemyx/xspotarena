import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Logo from "@/public/images/logo 1.png";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      {/* Newsletter Section */}
      <div className="bg-zinc-950 py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-white mb-3">Stay in the Game</h3>
          <p className="text-zinc-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Be the first to know about new kit drops, exclusive deals, and restocks. No spam — just goals.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors rounded-none"
            />
            <button className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors rounded-none">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
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
                  className="text-sm text-zinc-500 hover:text-black transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-black transition-all duration-300" />
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-jersey"
                  className="text-sm text-zinc-500 hover:text-black transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-black transition-all duration-300" />
                  Custom Jersey Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-zinc-500 hover:text-black transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-black transition-all duration-300" />
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
                  className="text-sm text-zinc-500 hover:text-black transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-black transition-all duration-300" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-zinc-500 hover:text-black transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-black transition-all duration-300" />
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-zinc-500 hover:text-black transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-black transition-all duration-300" />
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-black">Connect With Us</h3>
            <p className="text-sm text-zinc-600 mb-4">Follow the pitch updates, new kit drops, and exclusive offers.</p>
            <div className="flex space-x-3">
              <Link
                href="https://facebook.com"
                className="w-10 h-10 bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 hover:text-white hover:bg-black hover:border-black transition-all duration-300 group"
              >
                <Facebook className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="https://twitter.com"
                className="w-10 h-10 bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 hover:text-white hover:bg-black hover:border-black transition-all duration-300 group"
              >
                <Twitter className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="https://instagram.com"
                className="w-10 h-10 bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 hover:text-white hover:bg-black hover:border-black transition-all duration-300 group"
              >
                <Instagram className="h-4 w-4 group-hover:scale-110 transition-transform" />
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
