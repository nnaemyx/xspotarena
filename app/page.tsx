"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import FeaturedProducts from "@/components/FeaturedProducts";
import BlogPosts from "@/components/BlogPosts";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <main>
      <Hero />
      <section className="py-16 md:py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <FeaturedProducts />
        </div>
      </section>
      <Features />
      <WhyChooseUs />
      <section className="py-16 md:py-20 bg-zinc-50 border-t border-zinc-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-black" /> From the Dugout
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-black tracking-tight">Latest from Our Blog</h2>
            <div className="h-px w-12 bg-black mx-auto mt-4" />
          </div>
          <BlogPosts />
        </div>
      </section>
    </main>
  );
}
