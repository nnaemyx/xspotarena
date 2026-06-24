"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface OrderSummary {
  items: {
    product: {
      name: string;
      price: number;
      images: string[];
    };
    quantity: number;
    size: string;
  }[];
  subtotal: number;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  useEffect(() => {
    const fetchOrderSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/orders/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: cart }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order summary");
        }

        const data = await response.json();
        setOrderSummary(data);
      } catch (error) {
        console.error("Error fetching order summary:", error);
        toast({
          title: "Error",
          description: "Failed to load order summary",
          variant: "destructive",
        });
      }
    };

    if (cart.length > 0) {
      fetchOrderSummary();
    }
  }, [cart, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Validate address before sending
      const requiredFields: (keyof ShippingAddress)[] = ['fullName', 'email', 'address', 'city', 'state', 'country', 'zipCode'];
      const missingFields = requiredFields.filter(field => !address[field]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Error",
          description: `Please fill in all required fields: ${missingFields.join(', ')}`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress: {
            fullName: address.fullName,
            email: address.email,
            phone: address.phone || '',
            address: address.address,
            city: address.city,
            state: address.state,
            country: address.country,
            zipCode: address.zipCode
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create order");
      }

      const data = await response.json();
      router.push(`/payment/${data.orderId}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!orderSummary) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4">
              {orderSummary.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      Size: {item.size} | Quantity: {item.quantity}
                    </p>
                    <p className="text-sm font-medium">
                      ₦{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t mt-6 pt-6 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₦{orderSummary.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₦{orderSummary.total.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                Note: Delivery fee will be paid directly to the delivery driver upon receipt of your order.
              </p>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={address.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={address.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={address.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    value={address.country}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Processing..." : "Complete Order"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
} 