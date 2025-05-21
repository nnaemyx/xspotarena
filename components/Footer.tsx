import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Logo from "@/public/images/logo 1.png";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[#FFD700] bg-black">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Image src={Logo} alt="Logo" width={220} height={40} className="w-auto mb-4" />
            <p className="text-sm text-gray-400">
              Your one-stop shop for custom jerseys and sports apparel. Quality
              materials, unique designs, and fast delivery.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-white hover:text-[#FFD700]"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-jersey"
                  className="text-sm text-white hover:text-[#FFD700]"
                >
                  Custom Jersey
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-white hover:text-[#FFD700]"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-white hover:text-[#FFD700]"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-white hover:text-[#FFD700]"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-white hover:text-[#FFD700]"
                >
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                className="text-white hover:text-[#FFD700]"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-white hover:text-[#FFD700]"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                className="text-white hover:text-[#FFD700]"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#FFD700] text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} XSpot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
