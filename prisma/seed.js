const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

function cleanDatabaseUrl(url) {
  const defaultUrl = "mongodb://localhost:27017/calcio-threads";
  if (!url) return defaultUrl;
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
    console.error("Error parsing URL:", error);
    return cleanUrl;
  }
}

process.env.DATABASE_URL = cleanDatabaseUrl(process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  try {
    // 1. Clear existing data
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.customJersey.deleteMany({});
    await prisma.customJerseyRequest.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.blogPost.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("Cleared old collections successfully.");

    // 2. Create Admin and Regular Users
    const adminPassword = await bcrypt.hash("password123", 10);
    const userPassword = await bcrypt.hash("password123", 10);

    const admin = await prisma.user.create({
      data: {
        name: "Calcio Admin",
        email: "admin@calciothreads.com",
        password: adminPassword,
        phone: "08012345678",
        state: "Lagos",
        role: "ADMIN",
        isVerified: true
      }
    });

    const regularUser = await prisma.user.create({
      data: {
        name: "Ngozi Obi",
        email: "user@calciothreads.com",
        password: userPassword,
        phone: "08087654321",
        state: "Abuja",
        role: "USER",
        isVerified: true
      }
    });

    console.log("Created users:", { admin: admin.email, user: regularUser.email });

    // 3. Create Products
    const productsData = [
      {
        name: "Arsenal 2003/04 Invincibles Retro Jersey",
        description: "The historic unbeaten season jersey. Premium retro details, embroidered crest, gold sleeve stitching.",
        price: 25000,
        images: ["https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop"],
        category: "RETRO_JERSEYS",
        sizes: ["S", "M", "L", "XL"],
        stockStatus: "IN_STOCK",
        stock: 15,
        userId: admin.id
      },
      {
        name: "Real Madrid 2024/25 Home Jersey",
        description: "Official home kit for the Galacticos. Classic white with gold detailing and dry-fit performance fabric.",
        price: 32000,
        images: ["https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop"],
        category: "HOME_JERSEYS",
        sizes: ["M", "L", "XL"],
        stockStatus: "IN_STOCK",
        stock: 30,
        userId: admin.id
      },
      {
        name: "Nigeria Super Eagles 2024 Home Jersey",
        description: "The proud green and white of Nigeria. Stunning geometric patterns, lightweight and ultra-breathable.",
        price: 28000,
        images: ["https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop"],
        category: "HOME_JERSEYS",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stockStatus: "IN_STOCK",
        stock: 25,
        userId: admin.id
      },
      {
        name: "Barcelona 2024/25 Away Black Edition",
        description: "Limited edition black and gold away kit. Minimalist shield design, athletic fit.",
        price: 35000,
        images: ["https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop"],
        category: "AWAY_JERSEYS",
        sizes: ["S", "M", "L"],
        stockStatus: "IN_STOCK",
        stock: 12,
        userId: admin.id
      }
    ];

    for (const prod of productsData) {
      await prisma.product.create({ data: prod });
    }
    console.log("Seeded products successfully.");

    // 4. Create Blog Posts
    const blogData = [
      {
        title: "The Art of the Football Kit: Style on the Pitch",
        slug: "art-of-football-kit-style",
        content: "Football jerseys have evolved from simple heavy cotton shirts into iconic fashion pieces. Today, kits represent a merge of lifestyle, streetwear, and performance technology...",
        excerpt: "Discover how football kits transitioned from pure sportswear to global fashion statements.",
        image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
        published: true,
        authorId: admin.id
      },
      {
        title: "Top 5 Retro Football Jerseys You Need in Your Collection",
        slug: "top-5-retro-football-jerseys",
        content: "From the iconic Arsenal 'Bruised Banana' to Nigeria's legendary 1996 Atlanta Olympics kit, retro jerseys are highly sought after by collectors. Here is our selection of the top 5 retro shirts...",
        excerpt: "A curated list of the most iconic retro jerseys that are essential for any football kit collector.",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
        published: true,
        authorId: admin.id
      }
    ];

    for (const post of blogData) {
      await prisma.blogPost.create({ data: post });
    }
    console.log("Seeded blog posts successfully.");
    console.log("DATABASE SEEDING SUCCESSFUL!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
