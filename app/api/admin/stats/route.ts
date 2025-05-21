import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await verifyAuth(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get total number of products
    const totalProducts = await prisma.product.count();

    // Get total number of orders
    const totalOrders = await prisma.order.count();

    // Get total number of users (customers)
    const totalCustomers = await prisma.user.count({
      where: {
        role: "USER",
      },
    });

    // Get total number of messages
    const totalMessages = await prisma.message.count();

    // Get recent orders for chart
    const recentOrders = await prisma.order.groupBy({
      by: ['createdAt'],
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 7,
    }).then(orders => orders.map(order => ({
      date: new Date(order.createdAt).toLocaleDateString(),
      total: order._count.id,
    })));

    // Get order status distribution
    const orderStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    }).then(statuses => statuses.map(status => ({
      status: status.status,
      count: status._count.id,
    })));

    return NextResponse.json({
      totalProducts,
      totalCustomers,
      totalOrders,
      totalMessages,
      recentOrders,
      orderStatus,
    });
  } catch (error) {
    console.error("[STATS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 