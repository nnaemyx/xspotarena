import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retryOperation<T>(operation: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && error instanceof Error && error.message.includes('connection')) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryOperation(operation, retries - 1);
    }
    throw error;
  }
}

type OrderWithRelations = {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
    email: string;
  };
  items: Array<{
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    size: string;
    price: number;
    product: {
      name: string;
      images: string[];
    };
  }>;
  shippingAddress: {
    address: string;
    phone: string;
    state: string;
  } | null;
};

export async function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
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

    const orders = await retryOperation(async () => {
      return await prisma.order.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: true,
                },
              },
            },
          },
          shippingAddress: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }) as OrderWithRelations[];
    });

    const transformedOrders = orders.map((order: OrderWithRelations) => ({
      id: order.id,
      userId: order.userId,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      user: order.user,
      items: order.items.map((item) => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
      })),
      shippingDetails: order.shippingAddress,
    }));

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error("Error in GET /api/admin/orders:", error);
    
    if (error instanceof Error && error.message.includes('connection')) {
      return NextResponse.json(
        { error: "Database connection error. Please try again." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 