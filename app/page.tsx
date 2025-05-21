"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brush, Package, Truck, Star, Shield, Heart } from "lucide-react";
import FeaturedProducts from "@/components/FeaturedProducts";
import BlogPosts from "@/components/BlogPosts";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  const heroImages = [
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop",
  ];

  return (
    <main>
      <Hero />
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <FeaturedProducts />
        </div>
      </section>
      <Features />
      <WhyChooseUs />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Latest from Our Blog</h2>
          <BlogPosts />
        </div>
      </section>
    </main>
  );
}
