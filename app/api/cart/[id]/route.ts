import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyToken } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();

    // Find the cart first
    const cart = await db.collection("carts").findOne({ userId: new ObjectId(userId) });
    console.log("Found cart for deletion:", cart); // Debug log

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    // Remove the specific item from the items array
    const result = await db.collection("carts").updateOne(
      { userId: new ObjectId(userId) },
      { $set: { items: cart.items.filter((item: any) => item._id.toString() !== params.id) } }
    );
    console.log("Delete result:", result); // Debug log

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      { error: "Failed to delete cart item" },
      { status: 500 }
    );
  }
} 