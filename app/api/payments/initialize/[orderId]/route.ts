import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import https from 'https';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get order details
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "Order is not in a pending state" },
        { status: 400 }
      );
    }

    if (!order.shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address not found" },
        { status: 400 }
      );
    }

    // Initialize Paystack transaction
    const paystackData = {
      amount: Math.round(order.total * 100), // Convert to kobo/cents
      email: order.shippingAddress.email,
      currency: "NGN",
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify/${order.id}`,
      reference: `ORDER-${order.id}-${Date.now()}`,
      metadata: {
        order_id: order.id,
        customer_name: order.shippingAddress.fullName,
        custom_fields: [
          {
            display_name: "Order ID",
            variable_name: "order_id",
            value: order.id
          }
        ]
      }
    };

    // Make request to Paystack
    const paystackResponse = await new Promise<{ status: boolean; data: { authorization_url: string } }>((resolve, reject) => {
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(JSON.stringify(paystackData));
      req.end();
    });

    if (!paystackResponse.status || !paystackResponse.data?.authorization_url) {
      throw new Error("Failed to initialize payment with Paystack");
    }

    // Update order with payment reference
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentReference: paystackData.reference,
      },
    });

    return NextResponse.json({
      paymentUrl: paystackResponse.data.authorization_url
    });
  } catch (error) {
    console.error("[PAYMENT_INITIALIZE] Error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
} 