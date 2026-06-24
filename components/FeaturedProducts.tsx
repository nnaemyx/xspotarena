"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  stockStatus: string;
  stock: number;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const { updateCartCount } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?featured=true");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load featured products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, size: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Please login",
          description: "You need to login to add items to cart",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          size: size || "M",
        }),
      });

      if (!response.ok) throw new Error("Failed to add to cart");

      await updateCartCount();
      toast({
        title: "Success",
        description: "Product added to cart",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-zinc-50 border border-zinc-200 p-4 rounded-none">
            <div className="bg-zinc-100 h-64 rounded-none mb-4" />
            <div className="h-4 bg-zinc-200 rounded-none w-3/4 mb-2" />
            <div className="h-4 bg-zinc-200 rounded-none w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-black" /> Curated Pitchwear
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase text-black tracking-tight">Featured Kits</h2>
        </div>
        <Link href="/products" className="text-xs uppercase tracking-wider text-black border-b border-black font-bold pb-1 hover:border-transparent transition-all">
          View All Kits &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className={`group relative bg-white border border-zinc-200 hover:border-black overflow-hidden transition-all duration-300 flex flex-col justify-between premium-card-hover ${
              product.stockStatus === "OUT_OF_STOCK" || product.stock === 0 ? "opacity-75" : ""
            }`}
          >
            {/* Image section */}
            <div className="relative overflow-hidden aspect-[4/5] bg-zinc-50">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 right-3 bg-black text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest">
                {product.category.replace("_", " ")}
              </div>
              {(product.stockStatus === "OUT_OF_STOCK" || product.stock === 0) && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="bg-zinc-900 text-white text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest">Sold Out</span>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-zinc-900 text-sm group-hover:text-zinc-500 transition-colors line-clamp-1 uppercase tracking-wide">{product.name}</h3>
                <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">{product.description}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-150 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Price</p>
                  <p className={`text-base font-bold ${product.stockStatus === "OUT_OF_STOCK" || product.stock === 0 ? "text-zinc-400 line-through" : "text-black"}`}>₦{product.price.toLocaleString()}</p>
                </div>
                
                <div>
                  <Button
                    size="sm"
                    className="bg-black hover:bg-zinc-900 text-white rounded-none h-9 w-9 p-0 flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (product.sizes && product.sizes.length > 0) {
                        router.push(`/products/${product.id}`);
                      } else {
                        addToCart(product.id, "M");
                      }
                    }}
                    disabled={product.stockStatus === "OUT_OF_STOCK" || product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}