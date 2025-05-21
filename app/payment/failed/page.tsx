"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-8">
          We couldn't process your payment. Please try again or contact support if the problem persists.
        </p>
        <div className="space-y-4">
          <Button
            onClick={() => router.back()}
            className="w-full"
          >
            Try Again
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
} 