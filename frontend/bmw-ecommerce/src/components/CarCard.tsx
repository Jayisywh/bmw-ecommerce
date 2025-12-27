import { Heart, ShoppingCart, Gauge, Zap, Palette, Info } from "lucide-react";
import type { Car } from "../types/car";
import { useWishlist } from "../hooks/useWishlist";

export default function CarCard({ car }: { car: Car }) {
  const { toggleWishlist, isWishlisted } = useWishlist();

  const displayImage =
    car.images && car.images.length > 0
      ? car.images[0]
      : "https://via.placeholder.com/600x400?text=BMW+Coming+Soon";

  return (
    <div
      className="
        group relative flex flex-col
        min-h-140
        bg-white dark:bg-[#111827]
        border border-gray-200 dark:border-gray-800
        rounded-2xl overflow-hidden
        transition-all duration-500
        hover:-translate-y-2
        hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)]
      "
    >
      <div className="relative h-60 overflow-hidden">
        <img
          src={displayImage}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {car.isFeatured && (
          <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-black tracking-[0.25em] uppercase bg-[#1C69D2] text-white rounded-sm shadow-lg">
            Featured
          </span>
        )}
        <button
          onClick={() => toggleWishlist(car._id)}
          className={`
                    absolute top-4 right-4 z-20 p-2.5 rounded-full
                    backdrop-blur-md border transition-all duration-300
                    ${
                      isWishlisted(car._id)
                        ? "bg-red-500 border-red-500 shadow-lg shadow-red-500/50 scale-110"
                        : "bg-black/20 text-white border-white/30 hover:bg-white hover:text-red-500 hover:scale-110"
                    }
        `}
        >
          <Heart
            size={18}
            // Switch to white when the button background is red
            color={isWishlisted(car._id) ? "white" : "currentColor"}
            fill={isWishlisted(car._id) ? "white" : "none"}
            className="transition-transform duration-300 active:scale-125"
          />
        </button>
      </div>
      <div className="flex flex-col flex-1 p-6">
        <div className="mb-5">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 dark:text-gray-500 uppercase mb-1">
            {car.series || "BMW Series"}
          </p>

          <h3 className="text-2xl font-bold tracking-tight uppercase text-gray-900 dark:text-white line-clamp-2 min-h-16">
            {car.name}
          </h3>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-3 py-5 mb-6 border-y border-gray-100 dark:border-gray-800">
          {/* Engine */}
          <Spec
            icon={<Zap size={16} className="text-[#1C69D2]" />}
            label="Engine"
            value={car.engineType || "N/A"}
          />

          {/* Power */}
          <Spec
            icon={<Gauge size={16} className="text-[#1C69D2]" />}
            label="Power"
            value={`${car.horsePower || 0} HP`}
          />

          {/* Colors */}
          <Spec
            icon={<Palette size={16} className="text-[#1C69D2]" />}
            label="Options"
            value={`${car.colors?.length || 0} Colors`}
          />

          {/* Status */}
          <Spec
            icon={<Info size={16} className="text-[#1C69D2]" />}
            label="Status"
            value="Available"
          />
        </div>
        <div className="mt-auto flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">
              MSRP From
            </p>
            <p className="text-2xl font-bold uppercase text-gray-900 dark:text-white">
              ${car.price?.toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2">
            <button className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-[#1C69D2] hover:text-white transition-all">
              <ShoppingCart size={20} />
            </button>

            <button className="relative overflow-hidden px-6 py-4 rounded-xl bg-[#1C69D2] hover:bg-[#1652a7] text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-500/20">
              Configure
              <span className="absolute inset-0 bg-white/20 w-0 group-hover:w-full transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* BMW Accent Line */}
      <div className="h-1.5 w-0 bg-linear-to-r from-[#1C69D2] to-[#003366] transition-all duration-700 group-hover:w-full" />
    </div>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase text-gray-400 font-bold">
          {label}
        </span>
        <span className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate max-w-22.5">
          {value}
        </span>
      </div>
    </div>
  );
}
