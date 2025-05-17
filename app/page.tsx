"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import FeaturedProducts from "@/components/FeaturedProducts";
import BlogPosts from "@/components/BlogPosts";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Welcome to XSpot</h1>
            <p className="text-xl mb-8 text-gray-300">
              Your one-stop shop for custom jerseys and sports apparel. Create your unique style today!
            </p>
            <div className="space-x-4">
              <Link href="/products">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Shop Now
                </Button>
              </Link>
              <Link href="/custom-jersey">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  Design Your Jersey
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Custom Designs</h3>
              <p className="text-gray-600">Create your own unique jersey design with our easy-to-use customization tools.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Quality Materials</h3>
              <p className="text-gray-600">Premium quality materials that ensure comfort and durability.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">Quick processing and nationwide delivery to get your jerseys on time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-primary hover:text-primary/80 flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest from Our Blog</h2>
            <Link href="/blog" className="text-primary hover:text-primary/80 flex items-center">
              View All Posts <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <BlogPosts />
        </div>
      </section>
    </div>
  );
}
