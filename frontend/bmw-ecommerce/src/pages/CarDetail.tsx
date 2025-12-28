import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Car } from "../types/car";

export default function CarDetail() {
  const { id } = useParams();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  // UI states
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  /* =======================
     FETCH CAR DETAIL
  ======================== */
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/browse/car/${id}`
        );
        setCar(res.data.data.car);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  /* =======================
     INIT COLOR + IMAGE
  ======================== */
  useEffect(() => {
    if (car) {
      setSelectedColor(car.defaultColor || car.colors[0]);
      setActiveImageIndex(0);
    }
  }, [car]);

  /* =======================
     DERIVED VALUES
  ======================== */
  const imagesForColor =
    selectedColor && car?.images[selectedColor]
      ? car.images[selectedColor]
      : [];

  const mainImage =
    imagesForColor.length > 0
      ? imagesForColor[activeImageIndex]
      : "https://via.placeholder.com/1200x600?text=BMW+Coming+Soon";

  /* =======================
     LOADING STATE
  ======================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 tracking-widest">
        LOADING BMW EXPERIENCE...
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Car not found
      </div>
    );
  }

  /* =======================
     UI
  ======================== */
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f19]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* ===== LEFT : IMAGES ===== */}
        <div>
          {/* Main Image */}
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
            <img
              src={mainImage}
              alt={car.name}
              className="w-full h-[460px] object-cover transition-all duration-500"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-6">
            {imagesForColor.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`
                  w-24 h-24 rounded-xl overflow-hidden border transition-all
                  ${
                    index === activeImageIndex
                      ? "border-[#1C69D2] ring-2 ring-[#1C69D2]/40"
                      : "border-gray-300 dark:border-gray-700 opacity-70 hover:opacity-100"
                  }
                `}
              >
                <img
                  src={img}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ===== RIGHT : DETAILS ===== */}
        <div className="flex flex-col">
          {/* Title */}
          <p className="text-[11px] tracking-[0.4em] uppercase text-gray-400 font-bold mb-2">
            {car.series || "BMW SERIES"}
          </p>

          <h1 className="text-4xl font-black uppercase text-gray-900 dark:text-white mb-6">
            {car.name}
          </h1>

          {/* Price */}
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            ${car.price.toLocaleString()}
          </p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-y-5 mb-10 text-sm">
            <Spec label="Engine" value={car.engineType || "N/A"} />
            <Spec label="Power" value={`${car.horsePower || 0} HP`} />
            <Spec label="Available Colors" value={`${car.colors.length}`} />
            <Spec label="Status" value="Available" />
          </div>

          {/* Colors */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3">
              Choose Color
            </p>
            <div className="flex gap-3 flex-wrap">
              {car.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    setActiveImageIndex(0);
                  }}
                  className={`
                    px-5 py-2 rounded-full border text-xs font-black uppercase tracking-widest transition-all
                    ${
                      selectedColor === color
                        ? "bg-[#1C69D2] text-white border-[#1C69D2]"
                        : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#1C69D2]"
                    }
                  `}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto flex gap-4 pt-12">
            <button className="flex-1 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold hover:bg-[#1C69D2] hover:text-white transition-all">
              Add to Cart
            </button>

            <button className="flex-1 py-4 rounded-xl bg-[#1C69D2] hover:bg-[#1652a7] text-white font-black tracking-widest uppercase transition-all shadow-lg shadow-blue-500/30">
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
        {label}
      </p>
      <p className="text-sm font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
