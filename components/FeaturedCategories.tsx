import Link from "next/link";

const categories = [
  {
    name: "Football",
    image: "/categories/football.jpg",
    description: "Official team jerseys and custom designs",
  },
  {
    name: "Basketball",
    image: "/categories/basketball.jpg",
    description: "NBA and custom basketball jerseys",
  },
  {
    name: "Soccer",
    image: "/categories/soccer.jpg",
    description: "Premier League and international jerseys",
  },
  {
    name: "Custom",
    image: "/categories/custom.jpg",
    description: "Design your own unique jersey",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        Featured Categories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/categories/${category.name.toLowerCase()}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {category.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
} 