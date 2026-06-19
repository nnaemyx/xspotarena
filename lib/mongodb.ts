import { MongoClient, Db } from "mongodb";

function cleanDatabaseUrl(url: string | undefined): string {
  const defaultUrl = "mongodb://localhost:27017/calcio-threads";
  if (!url) {
    return defaultUrl;
  }

  // Strip wrapping quotes
  let cleanUrl = url.trim().replace(/^["']|["']$/g, "");

  try {
    if (cleanUrl.startsWith("mongodb://") || cleanUrl.startsWith("mongodb+srv://")) {
      const parsedUrl = new URL(cleanUrl);
      if (parsedUrl.pathname === "/" || parsedUrl.pathname === "") {
        parsedUrl.pathname = "/calcio-threads";
        return parsedUrl.toString();
      }
    }
    return cleanUrl;
  } catch (error) {
    console.error("Error parsing DATABASE_URL:", error);
    return cleanUrl;
  }
}

// Override the environment variable in-memory
process.env.DATABASE_URL = cleanDatabaseUrl(process.env.DATABASE_URL);

const uri = process.env.DATABASE_URL;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise!;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase(): Promise<{ db: Db }> {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "calcio-threads");
  return { db };
}