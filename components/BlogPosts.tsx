"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  createdAt: string;
  author: {
    name: string;
  };
}

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog?limit=3");
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-zinc-100 h-52 mb-4 border border-zinc-200" />
            <div className="h-3 bg-zinc-200 rounded w-1/4 mb-3" />
            <div className="h-5 bg-zinc-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-zinc-200 rounded w-full mb-2" />
            <div className="h-4 bg-zinc-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <Link
          key={post.id}
          href={`/blog/${post.id}`}
          className="group overflow-hidden border border-zinc-200 bg-white hover:border-black transition-all duration-300 premium-card-hover flex flex-col"
        >
          <div className="aspect-video overflow-hidden bg-zinc-50">
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h2 className="text-sm font-black text-zinc-900 uppercase tracking-wide group-hover:text-zinc-500 transition-colors mb-2 line-clamp-2">
                {post.title}
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">{post.excerpt}</p>
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-100">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{post.author.name}</span>
              <span className="text-[10px] font-bold text-black uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                Read <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}