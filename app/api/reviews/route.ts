import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/reviews - Get approved reviews
export async function GET(req: Request) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        approved: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Submit a review (for authenticated customers with delivered orders)
export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyAuth(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = decoded;

    // Verify user has a DELIVERED order
    const deliveredOrder = await prisma.order.findFirst({
      where: {
        userId,
        status: "DELIVERED",
      },
    });

    if (!deliveredOrder) {
      return NextResponse.json(
        { error: "You can only review after having a delivered order" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { rating, comment, role } = body;

    if (!rating || !comment) {
      return NextResponse.json(
        { error: "Rating and comment are required" },
        { status: 400 }
      );
    }

    const parsedRating = parseInt(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Fetch user details to pre-fill name
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        name: user.name,
        role: role || "Customer",
        rating: parsedRating,
        comment,
        approved: false, // Needs admin approval by default
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
