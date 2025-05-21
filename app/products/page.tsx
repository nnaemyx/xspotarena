"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  stock: number;
  stockStatus: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          productId, 
          quantity: 1,
          size: size || "M" // Default to Medium if no size specified
        }),
      });

      if (!response.ok) throw new Error("Failed to add to cart");

      toast({
        title: "Added to cart",
        description: "Product has been added to your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Jerseys</h1>
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jerseys</SelectItem>
              <SelectItem value="RETRO_JERSEYS">Retro Jerseys</SelectItem>
              <SelectItem value="HOME_JERSEYS">Home Jerseys</SelectItem>
              <SelectItem value="AWAY_JERSEYS">Away Jerseys</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
          >
            <Link href={`/products/${product.id}`}>
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold">₦{product.price.toLocaleString()}</span>
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
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      // If product has sizes, redirect to product page
                      if (product.sizes && product.sizes.length > 0) {
                        window.location.href = `/products/${product.id}`;
                      } else {
                        // If no sizes, add directly to cart with default size
                        addToCart(product.id, "M");
                      }
                    }}
                    disabled={product.stockStatus === "OUT_OF_STOCK" || product.stock === 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stockStatus === "OUT_OF_STOCK" || product.stock === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 