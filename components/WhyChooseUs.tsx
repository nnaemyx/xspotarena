"use client";

import { Star, Users, Award, ThumbsUp } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useEffect, useState } from "react";

interface Testimonial {
  id: string | number;
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number;
}

const staticTestimonials: Testimonial[] = [
  {
    id: "static-1",
    name: "Sarah Johnson",
    role: "Team Captain",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
    text: "The custom jerseys we ordered for our team were absolutely perfect! The quality is outstanding and the design process was so easy.",
    rating: 5,
  },
  {
    id: "static-2",
    name: "Michael Chen",
    role: "Sports Club Manager",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop",
    text: "Calcio Threads delivered our order ahead of schedule, and the attention to detail in the customization was impressive. Highly recommended!",
    rating: 5,
  },
  {
    id: "static-3",
    name: "Emma Rodriguez",
    role: "Fitness Instructor",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop",
    text: "The quality of the materials and the fit of the jerseys exceeded our expectations. Our clients love their new uniforms!",
    rating: 5,
  },
];

const stats = [
  {
    icon: Users,
    value: "10K+",
    label: "Happy Customers",
    color: "text-black group-hover:text-white",
    bgColor: "bg-white border border-zinc-200 group-hover:bg-black group-hover:border-black",
  },
  {
    icon: Award,
    value: "5K+",
    label: "Team Orders",
    color: "text-black group-hover:text-white",
    bgColor: "bg-white border border-zinc-200 group-hover:bg-black group-hover:border-black",
  },
  {
    icon: ThumbsUp,
    value: "98%",
    label: "Satisfaction Rate",
    color: "text-black group-hover:text-white",
    bgColor: "bg-white border border-zinc-200 group-hover:bg-black group-hover:border-black",
  },
];

export default function WhyChooseUs() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(staticTestimonials);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const reviewsData = await res.json();
          if (Array.isArray(reviewsData) && reviewsData.length > 0) {
            // Map review data to match Testimonial interface
            const mappedReviews: Testimonial[] = reviewsData.map((r: any) => ({
              id: r.id,
              name: r.name,
              role: r.role,
              image: r.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
              text: r.comment,
              rating: r.rating,
            }));

            // Merge dynamic and static reviews (ensuring at least 3 items in the carousel)
            if (mappedReviews.length >= 3) {
              setTestimonials(mappedReviews);
            } else {
              setTestimonials([
                ...mappedReviews,
                ...staticTestimonials.slice(0, 3 - mappedReviews.length)
              ]);
            }
          }
        }
      } catch (error) {
        console.error("Error loading homepage reviews:", error);
      }
    }

    fetchReviews();
  }, []);

  return (
    <section className="py-24 bg-white border-t border-zinc-200 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-3 block">Orchestrated to Perfection</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-6 text-black tracking-tight">Why Choose Calcio Threads?</h2>
          <div className="h-px w-12 bg-black mx-auto mb-6" />
          <p className="text-zinc-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Join thousands of players and managers who trust us for elite quality, bespoke customization, and championship-level service.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group flex items-center justify-center p-8 bg-zinc-50 border border-zinc-200 hover:border-black transition-all duration-300"
            >
              <div className={`p-4 ${stat.bgColor} mr-5 transition-all duration-300`}>
                <stat.icon className={`h-6 w-6 ${stat.color} transition-colors duration-300`} />
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
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-8 bg-white border border-zinc-200 hover:border-black transition-all duration-300 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex mb-5">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 text-black fill-black mr-1" />
                        ))}
                      </div>
                      <p className="text-zinc-600 italic text-xs leading-relaxed mb-6">"{testimonial.text}"</p>
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
        </div>
      </div>
    </section>
  );
}