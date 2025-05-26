import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
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

    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          items: {
            create: []
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("[CART_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
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

    const body = await req.json();
    const { productId, quantity, size } = body;

    if (!productId || !quantity || !size) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId
        }
      });
    }

    // Add item to cart
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        size
      },
      include: {
        product: true
      }
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("[CART_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
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

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");
    console.log("Attempting to delete item:", itemId);

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    // Find the cart first
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true }
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    // Check if the item exists in the cart
    const cartItem = cart.items.find((item: { id: string }) => item.id === itemId);
    if (!cartItem) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CART_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
