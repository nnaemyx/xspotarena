"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

function VerifyEmailContent() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const email = searchParams.get("email");

  useEffect(() => {
    if (email) {
      toast({
        title: "Verification Required",
        description: `Please enter the verification code sent to ${email}`,
        duration: 5000,
      });
    }
  }, [email, toast]);

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Invalid Verification Link</h1>
          <p className="mt-2">Please use the link from your email.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      toast({
        title: "Email Verified!",
        description: "Your email has been verified successfully. You can now login.",
        duration: 5000,
      });

      // Wait for 2 seconds to show the toast before redirecting
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend code",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Verify Your Email</h2>
          <p className="mt-2 text-gray-600">
            Enter the verification code sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="code" className="sr-only">
              Verification Code
            </label>
            <Input
              id="code"
              name="code"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter verification code"
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>

          <div className="text-center text-sm">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              className="font-medium text-primary hover:text-primary/80"
            >
              Resend Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">
      <div className="text-center">Loading...</div>
    </div>}>
      <VerifyEmailContent />
    </Suspense>
  );
} 