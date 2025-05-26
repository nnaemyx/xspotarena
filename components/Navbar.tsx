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
    <nav className=" fixed w-full bg-black z-50 top-0 left-0">
      <div className="container mx-auto px-4">
        <div className="flex h-[4rem] md:h-[6rem] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="hidden md:flex">
            <Image
              src={Logo}
              alt="Jersey Store Logo"
              width={200}
              height={40}
              className="w-auto"
            />
          </Link>
          <Link href="/" className="md:hidden flex">
            <Image
              src={Logo}
              alt="Jersey Store Logo"
              width={120}
              height={40}
              className="w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className={`text-sm font-medium ${
                pathname === "/products" ? "text-[#FFD700]" : "text-white hover:text-[#FFD700]"
              }`}
            >
              Products
            </Link>
            <Link
              href="/custom-jersey"
              className={`text-sm font-medium ${
                pathname === "/custom-jersey"
                  ? "text-[#FFD700]"
                  : "text-white hover:text-[#FFD700]"
              }`}
            >
              Custom Jersey
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium ${
                pathname === "/blog" ? "text-[#FFD700]" : "text-white hover:text-[#FFD700]"
              }`}
            >
              Blog
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart">
              <Button variant={pathname === "/cart" ? "default" : "ghost"} className="relative text-white hover:text-[#FFD700]">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FFD700] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-white hover:text-[#FFD700]">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#FFD700] text-black">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-black border-[#FFD700]">
                {notifications.length === 0 ? (
                  <DropdownMenuItem className="text-white">
                    No notifications
                  </DropdownMenuItem>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`cursor-pointer text-white hover:bg-[#1a1a1a] ${
                        !notification.read ? "bg-[#1a1a1a]" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === "ADMIN" ? (
                  <Link href="/admin">
                    <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                      Admin Dashboard
                    </Button>
                  </Link>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-[#FFD700]">
                        <User className="h-5 w-5" />
                        <span>{user.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-black border-[#FFD700]">
                      <DropdownMenuItem onClick={() => router.push("/profile")} className="text-white hover:bg-[#1a1a1a]">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/orders")} className="text-white hover:bg-[#1a1a1a]">
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="text-white hover:bg-[#1a1a1a]">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="text-white hover:text-[#FFD700]">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <Link href="/cart">
              <Button variant={pathname === "/cart" ? "default" : "ghost"} className="relative text-white hover:text-[#FFD700]">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FFD700] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-white hover:text-[#FFD700]">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#FFD700] text-black">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-black border-[#FFD700]">
                {notifications.length === 0 ? (
                  <DropdownMenuItem className="text-white">
                    No notifications
                  </DropdownMenuItem>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`cursor-pointer text-white hover:bg-[#1a1a1a] ${
                        !notification.read ? "bg-[#1a1a1a]" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white hover:text-[#FFD700]">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#FFD700]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/products"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === "/products" ? "text-[#FFD700]" : "text-white hover:text-[#FFD700]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/custom-jersey"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === "/custom-jersey" ? "text-[#FFD700]" : "text-white hover:text-[#FFD700]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Custom Jersey
              </Link>
              <Link
                href="/blog"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === "/blog" ? "text-[#FFD700]" : "text-white hover:text-[#FFD700]"
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
                      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#FFD700]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/profile"
                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#FFD700]"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#FFD700]"
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
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#FFD700]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#FFD700]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 