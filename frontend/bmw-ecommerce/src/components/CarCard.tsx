import { Heart, ShoppingCart, Gauge, Zap, Palette, Info } from "lucide-react";
import type { Car } from "../types/car";
import { useWishlist } from "../hooks/useWishlist";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

type CarCardProps = { car: Car };

export default function CarCard({ car }: CarCardProps) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const defaultColor = car.defaultColor || car.colors?.[0];
  const displayImage =
    car.images?.[defaultColor]?.[0] ||
    "https://via.placeholder.com/600x400?text=BMW+Coming+Soon";

  return (
    <div
      className="
        group relative flex flex-col
        bg-white dark:bg-[#111827]
        border border-gray-200 dark:border-gray-800
        rounded-2xl overflow-hidden
        transition-all duration-500
        hover:-translate-y-2 hover:shadow-xl hover:shadow-black/30
      "
    >
      {/* CARD CLICK */}
      <div
        className="cursor-pointer"
        onClick={() => navigate(`/models/${car._id}`)}
      >
        {/* IMAGE */}
        <div className="relative h-60 overflow-hidden">
          <img
            src={displayImage}
            alt={car.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {car.isFeatured && (
            <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-black uppercase bg-[#1C69D2] text-white rounded-sm">
              Featured
            </span>
          )}

          {/* WISHLIST */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(car._id);
            }}
            className={`
              absolute top-4 right-4 z-20 p-2.5 rounded-full
              backdrop-blur-md border
              transition-all duration-300
              ${
                isWishlisted(car._id)
                  ? "bg-red-500 border-red-500 shadow-lg shadow-red-500/40"
                  : "bg-black/20 text-white border-white/30 hover:bg-white hover:text-red-500"
              }
            `}
          >
            <Heart
              size={18}
              fill={isWishlisted(car._id) ? "white" : "none"}
              className="transition-colors duration-300"
            />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 transition-colors duration-300">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1 transition-colors duration-300">
            {car.series || "BMW Series"}
          </p>
          <h3 className="text-2xl font-bold uppercase text-gray-900 dark:text-white transition-colors duration-300">
            {car.name}
          </h3>
        </div>

        {/* SPECS */}
        <div className="grid grid-cols-2 gap-4 px-6 py-4 border-y border-gray-100 dark:border-gray-800 transition-colors duration-300">
          <Spec
            icon={
              <Zap
                size={16}
                className="text-[#1C69D2] transition-colors duration-300"
              />
            }
            label="Engine"
            value={car.engineType || "N/A"}
          />
          <Spec
            icon={
              <Gauge
                size={16}
                className="text-[#1C69D2] transition-colors duration-300"
              />
            }
            label="Power"
            value={`${car.horsePower || 0} HP`}
          />
          <Spec
            icon={
              <Palette
                size={16}
                className="text-[#1C69D2] transition-colors duration-300"
              />
            }
            label="Options"
            value={`${car.colors?.length || 0} Colors`}
          />
          <Spec
            icon={
              <Info
                size={16}
                className="text-[#1C69D2] transition-colors duration-300"
              />
            }
            label="Status"
            value="Available"
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-auto p-6 flex items-center justify-between gap-4 transition-colors duration-300">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 transition-colors duration-300">
            MSRP From
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            ${car.price?.toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({
                carId: car._id,
                image: displayImage,
                selectOptions: {
                  color: defaultColor,
                },
                quantity: 1,
                unitPrice: car.price,
              });
            }}
            className="
              p-4 rounded-xl
              bg-gray-100 dark:bg-gray-800
              text-gray-900 dark:text-white
              hover:bg-[#1C69D2] hover:text-white
              transition-colors duration-300
            "
          >
            <ShoppingCart
              size={20}
              className="transition-colors duration-300"
            />
          </button>

          <button
            onClick={() => navigate(`/configure/${car._id}`)}
            className="
              px-6 py-4 rounded-xl
              bg-[#1C69D2] hover:bg-[#1652a7]
              text-white text-[11px] font-black uppercase tracking-widest
              transition-colors duration-300
              shadow-lg shadow-blue-500/20
            "
          >
            Configure
          </button>
        </div>
      </div>

      {/* BMW BLUE ACCENT LINE */}
      <div
        className="
          h-1.5 w-0
          bg-linear-to-r from-[#1C69D2] to-[#003366]
          transition-[width] duration-700 ease-out
          group-hover:w-full
        "
      />
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
      <div
        className="
          p-2 rounded-lg
          bg-gray-100 dark:bg-gray-800
          transition-colors duration-300
        "
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase text-gray-400 dark:text-gray-500 transition-colors duration-300">
          {label}
        </p>
        <p className="text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors duration-300">
          {value}
        </p>
      </div>
    </div>
  );
}
