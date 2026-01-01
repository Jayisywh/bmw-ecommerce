import { useState, useEffect } from "react";
import type { Car } from "../types/car";

interface CompareCarCardProps {
  car: Car | null;
  onRemove: () => void;
}

export default function CompareCarCard({ car, onRemove }: CompareCarCardProps) {
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    if (car) {
      setSelectedColor(car.defaultColor);
    }
  }, [car]);

  // Matches the dashed box look from your screenshot but with theme-aware colors
  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-sm bg-transparent">
        <div className="w-10 h-10 border border-gray-300 dark:border-zinc-700 rounded-full flex items-center justify-center mb-4">
          <span className="text-gray-400 dark:text-zinc-600">+</span>
        </div>
        <p className="text-[10px] text-gray-400 dark:text-zinc-600 font-bold uppercase tracking-[0.2em]">
          Select Model
        </p>
      </div>
    );
  }

  const colorImages = (car.images as any)[selectedColor] || [];
  const mainImage = colorImages.length > 0 ? colorImages[0] : "";

  return (
    <div className="relative bg-white dark:bg-transparent border border-gray-100 dark:border-zinc-800 rounded-sm overflow-hidden flex flex-col min-h-[600px]">
      {/* 1. Subtle Remove Link */}
      <button
        onClick={onRemove}
        className="absolute top-6 right-6 z-20 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500 hover:text-red-500 transition-colors"
      >
        Remove
      </button>

      {/* 2. Image Area (Slightly lighter dark to make the car pop) */}
      <div className="aspect-[16/10] bg-gray-50 dark:bg-zinc-900/30 flex items-center justify-center border-b border-gray-100 dark:border-zinc-800">
        <img
          src={mainImage}
          alt={car.name}
          className="w-full h-full object-contain p-10 transition-transform duration-700 hover:scale-105"
        />
      </div>

      <div className="p-8 flex-grow flex flex-col">
        {/* 3. Typography: BMW High-Contrast Style */}
        <div className="mb-10">
          <p className="text-[10px] font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em] mb-2">
            {car.series}
          </p>
          <h3 className="text-3xl font-black uppercase italic leading-none text-gray-900 dark:text-white">
            {car.name}
          </h3>
          <p className="text-xl font-medium text-gray-500 dark:text-zinc-400 mt-4">
            ${car.price.toLocaleString()}
          </p>
        </div>

        {/* 4. Color Swatches: Transparent Backgrounds */}
        <div className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-600 mb-4">
            Exterior:{" "}
            <span className="text-gray-900 dark:text-zinc-200">
              {selectedColor}
            </span>
          </p>
          <div className="flex flex-wrap gap-4">
            {car.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? "border-blue-600 scale-125 shadow-xl"
                    : "border-gray-200 dark:border-zinc-800 hover:border-zinc-600"
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
          </div>
        </div>

        {/* 5. Technical Specs Grid */}
        <div className="grid grid-cols-2 gap-y-8 pt-8 border-t border-gray-100 dark:border-zinc-800 mt-auto">
          <div>
            <span className="block text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-1">
              Engine
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-zinc-200">
              {car.engineType}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-1">
              Power
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-zinc-200">
              {car.horsePower} HP
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-1">
              Status
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-zinc-200">
              {car.isFeatured ? "Featured" : "Standard"}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-1">
              Configured
            </span>
            <span className="text-sm font-bold text-green-500 italic">
              Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
