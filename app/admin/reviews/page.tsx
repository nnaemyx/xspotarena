"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Star, CheckCircle, XCircle, Trash2, Plus } from "lucide-react";

interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  image: string;
  approved: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Create Review State
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Customer");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/admin/reviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApprove = async (reviewId: string, currentApproved: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approved: !currentApproved }),
      });

      if (!response.ok) {
        throw new Error("Failed to update approval status");
      }

      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, approved: !currentApproved } : r))
      );

      toast({
        title: "Success",
        description: `Review ${!currentApproved ? "approved" : "unapproved"} successfully`,
      });
    } catch (error) {
      console.error("Error updating review:", error);
      toast({
        title: "Error",
        description: "Failed to update review status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));

      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const handleCreateReview = async () => {
    if (!name.trim() || !comment.trim()) {
      toast({
        title: "Error",
        description: "Name and comment are required",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          role,
          rating,
          comment,
          image: image.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create review");
      }

      toast({
        title: "Success",
        description: "Review created successfully",
      });

      setIsOpen(false);
      setName("");
      setRole("Customer");
      setRating(5);
      setComment("");
      setImage("");
      fetchReviews();
    } catch (error) {
      console.error("Error creating review:", error);
      toast({
        title: "Error",
        description: "Failed to create review",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage customer feedback and add custom testimonials for the homepage.
          </p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-black hover:bg-zinc-800 text-white rounded-lg flex items-center font-semibold text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Review
        </Button>
      </div>

      <div className="grid gap-6">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-zinc-500">
              No reviews found. Click "Add Custom Review" to get started.
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardHeader className="bg-zinc-50/50 py-4 px-6 border-b border-zinc-100">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        review.image ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
                      }
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                    />
                    <div>
                      <CardTitle className="text-base font-bold text-zinc-950">
                        {review.name}
                      </CardTitle>
                      <CardDescription className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-0.5">
                        {review.role}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-zinc-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full ${
                        review.approved
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      }`}
                    >
                      {review.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <p className="text-zinc-600 italic text-sm leading-relaxed">
                    "{review.comment}"
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-2 font-medium">
                    Submitted on {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleApprove(review.id, review.approved)}
                    className="rounded-lg text-xs"
                  >
                    {review.approved ? (
                      <>
                        <XCircle className="h-3.5 w-3.5 mr-1.5 text-yellow-600" />
                        Unapprove
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                        Approve
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteReview(review.id)}
                    className="rounded-lg text-xs flex items-center"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Custom Review Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-150 rounded-2xl shadow-xl text-black">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add Custom Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700">Reviewer Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700">Role / Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Team Manager, Customer, Coach"
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700">Avatar Image URL (Optional)</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700">Review Text</label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write the testimonial content..."
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-none"
              />
            </div>
          </div>
          <DialogFooter className="mt-6 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="rounded-lg text-sm"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateReview}
              className="bg-black hover:bg-zinc-800 text-white rounded-lg text-sm font-semibold"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Save Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
