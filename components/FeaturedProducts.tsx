"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const featuredProducts = [
  {
    id: 1,
    name: "Classic Football Jersey",
    price: 49.99,
    image: "/images/products/football-jersey.jpg",
    category: "Football",
  },
  {
    id: 2,
    name: "Basketball Team Jersey",
    price: 54.99,
    image: "/images/products/basketball-jersey.jpg",
    category: "Basketball",
  },
  {
    id: 3,
    name: "Custom Soccer Jersey",
    price: 44.99,
    image: "/images/products/soccer-jersey.jpg",
    category: "Soccer",
  },
  {
    id: 4,
    name: "Premium Training Jersey",
    price: 39.99,
    image: "/images/products/training-jersey.jpg",
    category: "Training",
  },
];

export default function FeaturedProducts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="relative h-48 w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-1">{product.category}</div>
            <h3 className="font-semibold mb-2">{product.name}</h3>
            <div className="text-lg font-bold">${product.price}</div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full" asChild>
              <Link href={`/products/${product.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 