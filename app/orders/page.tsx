"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Package, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Order {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  items: {
    product: {
      name: string;
      price: number;
      images: string[];
    };
    quantity: number;
    size: string;
  }[];
  customJersey?: {
    designDescription: string;
    size: string;
    color: string;
    quantity: number;
  };
}

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review Modal State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [reviewerRole, setReviewerRole] = useState("Customer");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your orders");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      if (!data.orders) {
        throw new Error("Invalid response format");
      }
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactSupport = (orderId: string) => {
    window.location.href = `/chat/${orderId}`;
  };

  const handleOpenReviewModal = (order: Order) => {
    setReviewOrder(order);
    setRating(5);
    setComment("");
    setReviewerRole("Customer");
    setIsReviewOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please write a comment",
        variant: "destructive",
      });
      return;
    }

    setSubmittingReview(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Please login again to submit your review",
          variant: "destructive",
        });
        setSubmittingReview(false);
        return;
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          comment,
          role: reviewerRole || "Customer",
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit review");
      }

      toast({
        title: "Success",
        description: "Your review has been submitted for admin approval!",
      });
      setIsReviewOpen(false);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">My Orders</h1>

      {!orders || orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You haven't placed any orders yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-zinc-50 border-b border-zinc-150 py-4 px-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-base md:text-lg break-all">
                      Order #{order.id}
                    </CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Package className="h-3.5 w-3.5 mr-1" />
                      <span>
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-800"
                          : order.status === "PROCESSING"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                    
                    {order.status === "DELIVERED" && (
                      <Button
                        size="sm"
                        className="bg-black hover:bg-zinc-800 text-white rounded-lg text-xs py-1 px-3"
                        onClick={() => handleOpenReviewModal(order)}
                      >
                        <Star className="h-3.5 w-3.5 mr-1.5 fill-current" />
                        Review
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg text-xs py-1 px-3"
                      onClick={() => handleContactSupport(order.id)}
                    >
                      <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                      Support
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {order.items && order.items.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Order Items</h3>
                      <div className="divide-y divide-zinc-100">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
                            <img
                              src={item.product.images[0] || "/placeholder.png"}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg border border-zinc-200"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm md:text-base text-zinc-900 truncate">
                                {item.product.name}
                              </p>
                              <p className="text-xs md:text-sm text-zinc-500 mt-0.5">
                                Size: <span className="font-bold text-zinc-700">{item.size}</span> | Qty: <span className="font-bold text-zinc-700">{item.quantity}</span>
                              </p>
                              <p className="text-xs font-bold text-zinc-900 mt-1">
                                ₦{(item.product.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-zinc-100 pt-4 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-zinc-500">Total paid</span>
                          <span className="text-lg font-black text-black">₦{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {order.customJersey && (
                    <div className="border border-zinc-150 rounded-xl p-4 bg-zinc-50/50 space-y-2 mt-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Custom Jersey Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
                        <div className="col-span-1 sm:col-span-2">
                          <span className="font-medium text-zinc-500">Design Concept:</span>
                          <p className="text-zinc-800 mt-0.5">{order.customJersey.designDescription}</p>
                        </div>
                        <div>
                          <span className="font-medium text-zinc-500">Size:</span>
                          <p className="text-zinc-800 font-semibold">{order.customJersey.size}</p>
                        </div>
                        <div>
                          <span className="font-medium text-zinc-500">Color Spec:</span>
                          <p className="text-zinc-800 font-semibold">{order.customJersey.color}</p>
                        </div>
                        <div>
                          <span className="font-medium text-zinc-500">Quantity:</span>
                          <p className="text-zinc-800 font-semibold">{order.customJersey.quantity}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Leave a Review Modal */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-150 rounded-2xl shadow-xl text-black">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Write a Review</DialogTitle>
          </DialogHeader>
          {reviewOrder && (
            <div className="space-y-4 pt-2">
              <p className="text-xs text-zinc-500">
                Order Reference: #{reviewOrder.id}
              </p>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700">Rating</label>
                <div className="flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="focus:outline-none transition-transform active:scale-95"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors duration-200 ${
                          star <= (hoverRating ?? rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-zinc-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700">Your Role (Optional)</label>
                <input
                  type="text"
                  value={reviewerRole}
                  onChange={(e) => setReviewerRole(e.target.value)}
                  placeholder="e.g. Captain, Player, Fan"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700">Comment</label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you think of the jersey quality, fit, and design?"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-none"
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-6 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsReviewOpen(false)}
              className="rounded-lg text-sm"
              disabled={submittingReview}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              className="bg-black hover:bg-zinc-800 text-white rounded-lg text-sm"
              disabled={submittingReview}
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}