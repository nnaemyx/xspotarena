import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              Premium Jerseys for Every Fan
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              Discover our collection of high-quality jerseys. From sports teams to
              custom designs, we've got you covered.
            </p>
            <div className="flex gap-4">
              <Link
                href="/products"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Shop Now
              </Link>
              <Link
                href="/custom-jersey"
                className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Design Your Own
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px]">
            <Image
              src="/hero-jersey.jpg"
              alt="Premium Jersey Collection"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
} 