import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import type { Car } from "../types/car";
import type { CarOptions, Config } from "../types/config";
import axios from "axios";
import PreviewSection from "../components/PreviewSection";
import ConfigSection from "../components/ConfigSection";
import { useCart } from "../hooks/useCart";

export default function Configure() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [car, setCar] = useState<Car | null>(null);
  const [options, setOptions] = useState<CarOptions | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ CONFIG SHAPE MATCHES BACKEND
  const [config, setConfig] = useState<Config>({ packages: [] });
  const normalizeColor = (c: { color: string; price: number }) => {
    return {
      name: c.color,
      price: c.price,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carRes, optionsRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/browse/car/${id}`),
          axios.get(`http://127.0.0.1:8000/api/carOptions/${id}`),
        ]);

        const carData = carRes.data.data.car;
        const optData = optionsRes.data;

        setCar(carData);
        setOptions(optData);
        setConfig({
          color: optData.colors?.[0]
            ? normalizeColor(optData.colors[0])
            : undefined,
          interior: optData.interior?.[0],
          wheels: optData.size?.[0],
          trim: optData.trims?.[0],
          packages: [],
        });
      } catch (err) {
        console.error("Error fetching configuration:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // ✅ PRICE = SIMPLE & SAFE
  const totalPrice = useMemo(() => {
    if (!car) return 0;

    return (
      car.price +
      (config.color?.price ?? 0) +
      (config.interior?.price ?? 0) +
      (config.wheels?.price ?? 0) +
      (config.trim?.price ?? 0) +
      (config.packages?.reduce((sum, p) => sum + p.price, 0) ?? 0)
    );
  }, [car, config]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-[#1C69D2] rounded-full" />
      </div>
    );
  }
  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0b0f1a]">
        <div className="max-w-md text-center bg-white dark:bg-[#111827] p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-black mb-3">No car selected</h2>

          <p className="text-gray-500 mb-6">
            Please choose a model first before configuring your vehicle.
          </p>

          <a
            href="/models"
            className="inline-block px-6 py-3 bg-[#1C69D2] hover:bg-[#1652a7] text-white font-bold rounded-xl"
          >
            Browse Models
          </a>
        </div>
      </div>
    );
  }
  const selectedColorName = config.color?.name || car.defaultColor;
  const cartImage =
    (selectedColorName && car.images?.[selectedColorName]?.[0]) ||
    Object.values(car.images || {})?.[0]?.[0] ||
    "https://via.placeholder.com/600x400?text=BMW+Image";
  if (!options) return null;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f1a]">
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Preview */}
        <div className="lg:col-span-7 sticky top-24">
          <PreviewSection car={car} config={config} />
        </div>

        {/* Config */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <ConfigSection
            options={options}
            config={config}
            setConfig={setConfig}
          />

          {/* Add to cart */}
          <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between mb-4">
              <span className="text-sm font-bold text-gray-500">
                Total MSRP
              </span>
              <span className="text-2xl font-black text-[#1C69D2]">
                ${totalPrice.toLocaleString()}
              </span>
            </div>

            <button
              className="w-full py-4 bg-[#1C69D2] hover:bg-[#1652a7] text-white font-black rounded-xl"
              onClick={() =>
                addToCart({
                  carId: car._id,
                  image: cartImage,
                  selectOptions: config, // 🔥 EXACT MATCH
                  quantity: 1,
                  unitPrice: totalPrice,
                })
              }
            >
              Finalize Order
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
