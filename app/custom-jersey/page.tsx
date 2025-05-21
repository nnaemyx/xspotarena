"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Loader2 } from "lucide-react";

export default function CustomJerseyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a design image",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      formData.append("file", selectedFile);

      // First upload the image
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error("Failed to upload image");
      const { url: imageUrl } = await uploadResponse.json();

      // Then submit the custom jersey request
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Please login",
          description: "You need to login to submit a custom jersey request",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/custom-jerseys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          designImage: imageUrl,
          description: formData.get("description"),
          size: formData.get("size"),
          quantity: parseInt(formData.get("quantity") as string),
        }),
      });

      console.log("Form data:", {
        description: formData.get("description"),
        size: formData.get("size"),
        quantity: formData.get("quantity"),
      });

      if (!response.ok) throw new Error("Failed to submit request");

      toast({
        title: "Success",
        description: "Your custom jersey request has been submitted",
      });
      router.push("/orders");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: "Failed to submit custom jersey request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Design Your Custom Jersey</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium">Design Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Selected design"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div
                  className="cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Click to select your design
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label htmlFor="description" className="block text-sm font-medium">
              Design Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your design ideas, colors, and any specific requirements..."
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label htmlFor="size" className="block text-sm font-medium">
                Size
              </label>
              <Select name="size" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">Small</SelectItem>
                  <SelectItem value="M">Medium</SelectItem>
                  <SelectItem value="L">Large</SelectItem>
                  <SelectItem value="XL">X-Large</SelectItem>
                  <SelectItem value="XXL">XX-Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <label htmlFor="quantity" className="block text-sm font-medium">
                Quantity
              </label>
              <Input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                required
                placeholder="Enter quantity"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
} 