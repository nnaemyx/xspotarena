"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrderDetails {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  paymentReference: string;
  paymentDetails: {
    reference: string;
    amount: number;
    paidAt: string;
    channel: string;
    gateway: string;
  };
  items: {
    product: {
      name: string;
      images: string[];
      price: number;
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

export default function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router, toast]);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      toast({
        title: "Payment Successful",
        description: "Your order has been confirmed and is being processed.",
      });
    } else if (paymentStatus === "failed") {
      toast({
        title: "Payment Failed",
        description: "There was an issue with your payment. Please try again.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!order) {
    return <div className="container mx-auto px-4 py-8">Order not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "PROCESSING":
        return "bg-blue-500";
      case "SHIPPED":
        return "bg-purple-500";
      case "DELIVERED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <Badge className={`${getStatusColor(order.status)} text-white`}>
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">${order.total.toFixed(2)}</p>
              </div>
              {order.paymentReference && (
                <div>
                  <p className="text-sm text-gray-500">Payment Reference</p>
                  <p className="font-medium">{order.paymentReference}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{order.shippingAddress.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{order.shippingAddress.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">City, State, ZIP</p>
                <p className="font-medium">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-medium">{order.shippingAddress.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img
                  src={item.product.images[0] || "/placeholder.png"}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity}x - Size: {item.size}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${item.product.price.toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => router.push("/orders")}
        >
          Back to Orders
        </Button>
        {order.status === "PENDING" && (
          <Button
            onClick={() => router.push(`/payment/${order.id}`)}
          >
            Pay Now
          </Button>
        )}
      </div>
    </div>
  );
} 