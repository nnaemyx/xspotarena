import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = await verifyAuth(token);
    const userId = decoded.userId;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    const messages = await prisma.message.findMany({
      where: {
        userId,
        ...(orderId ? { orderId } : {}),
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching messages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = await verifyAuth(token);
    const userId = decoded.userId;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, orderId } = body;

    const message = await prisma.message.create({
      data: {
        content,
        userId,
        orderId,
      },
    });

    // Create notification for admin
    await prisma.notification.create({
      data: {
        userId,
        message: `New message from user regarding order ${orderId}`,
        type: "MESSAGE"
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: "Error sending message" }, { status: 500 });
  }
} 