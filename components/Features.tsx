import { Brush, Package, Truck } from "lucide-react";

export default function Features() {
  return (
    <section className="py-24 bg-zinc-50 border-y border-zinc-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group p-8 bg-white border border-zinc-200 hover:border-black transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-zinc-100 mb-6 group-hover:bg-black group-hover:text-white transition-all duration-300">
              <Brush className="h-5 w-5 text-black group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider mb-3 text-black">Custom Jersey Studio</h3>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Design your own bespoke kits with our interactive customization studio. Play with numbers, names, and team crests.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-8 bg-white border border-zinc-200 hover:border-black transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-zinc-100 mb-6 group-hover:bg-black group-hover:text-white transition-all duration-300">
              <Package className="h-5 w-5 text-black group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider mb-3 text-black">Championship Quality</h3>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Engineered with lightweight, moisture-wicking materials matching professional pitch standards for ultimate breathability.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-8 bg-white border border-zinc-200 hover:border-black transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-zinc-100 mb-6 group-hover:bg-black group-hover:text-white transition-all duration-300">
              <Truck className="h-5 w-5 text-black group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider mb-3 text-black">Express Pitch Delivery</h3>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Fast-tracked production queues and express shipping to ensure you and your team are geared up in time for matchday.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}