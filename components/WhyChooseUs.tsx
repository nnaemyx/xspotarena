"use client";

import { Star, Users, Award, ThumbsUp } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Team Captain",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
    text: "The custom jerseys we ordered for our team were absolutely perfect! The quality is outstanding and the design process was so easy.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Sports Club Manager",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop",
    text: "XSpot delivered our order ahead of schedule, and the attention to detail in the customization was impressive. Highly recommended!",
    rating: 5,
  },
  {
    id: 3,
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
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Award,
    value: "5K+",
    label: "Team Orders",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: ThumbsUp,
    value: "98%",
    label: "Satisfaction Rate",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose XSpot?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their team's jersey needs.
            Experience the perfect blend of quality, customization, and service.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`p-4 rounded-full ${stat.bgColor} mr-4`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto">
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
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-full">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.text}"</p>
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