import { Brush, Package, Truck } from "lucide-react";

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Brush className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Custom Designs</h3>
            <p className="text-gray-600">Create your own unique jersey design with our easy-to-use customization tools.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Quality Materials</h3>
            <p className="text-gray-600">Premium quality materials that ensure comfort and durability.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <Truck className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
            <p className="text-gray-600">Quick processing and nationwide delivery to get your jerseys on time.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 