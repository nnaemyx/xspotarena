"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  productId: string;
  quantity: number;
  size: string;
}

interface CartContextType {
  cartCount: number;
  cart: CartItem[];
  updateCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);

  const updateCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartCount(0);
        setCart([]);
        return;
      }

      const response = await fetch("/api/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      setCart(data.items || []);
      setCartCount(data.items?.length || 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
      setCart([]);
    }
  };

  // Update cart count when token changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        updateCartCount();
      }
    };

    // Initial fetch
    updateCartCount();

    // Listen for token changes
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLogin", updateCartCount);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLogin", updateCartCount);
    };
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, cart, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
} 