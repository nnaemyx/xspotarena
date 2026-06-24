import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/orders
export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyAuth(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: decoded.userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: true,
              },
            },
          },
        },
        customJersey: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Provide fallback for deleted/archived products to avoid frontend crashes
    const transformedOrders = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: item.product || {
          name: "Archive Product",
          price: item.price,
          images: ["/placeholder.png"],
        },
      })),
    }));

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
} 