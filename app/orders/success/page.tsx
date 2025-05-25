"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface OrderDetails {
  id: string;
  total: number;
  status: string;
  items: {
    product: {
      name: string;
      price: number;
      images: string[];
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

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // First get the order details
        const orderResponse = await fetch(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!orderResponse.ok) {
          throw new Error("Failed to fetch order");
        }

        const orderData = await orderResponse.json();
        setOrder(orderData);

        // Then verify the payment
        const verifyResponse = await fetch(`/api/payments/verify/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!verifyResponse.ok) {
          throw new Error("Failed to verify payment");
        }

        const verifyData = await verifyResponse.json();
        
        if (verifyData.status === "success") {
          toast({
            title: "Payment Successful",
            description: "Your order has been confirmed",
          });
        } else {
          toast({
            title: "Payment Pending",
            description: "We're still processing your payment",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast({
          title: "Error",
          description: "Failed to verify payment status",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [orderId, router, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Verifying payment...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Order not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={item.product.images[0] || "/placeholder.png"}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    Size: {item.size} | Quantity: {item.quantity}
                  </p>
                  <p className="text-sm">₦{(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₦{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
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
        </Card>

        <div className="text-center">
          <Button
            onClick={() => router.push("/orders")}
            className="mr-4"
          >
            View All Orders
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
} 