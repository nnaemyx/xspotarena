"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface OrderDetails {
  id: string;
  total: number;
  status: string;
  items: {
    product: {
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
    size: string;
  }[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export default function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      try {
        const { orderId } = await params;
        setOrderId(orderId);
      } catch (error) {
        console.error("Error getting order ID:", error);
        toast({
          title: "Error",
          description: "Failed to load order",
          variant: "destructive",
        });
      }
    };
    init();
  }, [params, toast]);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }

        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        });
      }
    };

    fetchOrder();
  }, [orderId, router, toast]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Initialize payment
      const response = await fetch(`/api/payments/initialize/${orderId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to initialize payment");
      }

      const { paymentUrl } = await response.json();
      
      // Redirect to payment page
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Complete Your Payment</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Size: {item.size} | Quantity: {item.quantity}
                    </p>
                    <p className="text-sm">${item.product.price * item.quantity}</p>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.total}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
              <p><strong>Address:</strong> {order.shippingAddress.address}</p>
              <p>
                <strong>City:</strong> {order.shippingAddress.city},{" "}
                {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p><strong>Country:</strong> {order.shippingAddress.country}</p>
            </div>

            <Button
              onClick={handlePayment}
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
} 