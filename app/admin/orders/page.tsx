"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface Order {
  id: string;
  userId: string;
  status: string;
  total: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  items: {
    id: string;
    product: {
      name: string;
      images: string[];
    };
    quantity: number;
    size: string;
    price: number;
  }[];
  shippingDetails: {
    address: string;
    phone: string;
    state: string;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/admin/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router, toast]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Order #{order.id.slice(-6)}</CardTitle>
                  <CardDescription>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Select
                  value={order.status}
                  onValueChange={(value) => handleStatusChange(order.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Customer Details</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {order.user.name}</p>
                    <p><span className="font-medium">Email:</span> {order.user.email}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Shipping Details</h3>
                  <div className="space-y-1 text-sm">
                    {order.shippingDetails ? (
                      <>
                        <p><span className="font-medium">Address:</span> {order.shippingDetails.address}</p>
                        <p><span className="font-medium">Phone:</span> {order.shippingDetails.phone}</p>
                        <p><span className="font-medium">State:</span> {order.shippingDetails.state}</p>
                      </>
                    ) : (
                      <p className="text-gray-500">No shipping details available</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} | Size: {item.size}
                          </p>
                          <p className="text-sm text-gray-500">
                            Price: ₦{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Total: ₦{order.total.toLocaleString()}</p>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-medium">#{selectedOrder.id.slice(-6)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p
                    className={`font-medium ${
                      selectedOrder.status === "DELIVERED"
                        ? "text-green-600"
                        : selectedOrder.status === "PROCESSING"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {selectedOrder.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">
                    ₦{selectedOrder.total.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Customer Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedOrder.user.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.user.email}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Shipping Details</h3>
                <div className="space-y-2">
                  {selectedOrder.shippingDetails ? (
                    <>
                      <p><span className="font-medium">Address:</span> {selectedOrder.shippingDetails.address}</p>
                      <p><span className="font-medium">Phone:</span> {selectedOrder.shippingDetails.phone}</p>
                      <p><span className="font-medium">State:</span> {selectedOrder.shippingDetails.state}</p>
                    </>
                  ) : (
                    <p className="text-gray-500">No shipping details available</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} | Size: {item.size}
                        </p>
                        <p className="text-sm text-gray-500">
                          Price: ₦{item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-medium">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 