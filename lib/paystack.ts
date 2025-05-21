import { prisma } from "./prisma";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY!;

export async function initializePayment(
  amount: number,
  email: string,
  orderId: string
) {
  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to kobo
        email,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/verify/${orderId}`,
        metadata: {
          order_id: orderId,
        },
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Paystack initialization error:", error);
    throw new Error("Failed to initialize payment");
  }
}

export async function verifyPayment(reference: string) {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Paystack verification error:", error);
    throw new Error("Failed to verify payment");
  }
} 