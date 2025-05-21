import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown as { userId: string };
    return decoded.userId;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function verifyAuth(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown as {
      userId: string;
      email: string;
      role: string;
    };
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
} 