import { useEffect, useState } from "react";
import type { Car } from "../types/car";
import axios from "axios";
import CompareCarCard from "../components/CompareCarCard";

export default function Compare() {
  const [leftCar, setLeftCar] = useState<Car | null>(null);
  const [rightCar, setRightCar] = useState<Car | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [leftDropdownOpen, setLeftDropdownOpen] = useState(false);
  const [rightDropdownOpen, setRightDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/browse/cars`);
        setCars(res.data.data);
      } catch (err) {
        console.error("Failed to fetch cars", err);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-black uppercase tracking-widest text-gray-900 dark:text-white mb-10">
        Compare Cars
      </h2>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* LEFT COLUMN */}
        <div className="flex-1">
          <div className="relative mb-6">
            <button
              className="w-full flex justify-between items-center bg-[#0066b1] text-white px-5 py-3 rounded-md font-bold uppercase transition-colors hover:bg-[#004a82]"
              onClick={() => setLeftDropdownOpen(!leftDropdownOpen)}
            >
              {leftCar ? leftCar.name : "Select a model"}
              <span>{leftDropdownOpen ? "▲" : "▼"}</span>
            </button>

            {leftDropdownOpen && (
              <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-2xl dark:bg-gray-800 dark:border-gray-700">
                {cars.map((car) => (
                  <button
                    key={car._id}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b last:border-0 dark:border-gray-700"
                    onClick={() => {
                      setLeftCar(car);
                      setLeftDropdownOpen(false);
                    }}
                  >
                    {car.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Just use the component. It handles its own "No car" state! */}
          <CompareCarCard car={leftCar} onRemove={() => setLeftCar(null)} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1">
          <div className="relative mb-6">
            <button
              className="w-full flex justify-between items-center bg-[#0066b1] text-white px-5 py-3 rounded-md font-bold uppercase transition-colors hover:bg-[#004a82]"
              onClick={() => setRightDropdownOpen(!rightDropdownOpen)}
            >
              {rightCar ? rightCar.name : "Select a model"}
              <span>{rightDropdownOpen ? "▲" : "▼"}</span>
            </button>

            {rightDropdownOpen && (
              <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-2xl dark:bg-gray-800 dark:border-gray-700">
                {cars.map((car) => (
                  <button
                    key={car._id}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b last:border-0 dark:border-gray-700"
                    onClick={() => {
                      setRightCar(car);
                      setRightDropdownOpen(false);
                    }}
                  >
                    {car.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Same here. No need for the dashed div wrapper! */}
          <CompareCarCard car={rightCar} onRemove={() => setRightCar(null)} />
        </div>
      </div>
    </div>
  );
}
