import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { v2 as cloudinary } from "cloudinary";
import {prisma} from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const design = formData.get("design") as string;
    const size = formData.get("size") as string;
    const color = formData.get("color") as string;
    const quantity = parseInt(formData.get("quantity") as string);

    if (!file || !design || !size || !color || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "custom-jerseys",
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    // Create order first
    const order = await prisma.order.create({
      data: {
        userId,
        total: 0, // You might want to calculate this based on your pricing
        status: "PENDING",
      },
    });

    // Create custom jersey order
    const customJersey = await prisma.customJersey.create({
      data: {
        design: JSON.stringify({
          image: (uploadResponse as any).secure_url,
          design,
          color,
        }),
        size,
        color,
        quantity,
        status: "pending",
        orderId: order.id,
      },
    });

    return NextResponse.json(customJersey);
  } catch (error) {
    console.error("Error creating custom jersey:", error);
    return NextResponse.json(
      { error: "Error creating custom jersey" },
      { status: 500 }
    );
  }
} 