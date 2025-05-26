import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyAuth(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();
    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid items data" },
        { status: 400 }
      );
    }

    // Fetch product details for each item
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
      },
    });

    // Create a map of products for easy lookup
    const productMap = new Map(
      products.map((product: { id: string; name: string; price: number; images: string[] }) => [product.id, product])
    );

    // Calculate order summary
    const orderItems = items.map((item: { productId: string; quantity: number; size: string }) => {
      const product = productMap.get(item.productId) as { name: string; price: number; images: string[] } | undefined;
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      return {
        product: {
          name: product.name,
          price: product.price,
          images: product.images,
        },
        quantity: item.quantity,
        size: item.size,
      };
    });

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Calculate shipping (you can adjust this logic based on your needs)
    const shipping = subtotal > 100 ? 0 : 10;

    const total = subtotal + shipping;

    return NextResponse.json({
      items: orderItems,
      subtotal,
      shipping,
      total,
    });
  } catch (error) {
    console.error("Error calculating order summary:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
} 