import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    console.log("[CHECKOUT_POST] Request body:", body);

    if (!body || !body.shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    const { shippingAddress } = body;

    // Validate required shipping address fields
    const requiredFields = ['fullName', 'email', 'address', 'city', 'state', 'country', 'zipCode'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Get user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate total
    const subtotal = cart.items.reduce(
      (sum: number, item) => sum + (item.product.price * item.quantity),
      0
    );
    const shipping = subtotal > 0 ? 10 : 0;
    const total = subtotal + shipping;

    // Create order with shipping address
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        shippingAddress: {
          create: {
            fullName: shippingAddress.fullName,
            email: shippingAddress.email,
            phone: shippingAddress.phone || '',
            address: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            country: shippingAddress.country,
            zipCode: shippingAddress.zipCode,
          }
        },
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            price: item.product.price
          }))
        }
      }
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return NextResponse.json({ 
      success: true,
      orderId: order.id
    });
  } catch (error) {
    console.error("[CHECKOUT_POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
} 