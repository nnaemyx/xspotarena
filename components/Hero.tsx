"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ArrowRight, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

const heroImages = [
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop",
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] mt-16 md:mt-20 overflow-hidden bg-zinc-950">
      <Carousel 
        className="w-full h-full" 
        autoPlay={true}
        autoPlayInterval={5000}
        opts={{
          loop: true,
          dragFree: false,
          containScroll: "trimSnaps"
        }}
      >
        <CarouselContent>
          {heroImages.map((image, index) => (
            <CarouselItem key={index} className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
              <div className="relative w-full h-full bg-zinc-900">
                <img
                  src={image}
                  alt={`Jersey Banner ${index + 1}`}
                  className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-[10000ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center z-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl text-white">
            <div
              className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6 hover:bg-white/20 transition-all duration-500 ${
                mounted ? 'animate-fade-in-up' : 'opacity-0'
              }`}
            >
              <Trophy className="h-3.5 w-3.5 text-white" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">The New Era of Custom Kits</span>
            </div>
            
            <h1
              className={`text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-[1.05] tracking-tight uppercase ${
                mounted ? 'animate-fade-in-up animation-delay-100' : 'opacity-0'
              }`}
            >
              Orchestrate Style. <br />
              <span className="text-gradient-hero">Calcio Threads</span>
            </h1>
            
            <p
              className={`text-base md:text-lg mb-8 text-zinc-300 max-w-lg leading-relaxed ${
                mounted ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'
              }`}
            >
              Premium tailored football jerseys and retro classics. Engineered with elite materials, designed for absolute control.
            </p>
            
            <div
              className={`flex flex-col sm:flex-row gap-4 ${
                mounted ? 'animate-fade-in-up animation-delay-300' : 'opacity-0'
              }`}
            >
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-zinc-100 text-black font-bold tracking-wider uppercase transition-all duration-300 rounded-none h-14 px-8 border border-white hover:shadow-lg hover:shadow-white/10">
                  Explore Collection
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/custom-jersey" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 hover:border-white text-white bg-transparent hover:bg-white/10 transition-all duration-300 rounded-none h-14 px-8">
                  Custom Studio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 ${mounted ? 'animate-fade-in animation-delay-600' : 'opacity-0'}`}>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2.5 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>

      <style jsx>{`
        .text-gradient-hero {
          background: linear-gradient(135deg, #e4e4e7 0%, #a1a1aa 50%, #e4e4e7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </section>
  );
}