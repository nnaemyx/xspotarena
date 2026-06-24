"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Copy, CheckCircle, Package, MapPin, CreditCard } from "lucide-react";

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
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  const [copied, setCopied] = useState(false);

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

  const handleWhatsAppPayment = () => {
    if (!order) return;

    const itemsList = order.items
      .map(
        (item) =>
          `• ${item.product.name} (Size: ${item.size}, Qty: ${item.quantity}) — ₦${(item.product.price * item.quantity).toLocaleString()}`
      )
      .join("\n");

    const message = `Hello Calcio Threads! 👋\n\nI've placed an order and would like to complete my payment via bank transfer.\n\n📦 *Order #${order.id.slice(-6)}*\n\n${itemsList}\n\n💰 *Total: ₦${order.total.toLocaleString()}*\n\n📍 Ship to: ${order.shippingAddress.fullName}, ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}\n\nPlease share the bank details for transfer. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const copyOrderId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    toast({ title: "Copied!", description: "Order ID copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm text-zinc-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      {/* Success Banner */}
      <div className="bg-emerald-50 border border-emerald-200 p-6 mb-8 flex items-start gap-4">
        <div className="p-2 bg-emerald-100 rounded-full shrink-0 mt-0.5">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-lg font-black text-emerald-900 uppercase tracking-tight">Order Placed Successfully!</h1>
          <p className="text-sm text-emerald-700 mt-1">
            Your order has been received. Complete payment via WhatsApp to confirm your order.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-emerald-600 font-medium">Order ID: #{order.id.slice(-6)}</span>
            <button
              onClick={copyOrderId}
              className="text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              {copied ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Order Summary — Left Column */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border border-zinc-200 rounded-none shadow-sm overflow-hidden">
            <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-200 flex items-center gap-2">
              <Package className="h-4 w-4 text-black" />
              <h2 className="text-xs font-black uppercase tracking-wider text-black">Order Items</h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-5">
                  <img
                    src={item.product.images[0] || "/placeholder.png"}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover border border-zinc-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-zinc-900 truncate">{item.product.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Size: {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-black whitespace-nowrap">
                    ₦{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-50 px-6 py-4 border-t border-zinc-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total</span>
                <span className="text-xl font-black text-black">₦{order.total.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Shipping Info */}
          <Card className="border border-zinc-200 rounded-none shadow-sm overflow-hidden">
            <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-200 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-black" />
              <h2 className="text-xs font-black uppercase tracking-wider text-black">Shipping Details</h2>
            </div>
            <div className="p-6 space-y-2">
              <p className="text-sm font-bold text-zinc-900">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-zinc-600">{order.shippingAddress.address}</p>
              <p className="text-sm text-zinc-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-sm text-zinc-600">{order.shippingAddress.country}</p>
            </div>
          </Card>
        </div>

        {/* Payment Action — Right Column */}
        <div className="lg:col-span-2">
          <Card className="border border-zinc-200 rounded-none shadow-sm overflow-hidden sticky top-24">
            <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-200 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-black" />
              <h2 className="text-xs font-black uppercase tracking-wider text-black">Complete Payment</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Steps */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Click the button below</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Opens a WhatsApp chat with our sales team</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Receive bank details</p>
                    <p className="text-xs text-zinc-500 mt-0.5">We'll share our account info for bank transfer</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Send payment confirmation</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Share proof of transfer and we'll process your order</p>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-zinc-50 border border-zinc-200 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500 uppercase">Amount Due</span>
                  <span className="text-lg font-black text-black">₦{order.total.toLocaleString()}</span>
                </div>
              </div>

              {/* WhatsApp Button */}
              <Button
                onClick={handleWhatsAppPayment}
                className="w-full bg-[#25D366] hover:bg-[#1fb855] text-white font-bold text-sm rounded-none h-12 transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Pay via WhatsApp
              </Button>

              <p className="text-[10px] text-zinc-400 text-center leading-relaxed">
                Secure payment via bank transfer. Your order will be confirmed once payment is verified.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}