"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut, Package, Settings, Menu, X, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Logo from "@/public/images/logo 1.png";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { cartCount } = useCart();

  useEffect(() => {
    // Initial check for user
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen for storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
        } else {
          setUser(null);
        }
      }
    };

    // Listen for custom login event
    const handleLogin = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLogin", handleLogin);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLogin", handleLogin);
    };
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount((data.notifications || []).filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`/api/notifications/${notification.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ read: true }),
      });

      if (!res.ok) throw new Error("Failed to mark notification as read");

      if (notification.type === "MESSAGE") {
        router.push("/custom-jersey/messages");
      }

      fetchNotifications();
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    router.push("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50 top-0 left-0 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-85 transition-opacity">
            <Image
              src={Logo}
              alt="Calcio Threads Logo"
              width={140}
              height={28}
              className="w-auto h-6 md:h-8 object-contain filter invert-0"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link
              href="/products"
              className={`text-sm font-semibold tracking-wide transition-colors duration-300 relative py-1 ${pathname === "/products"
                ? "text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black"
                : "text-zinc-500 hover:text-black"
                }`}
            >
              Products
            </Link>
            <Link
              href="/custom-jersey"
              className={`text-sm font-semibold tracking-wide transition-colors duration-300 relative py-1 ${pathname === "/custom-jersey"
                ? "text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black"
                : "text-zinc-500 hover:text-black"
                }`}
            >
              Custom Jersey
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-semibold tracking-wide transition-colors duration-300 relative py-1 ${pathname === "/blog"
                ? "text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black"
                : "text-zinc-500 hover:text-black"
                }`}
            >
              Blog
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className={`relative rounded-full hover:bg-gray-100 ${pathname === "/cart" ? "text-black bg-gray-50" : "text-zinc-700 hover:text-black"}`}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-gray-100 text-zinc-700 hover:text-black">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4.5 w-4.5 flex items-center justify-center p-0 bg-black text-white text-[10px] font-bold rounded-full">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-150 text-black rounded-xl shadow-xl">
                {notifications.length === 0 ? (
                  <DropdownMenuItem className="text-zinc-400 focus:bg-gray-50 focus:text-black cursor-default py-3">
                    No notifications
                  </DropdownMenuItem>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`cursor-pointer focus:bg-gray-50 focus:text-black border-b border-gray-50 py-3 ${!notification.read ? "bg-gray-50/50" : ""
                        }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <p className="text-sm text-zinc-800">{notification.message}</p>
                        <p className="text-[10px] text-zinc-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === "ADMIN" ? (
                  <Link href="/admin">
                    <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white rounded-lg transition-all duration-300 font-semibold px-4 text-xs h-9">
                      Admin Dashboard
                    </Button>
                  </Link>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 text-zinc-700 hover:text-black hover:bg-gray-100 rounded-full px-3">
                        <User className="h-5 w-5 text-zinc-500" />
                        <span className="text-sm font-semibold">{user.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border border-gray-150 text-black rounded-xl shadow-xl">
                      <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer focus:bg-gray-50 focus:text-black">
                        <Settings className="mr-2 h-4 w-4 text-zinc-500" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/orders")} className="cursor-pointer focus:bg-gray-50 focus:text-black">
                        <Package className="mr-2 h-4 w-4 text-zinc-500" />
                        My Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer focus:bg-red-50 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="text-zinc-700 hover:text-black rounded-full hover:bg-gray-100">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-1">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className={`relative rounded-full hover:bg-gray-100 ${pathname === "/cart" ? "text-black bg-gray-50" : "text-zinc-700 hover:text-black"}`}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-gray-100 text-zinc-700 hover:text-black">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4.5 w-4.5 flex items-center justify-center p-0 bg-black text-white text-[10px] font-bold rounded-full">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-150 text-black rounded-xl shadow-xl">
                {notifications.length === 0 ? (
                  <DropdownMenuItem className="text-zinc-400">
                    No notifications
                  </DropdownMenuItem>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`cursor-pointer focus:bg-gray-50 focus:text-black border-b border-gray-50 py-3 ${!notification.read ? "bg-gray-50/50" : ""
                        }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <p className="text-sm text-zinc-800">{notification.message}</p>
                        <p className="text-[10px] text-zinc-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-zinc-700 hover:text-black rounded-full hover:bg-gray-100">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-3 px-2">
              <Link
                href="/products"
                className={`px-3 py-2.5 rounded-lg text-base font-semibold ${pathname === "/products" ? "text-black bg-gray-50" : "text-zinc-600 hover:text-black"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/custom-jersey"
                className={`px-3 py-2.5 rounded-lg text-base font-semibold ${pathname === "/custom-jersey" ? "text-black bg-gray-50" : "text-zinc-600 hover:text-black"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Custom Jersey
              </Link>
              <Link
                href="/blog"
                className={`px-3 py-2.5 rounded-lg text-base font-semibold ${pathname === "/blog" ? "text-black bg-gray-50" : "text-zinc-600 hover:text-black"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>

              {user ? (
                <>
                  {user.role === "ADMIN" ? (
                    <Link
                      href="/admin"
                      className="px-3 py-2.5 rounded-lg text-base font-semibold text-black bg-zinc-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/profile"
                        className="px-3 py-2.5 rounded-lg text-base font-semibold text-zinc-600 hover:text-black"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="px-3 py-2.5 rounded-lg text-base font-semibold text-zinc-600 hover:text-black"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-2.5 rounded-lg text-base font-semibold text-zinc-600 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}