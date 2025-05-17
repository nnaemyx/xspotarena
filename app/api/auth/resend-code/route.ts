import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new code
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: verificationCode,
        otpExpiry: verificationCodeExpires,
      },
    });

    // Send new verification email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json(
      { message: "Verification code resent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Resend code error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while resending the code" },
      { status: 500 }
    );
  }
} 