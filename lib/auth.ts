import { verify } from "jsonwebtoken";

export async function verifyAuth(token: string) {
  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
} 