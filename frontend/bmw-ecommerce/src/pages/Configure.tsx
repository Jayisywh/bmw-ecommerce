import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import type { Car } from "../types/car";
import type { CarOptions, Config } from "../types/config";
import axios from "axios";
import PreviewSection from "../components/PreviewSection";
import ConfigSection from "../components/ConfigSection";

export default function Configure() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [options, setOptions] = useState<CarOptions | null>(null);
  const [loading, setLoading] = useState(true);

  const [config, setConfig] = useState<Config>({
    color: "",
    interior: "",
    size: "",
    trims: "",
    packages: [],
  });

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

        // SAFE INITIALIZATION: Added optional chaining (?.) and fallbacks (|| "")
        // to prevent "Cannot read properties of undefined (reading '0')"
        setConfig({
          color: carData?.defaultColor || optData?.colors?.[0]?.color || "",
          interior: optData?.interior?.[0]?.name || "",
          size: optData?.size?.[0]?.size || "",
          trims: optData?.trims?.[0]?.name || "",
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

  const totalPrice = useMemo(() => {
    if (!car || !options) return 0;
    const total = car.price || 0;

    // Added safe navigation (?.) for all arrays
    const colorPrice =
      options.colors?.find((c) => c.color === config.color)?.price || 0;
    const intPrice =
      options.interior?.find((i) => i.name === config.interior)?.price || 0;
    const trimPrice =
      options.trims?.find((t) => t.name === config.trims)?.price || 0;
    const wheelPrice =
      options.size?.find((s) => s.size === config.size)?.price || 0;

    // Ensure options.package exists before filtering
    const pkgPrice = (options.package || [])
      .filter((p) => config.packages.includes(p.name))
      .reduce((acc, curr) => acc + curr.price, 0);

    return total + colorPrice + intPrice + trimPrice + wheelPrice + pkgPrice;
  }, [car, options, config]);

  if (loading || !car || !options) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-[#0b0f1a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1C69D2]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f1a] transition-colors duration-500">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0b0f1a]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
            {car.name} <span className="text-[#1C69D2]">Configurator</span>
          </h1>
          <div className="text-right">
            <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">
              Total MSRP
            </p>
            <p className="text-2xl font-black text-[#1C69D2]">
              ${totalPrice.toLocaleString()}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 h-fit lg:sticky lg:top-32">
            <PreviewSection car={car} config={config} />
          </div>
          <div className="lg:col-span-5">
            <ConfigSection
              options={options}
              config={config}
              setConfig={setConfig}
            />
            <button className="w-full mt-8 py-5 bg-[#1C69D2] hover:bg-[#1652a7] text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]">
              Finalize Order
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
