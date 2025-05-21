"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Send } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    role: string;
  };
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { updateCartCount } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchProduct();
    fetchMessages();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await res.json();
      console.log("Fetched product data:", data);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`/api/products/${params.id}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Please login",
          description: "You need to login to send messages",
          variant: "destructive",
        });
        return;
      }

      const res = await fetch(`/api/products/${params.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setNewMessage("");
      fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      if (!product) {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        return;
      }

      if (!selectedSize) {
        toast({
          title: "Error",
          description: "Please select a size",
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
          productId: product.id,
          quantity: 1,
          size: selectedSize,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add to cart");
      }

      await updateCartCount();
      toast({
        title: "Success",
        description: "Item added to cart",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  if (!product) {
    return <div className="container mx-auto p-8">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-[400px] object-cover rounded-lg"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold">₦{product.price.toLocaleString()}</p>
          <p className="text-muted-foreground">{product.description}</p>

          <div>
            <Label>Size</Label>
            <div className="flex gap-2 mt-2">
              {product.sizes && product.sizes.length > 0 ? (
                product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => {
                      console.log("Selected size:", size);
                      setSelectedSize(size);
                    }}
                    disabled={product.stockStatus === "OUT_OF_STOCK" || product.stock === 0}
                  >
                    {size}
                  </Button>
                ))
              ) : (
                <p className="text-muted-foreground">No sizes available</p>
              )}
            </div>
          </div>

          <div>
            <Label>Quantity</Label>
            <div className="flex items-center gap-4 mt-2">
              <Button
                variant="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || product.stockStatus === "OUT_OF_STOCK" || product.stock === 0}
              >
                -
              </Button>
              <span>{quantity}</span>
              <Button
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= (product.stock || 1) || product.stockStatus === "OUT_OF_STOCK" || product.stock === 0}
              >
                +
              </Button>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={!selectedSize || product.stockStatus === "OUT_OF_STOCK" || product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {(() => {
              console.log("Button state:", {
                selectedSize,
                stockStatus: product.stockStatus,
                stock: product.stock,
                isDisabled: !selectedSize || product.stockStatus === "OUT_OF_STOCK" || product.stock === 0
              });
              return product.stockStatus === "OUT_OF_STOCK" || product.stock === 0 
                ? "Out of Stock" 
                : "Add to Cart";
            })()}
          </Button>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Category:</span> {product.category.replace(/_/g, ' ')}</p>
              <p><span className="font-medium">Stock Status:</span> {product.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock"}</p>
              <p><span className="font-medium">Available Quantity:</span> {product.stock}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>
            <div className="space-y-4">
              <ScrollArea className="h-[200px] border rounded-lg p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 ${
                      message.user.role === "ADMIN"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    <p className="font-semibold">{message.user.name}</p>
                    <p>{message.content}</p>
                  </div>
                ))}
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 