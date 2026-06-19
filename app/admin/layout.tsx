"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Package, ShoppingCart, FileText, Bell, MessageSquare, Home, Award } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Blog",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    label: "Custom Jerseys",
    href: "/admin/custom-jerseys",
    icon: Award,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount((data.notifications || []).filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/notifications/${notificationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (!res.ok) throw new Error("Failed to mark notification as read");

      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-zinc-200 fixed w-full z-50 top-0 left-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
                <span>Calcio Threads</span>
                <span className="text-[10px] uppercase bg-black text-white px-2 py-0.5 rounded-none font-bold tracking-widest">
                  Admin
                </span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-black rounded-none hover:bg-zinc-100">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-zinc-500 hover:text-black rounded-none hover:bg-zinc-100">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-black text-white text-[10px] font-bold rounded-full">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white border border-zinc-200 text-black rounded-none shadow-xl">
                  {notifications.length === 0 ? (
                    <DropdownMenuItem className="text-zinc-500 focus:bg-zinc-50 focus:text-black py-3">
                      No notifications
                    </DropdownMenuItem>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`cursor-pointer focus:bg-zinc-50 focus:text-black border-b border-zinc-100 py-3 ${
                          !notification.isRead ? "bg-zinc-50/50" : ""
                        }`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <p className="text-xs text-zinc-900 font-semibold">{notification.message}</p>
                          <p className="text-[10px] text-zinc-400 font-medium">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-zinc-500 hover:text-red-600 rounded-none hover:bg-red-50 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-zinc-200 pt-6 z-40">
        <nav className="px-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-none transition-all duration-200 font-bold text-xs uppercase tracking-wider border-l-2 ${
                  isActive
                    ? "bg-zinc-50 text-black border-black"
                    : "text-zinc-500 hover:text-black hover:bg-zinc-50 border-transparent"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-16 min-h-screen relative z-10 bg-zinc-50">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}