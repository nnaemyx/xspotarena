import Link from "next/link";
import Image from "next/image";

export default function CustomJerseySection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Design Your Dream Jersey</h2>
            <p className="text-gray-600">
              Create a custom jersey that's uniquely yours. Upload your design,
              choose your colors, and we'll bring your vision to life with our
              premium quality materials and expert craftsmanship.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Upload your own design</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Choose from multiple colors</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Premium quality materials</span>
              </li>
            </ul>
            <Link
              href="/custom-jersey"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Designing
            </Link>
          </div>
          <div className="relative h-[400px] md:h-[500px]">
            <Image
              src="/custom-jersey-preview.jpg"
              alt="Custom Jersey Design"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 