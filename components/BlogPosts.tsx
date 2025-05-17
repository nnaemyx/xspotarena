"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "How to Choose the Perfect Jersey for Your Team",
    excerpt: "Learn the key factors to consider when selecting jerseys for your sports team...",
    image: "/images/blog/choosing-jersey.jpg",
    date: "2024-03-15",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "The Evolution of Sports Jersey Design",
    excerpt: "Explore how jersey designs have evolved over the years and what's trending now...",
    image: "/images/blog/jersey-evolution.jpg",
    date: "2024-03-10",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Custom Jersey Design Tips and Tricks",
    excerpt: "Expert advice on creating eye-catching custom jersey designs that stand out...",
    image: "/images/blog/design-tips.jpg",
    date: "2024-03-05",
    readTime: "6 min read",
  },
];

export default function BlogPosts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogPosts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="relative h-48 w-full">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(post.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.readTime}
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
            <p className="text-gray-600">{post.excerpt}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link
              href={`/blog/${post.id}`}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Read More →
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 