import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyAuth(token);
    const data = await req.json();

    // Validate required fields
    if (!data.designImage || !data.description || !data.size || !data.quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const customJersey = await prisma.customJerseyRequest.create({
      data: {
        designImage: data.designImage,
        description: data.description,
        size: data.size,
        quantity: parseInt(data.quantity),
        status: "PENDING",
        user: {
          connect: {
            id: decoded.userId
          }
        }
      },
    });

    return NextResponse.json(customJersey);
  } catch (error) {
    console.error("Error creating custom jersey request:", error);
    return NextResponse.json(
      { error: "Failed to create custom jersey request" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await verifyAuth(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const requests = await prisma.customJerseyRequest.findMany({
      where: {
        userId: decoded.userId,
      },
      include: {
        messages: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 2,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching custom jersey requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
} 