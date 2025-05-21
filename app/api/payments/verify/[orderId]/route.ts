import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import https from 'https';

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    // Get the reference from the query parameters
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${params.orderId}?payment=failed`);
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    });

    if (!order) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${params.orderId}?payment=failed`);
    }

    // Verify payment with Paystack
    const verificationResponse = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction/verify/${reference}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });

    const response = verificationResponse as any;

    if (response.status && response.data.status === 'success') {
      // Update order status
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PROCESSING",
          paymentReference: reference,
          paymentDetails: {
            reference: reference,
            amount: response.data.amount / 100,
            paidAt: new Date(response.data.paid_at),
            channel: response.data.channel,
            gateway: "PAYSTACK"
          }
        },
      });

      // Create notification for user
      await prisma.notification.create({
        data: {
          userId: order.userId,
          type: "PAYMENT",
          title: "Payment Successful",
          message: `Payment successful for order #${order.id}`,
          link: `/orders/${order.id}`,
          metadata: { orderId: order.id }
        }
      });

      // Redirect to order details page with success status
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}?payment=success`);
    } else {
      // Update order status to failed
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "CANCELLED"
        },
      });

      // Create notification for user
      await prisma.notification.create({
        data: {
          userId: order.userId,
          type: "PAYMENT",
          title: "Payment Failed",
          message: `Payment failed for order #${order.id}`,
          link: `/orders/${order.id}`,
          metadata: { orderId: order.id }
        }
      });

      // Redirect to order details page with failed status
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}?payment=failed`);
    }
  } catch (error) {
    console.error("[PAYMENT_VERIFY] Error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/orders/${params.orderId}?payment=error`);
  }
} 