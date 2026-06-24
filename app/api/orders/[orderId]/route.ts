import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await verifyAuth(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
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

    // Check if user is authorized to view this order
    if (order.userId !== decoded.userId && decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Provide fallback for deleted/archived products to avoid frontend crashes
    const transformedOrder = {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: item.product || {
          name: "Archive Product",
          price: item.price,
          images: ["/placeholder.png"],
          description: "This product has been removed from the active catalog.",
          category: "HOME_JERSEYS",
          sizes: ["M"],
          stockStatus: "OUT_OF_STOCK",
          stock: 0,
        },
      })),
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 