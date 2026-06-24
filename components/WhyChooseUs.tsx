"use client";

import { Star, Users, Award, ThumbsUp, Quote, MessageSquare } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useEffect, useState, useRef } from "react";

interface Testimonial {
  id: string | number;
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number;
}

const stats = [
  {
    icon: Users,
    value: "10K+",
    label: "Happy Customers",
  },
  {
    icon: Award,
    value: "5K+",
    label: "Team Orders",
  },
  {
    icon: ThumbsUp,
    value: "98%",
    label: "Satisfaction Rate",
  },
];

export default function WhyChooseUs() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleStats, setVisibleStats] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleStats(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const reviewsData = await res.json();
          if (Array.isArray(reviewsData) && reviewsData.length > 0) {
            const mappedReviews: Testimonial[] = reviewsData.map((r: any) => ({
              id: r.id,
              name: r.name,
              role: r.role,
              image: r.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
              text: r.comment,
              rating: r.rating,
            }));
            setTestimonials(mappedReviews);
          }
        }
      } catch (error) {
        console.error("Error loading homepage reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  return (
    <section className="py-24 bg-white border-t border-zinc-200 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-3 block animate-fade-in">Orchestrated to Perfection</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-6 text-black tracking-tight animate-fade-in-up">Why Choose Calcio Threads?</h2>
          <div className="h-px w-12 bg-black mx-auto mb-6 animate-fade-in animation-delay-200" />
          <p className="text-zinc-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed animate-fade-in-up animation-delay-300">
            Join thousands of players and managers who trust us for elite quality, bespoke customization, and championship-level service.
          </p>
        </div>

        {/* Statistics */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group flex items-center justify-center p-8 bg-zinc-50 border border-zinc-200 hover:border-black transition-all duration-500 premium-card-hover ${
                visibleStats ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="p-4 bg-white border border-zinc-200 group-hover:bg-black group-hover:border-black mr-5 transition-all duration-300">
                <stat.icon className="h-6 w-6 text-black group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <div className="text-3xl font-black text-black mb-1 tracking-tight">{stat.value}</div>
                <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center justify-center gap-2">
              <MessageSquare className="h-4 w-4" /> Customer Reviews
            </h3>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-8 bg-zinc-50 border border-zinc-200 animate-pulse">
                  <div className="flex mb-5 gap-1">
                    {[1,2,3,4,5].map((s) => <div key={s} className="h-3.5 w-3.5 bg-zinc-200 rounded" />)}
                  </div>
                  <div className="h-4 bg-zinc-200 w-full mb-2 rounded" />
                  <div className="h-4 bg-zinc-200 w-3/4 mb-6 rounded" />
                  <div className="flex items-center pt-4 border-t border-zinc-100">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 mr-4" />
                    <div>
                      <div className="h-3 bg-zinc-200 w-20 mb-1 rounded" />
                      <div className="h-2 bg-zinc-200 w-14 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-16 px-8 border border-dashed border-zinc-300 bg-zinc-50/50">
              <Quote className="h-8 w-8 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500 text-sm font-medium mb-2">No reviews yet</p>
              <p className="text-zinc-400 text-xs">
                Be the first to share your experience with Calcio Threads!
              </p>
            </div>
          ) : (
            <Carousel
              className="w-full"
              autoPlay={true}
              autoPlayInterval={5000}
              opts={{
                loop: true,
                dragFree: false,
                containScroll: "trimSnaps",
              }}
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="p-8 bg-white border border-zinc-200 hover:border-black transition-all duration-300 h-full flex flex-col justify-between group premium-card-hover">
                      <div>
                        <Quote className="h-5 w-5 text-zinc-200 group-hover:text-zinc-400 transition-colors mb-4" />
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 text-black fill-black mr-1" />
                          ))}
                          {[...Array(5 - testimonial.rating)].map((_, i) => (
                            <Star key={`empty-${i}`} className="h-3.5 w-3.5 text-zinc-200 mr-1" />
                          ))}
                        </div>
                        <p className="text-zinc-600 text-xs leading-relaxed mb-6">"{testimonial.text}"</p>
                      </div>
                      
                      <div className="flex items-center pt-4 border-t border-zinc-100">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover mr-4 border border-zinc-200"
                        />
                        <div>
                          <h4 className="font-bold text-zinc-950 text-sm">{testimonial.name}</h4>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
}