"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  stockStatus: string;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { toast } = useToast();

  const addToCart = async (productId: string) => {
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
          size: "M", // Default size
          quantity: 1,
        }),
      });

      if (!response.ok) throw new Error("Failed to add to cart");

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

  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500">No products found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group">
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <Link href={`/products/${product.id}`}>
              <div className="relative h-64">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                  {product.name}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mt-1">{product.category}</p>
              <p className="text-blue-600 font-bold mt-2">
                ₦{product.price.toLocaleString()}
              </p>
              <Button
                className="w-full mt-4"
                onClick={() => addToCart(product.id)}
                disabled={product.stockStatus === "OUT_OF_STOCK"}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.stockStatus === "OUT_OF_STOCK" ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 