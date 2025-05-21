"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
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
          size: size || "M", // Default to Medium if no size specified
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                <p className="text-lg font-bold mt-2">₦{product.price.toLocaleString()}</p>
                <p className={`text-sm ${
                  product.stockStatus === "IN_STOCK" && product.stock > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}>
                  {product.stockStatus === "IN_STOCK" && product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </p>
              </div>
              <Button
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  // If product has sizes, redirect to product page
                  if (product.sizes && product.sizes.length > 0) {
                    router.push(`/products/${product.id}`);
                  } else {
                    // If no sizes, add directly to cart with default size
                    addToCart(product.id, "M");
                  }
                }}
                disabled={product.stockStatus === "OUT_OF_STOCK" || product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stockStatus === "OUT_OF_STOCK" || product.stock === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 