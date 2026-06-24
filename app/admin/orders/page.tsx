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
import { ShoppingCart, Eye, Package, Truck, CheckCircle, XCircle, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

const getStatusConfig = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle, label: "Delivered" };
    case "PROCESSING":
      return { color: "bg-blue-50 text-blue-700 border-blue-200", icon: Package, label: "Processing" };
    case "SHIPPED":
      return { color: "bg-purple-50 text-purple-700 border-purple-200", icon: Truck, label: "Shipped" };
    case "CANCELLED":
      return { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle, label: "Cancelled" };
    default:
      return { color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock, label: "Pending" };
  }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
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

  const filteredOrders = filterStatus === "ALL" ? orders : orders.filter(o => o.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5 mb-1.5">
            <ShoppingCart className="h-3.5 w-3.5 text-black" /> Order Management
          </span>
          <h1 className="text-3xl font-black uppercase text-black tracking-tight">All Orders</h1>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px] rounded-none border-zinc-200 text-xs font-bold uppercase tracking-wider">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Orders</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Badge className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-none uppercase tracking-widest">
            {filteredOrders.length} Orders
          </Badge>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-300 bg-zinc-50/50">
            <ShoppingCart className="h-8 w-8 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm text-zinc-500 font-medium">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            return (
              <div key={order.id} className="bg-white border border-zinc-200 hover:border-zinc-400 transition-colors overflow-hidden">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-zinc-50/50 border-b border-zinc-100">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-black">Order #{order.id.slice(-6)}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-full ${statusConfig.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-full sm:w-[160px] rounded-none border-zinc-200 text-xs font-bold">
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

                {/* Order Content */}
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Customer */}
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Customer</p>
                      <p className="text-sm font-bold text-zinc-900">{order.user.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{order.user.email}</p>
                    </div>

                    {/* Shipping */}
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Shipping</p>
                      {order.shippingDetails ? (
                        <div className="space-y-0.5">
                          <p className="text-xs text-zinc-700">{order.shippingDetails.address}</p>
                          <p className="text-xs text-zinc-500">{order.shippingDetails.phone}</p>
                          <p className="text-xs text-zinc-500">{order.shippingDetails.state}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-400 italic">No shipping details</p>
                      )}
                    </div>

                    {/* Items Preview */}
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Items ({order.items.length})</p>
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 4).map((item) => (
                          <img
                            key={item.id}
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-10 h-10 object-cover border-2 border-white"
                            title={item.product.name}
                          />
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-10 h-10 bg-zinc-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-zinc-600">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center mt-5 pt-4 border-t border-zinc-100">
                    <p className="text-lg font-black text-black">₦{order.total.toLocaleString()}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-none border-zinc-200 hover:border-black text-xs font-bold uppercase tracking-wider"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl bg-white border border-zinc-200 rounded-none shadow-xl text-black">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase tracking-tight">Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Order Number</p>
                  <p className="text-sm font-bold">#{selectedOrder.id.slice(-6)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Date</p>
                  <p className="text-sm font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Status</p>
                  {(() => {
                    const cfg = getStatusConfig(selectedOrder.status);
                    const Icon = cfg.icon;
                    return (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-full ${cfg.color}`}>
                        <Icon className="h-3 w-3" /> {cfg.label}
                      </span>
                    );
                  })()}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Total</p>
                  <p className="text-sm font-black">₦{selectedOrder.total.toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Customer Information</p>
                <div className="space-y-1">
                  <p className="text-sm"><span className="font-bold">Name:</span> {selectedOrder.user.name}</p>
                  <p className="text-sm"><span className="font-bold">Email:</span> {selectedOrder.user.email}</p>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Shipping Details</p>
                <div className="space-y-1">
                  {selectedOrder.shippingDetails ? (
                    <>
                      <p className="text-sm"><span className="font-bold">Address:</span> {selectedOrder.shippingDetails.address}</p>
                      <p className="text-sm"><span className="font-bold">Phone:</span> {selectedOrder.shippingDetails.phone}</p>
                      <p className="text-sm"><span className="font-bold">State:</span> {selectedOrder.shippingDetails.state}</p>
                    </>
                  ) : (
                    <p className="text-sm text-zinc-400 italic">No shipping details available</p>
                  )}
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Items</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-zinc-50 border border-zinc-100">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover border border-zinc-200"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold">{item.product.name}</p>
                        <p className="text-xs text-zinc-500">
                          Qty: {item.quantity} · Size: {item.size}
                        </p>
                      </div>
                      <p className="text-sm font-bold">
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