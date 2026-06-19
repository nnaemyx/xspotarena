if (!process.env.JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
}

const SECRET = process.env.JWT_SECRET!;

// Helper to decode Base64Url
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return typeof atob === "function" 
    ? atob(base64) 
    : Buffer.from(base64, "base64").toString("binary");
}

// Verification function using standard Web Crypto API (supported in Node & Edge)
async function verifyJwtSignature(token: string): Promise<any> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  const encoder = new TextEncoder();
  
  // Import the secret key
  const secretKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  // Decode the signature base64url to bytes
  const signatureBinary = base64UrlDecode(signatureB64);
  const signatureBytes = new Uint8Array(signatureBinary.length);
  for (let i = 0; i < signatureBinary.length; i++) {
    signatureBytes[i] = signatureBinary.charCodeAt(i);
  }

  // Verify the signature against header + payload data
  const data = encoder.encode(`${headerB64}.${payloadB64}`);
  const isValid = await crypto.subtle.verify(
    "HMAC",
    secretKey,
    signatureBytes,
    data
  );

  if (!isValid) {
    throw new Error("Invalid signature");
  }

  // Decode and parse payload
  const payloadJson = base64UrlDecode(payloadB64);
  return JSON.parse(payloadJson);
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const decoded = await verifyJwtSignature(token);
    return decoded.userId || null;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function verifyAuth(token: string) {
  try {
    const decoded = await verifyJwtSignature(token) as {
      userId: string;
      email: string;
      role: string;
    };
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}