import { useEffect, useState } from "react";
import CarCard from "../components/CarCard";
import axios from "axios";
import type { Car } from "../types/car";

export default function Models() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/browse/cars");
        setCars(res.data.data);
      } catch (err) {
        setError(`Failed to load BMW models ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Title */}
        <h1 className="text-3xl font-black uppercase tracking-widest text-gray-900 dark:text-white mb-10">
          BMW Models
        </h1>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 tracking-widest">
            Loading BMW models...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
