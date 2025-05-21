"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const heroImages = [
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=2070&auto=format&fit=crop",
];

export default function Hero() {
  return (
    <section className="relative h-[90vh] md:h-[80vh] overflow-hidden">
      <Carousel 
        className="w-full h-full" 
        autoPlay={true}
        autoPlayInterval={3000}
        opts={{
          loop: true,
          dragFree: false,
          containScroll: "trimSnaps"
        }}
      >
        <CarouselContent>
          {heroImages.map((image, index) => (
            <CarouselItem key={index} className="h-[90vh] md:h-[80vh]">
              <div className="relative w-full h-full">
                <img
                  src={image}
                  alt={`Jersey ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6">Welcome to <span className="text-[#FFD700]">XSpot Arena</span></h1>
            <p className="text-lg md:text-xl mb-6 md:mb-8 text-gray-200">
              Your one-stop shop for custom jerseys and sports apparel. Create your unique style today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-[200px] md:w-auto bg-white text-black">
                  Shop Now
                </Button>
              </Link>
              {/* <Link href="/custom-jersey" className="w-full sm:w-auto hidden md:block">
                <Button size="lg" variant="outline" className="w-full border-white text-[#FFD700] bg-black hover:bg-white hover:text-gray-900">
                  Design Your Jersey
                </Button>
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 