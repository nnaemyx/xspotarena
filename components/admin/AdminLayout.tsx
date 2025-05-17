"use client"

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBagIcon },
  { name: "Customers", href: "/admin/customers", icon: UserGroupIcon },
  { name: "Messages", href: "/admin/messages", icon: ChatBubbleLeftRightIcon },
  { name: "Notifications", href: "/admin/notifications", icon: BellIcon },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="h-16 flex items-center justify-center border-b">
            <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                    isActive ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <header className="h-16 bg-white shadow-sm">
            <div className="h-full px-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
              </h2>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-blue-600">
                  <BellIcon className="w-6 h-6" />
                </button>
                <div className="h-8 w-8 rounded-full bg-gray-200" />
              </div>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
} 