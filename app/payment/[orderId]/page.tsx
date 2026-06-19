"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Replace this with your actual WhatsApp Business phone number (with country code, e.g. "2348012345678")
const WHATSAPP_NUMBER = "2349046764236";

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

  const handleWhatsAppPayment = () => {
    if (!order) return;
    const message = `Hello Calcio Threads! I've placed order #${order.id} for ₦${order.total.toLocaleString()} and would like to complete my payment via bank transfer.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
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
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-2 mb-6">
              <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
              <p><strong>Address:</strong> {order.shippingAddress.address}</p>
              <p>
                <strong>City:</strong> {order.shippingAddress.city},{" "}
                {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p><strong>Country:</strong> {order.shippingAddress.country}</p>
            </div>

            <div className="border-t pt-6 space-y-4">
              <h3 className="text-base font-bold text-zinc-900">Select Payment Method</h3>

              {/* Option 1: Paystack */}
              <div className="p-4 border border-zinc-200 hover:border-black rounded-lg transition duration-200">
                <h4 className="font-bold text-sm text-black mb-1">Pay Online Instantly</h4>
                <p className="text-xs text-zinc-500 mb-4">Secure checkout via Card, USSD, or Bank Transfer using Paystack.</p>
                <Button
                  onClick={handlePayment}
                  className="w-full bg-black hover:bg-zinc-800 text-white font-semibold rounded-none"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Pay with Card / Paystack"}
                </Button>
              </div>

              {/* Option 2: WhatsApp Bank Transfer */}
              <div className="p-4 border border-zinc-200 hover:border-emerald-500 rounded-lg transition duration-200">
                <h4 className="font-bold text-sm text-black mb-1">Pay via Bank Transfer on WhatsApp</h4>
                <p className="text-xs text-zinc-500 mb-4">Conclude your purchase manually by chatting with our sales desk on WhatsApp.</p>
                <Button
                  onClick={handleWhatsAppPayment}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-none"
                >
                  Pay via WhatsApp
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 