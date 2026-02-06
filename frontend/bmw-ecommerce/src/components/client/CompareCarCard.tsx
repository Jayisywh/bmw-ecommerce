import { useState } from "react";
import type { Car } from "../../types/car";

interface CompareCarCardProps {
  car: Car | null;
  onRemove: () => void;
}

export default function CompareCarCard({ car, onRemove }: CompareCarCardProps) {
  const [selectedColor, setSelectedColor] = useState<string>(
    car?.defaultColor || "",
  );

  // --- EMPTY STATE ---
  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-sm bg-gray-50/50 dark:bg-zinc-900/20">
        <div className="w-16 h-16 border-2 border-gray-300 dark:border-zinc-700 rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-zinc-600">
          <span className="text-2xl font-light">+</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-[0.2em]">
          Select Model
        </p>
      </div>
    );
  }

  // Handle image selection safely
  const colorImages =
    (car.images as any)?.[selectedColor] ||
    (car.images as any)?.[car.defaultColor] ||
    [];

  const mainImage =
    colorImages.length > 0
      ? colorImages[0]
      : "https://via.placeholder.com/600x400?text=No+Image";

  return (
    <div className="relative bg-white dark:bg-transparent border border-gray-100 dark:border-zinc-800 rounded-sm overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      {/* 1. Remove Button */}
      <button
        onClick={onRemove}
        className="absolute top-4 right-4 z-20 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500 hover:text-red-500 transition-colors bg-white/50 dark:bg-black/50 px-2 py-1 rounded backdrop-blur-sm"
      >
        Remove
      </button>

      {/* 2. IMAGE AREA - FIXED HEIGHT FIX */}
      {/* Using h-64 (mobile) and h-80 (desktop) ensures strict alignment */}
      <div className="w-full h-64 lg:h-80 bg-gray-50 dark:bg-zinc-900/30 flex items-center justify-center border-b border-gray-100 dark:border-zinc-800 relative">
        <img
          src={mainImage}
          alt={car.name}
          className="w-full h-full object-contain p-6 transition-transform duration-700 hover:scale-105"
        />

        {/* Optional: Series Badge inside image for style */}
        <div className="absolute bottom-4 left-4">
          <span className="text-[10px] font-black text-gray-300 dark:text-zinc-700 uppercase tracking-widest">
            {car.series}
          </span>
        </div>
      </div>

      {/* 3. DETAILS AREA */}
      <div className="p-8 grow flex flex-col">
        {/* Typography */}
        <div className="mb-8">
          <h3 className="text-2xl lg:text-3xl font-black uppercase italic leading-none text-gray-900 dark:text-white">
            {car.name}
          </h3>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xl font-medium text-gray-500 dark:text-zinc-400">
              ${car.price.toLocaleString()}
            </span>
            {car.isFeatured && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Color Swatches */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-600">
              Exterior
            </p>
            <span className="text-[10px] font-medium text-gray-900 dark:text-zinc-300 uppercase">
              {selectedColor || car?.defaultColor}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {car.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? "border-blue-600 scale-110 shadow-lg ring-2 ring-blue-100 dark:ring-blue-900/30"
                    : "border-gray-200 dark:border-zinc-700 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Technical Specs Grid - Pushed to bottom */}
        <div className="grid grid-cols-2 gap-y-6 pt-6 border-t border-gray-100 dark:border-zinc-800 mt-auto">
          <div>
            <span className="block text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-1">
              Engine
            </span>
            <span className="text-xs font-bold text-gray-900 dark:text-zinc-200 line-clamp-2">
              {car.engineType}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-1">
              Power
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-zinc-200">
              {car.horsePower}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
