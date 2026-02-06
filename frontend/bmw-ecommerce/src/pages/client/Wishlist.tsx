import { useEffect, useState } from "react";
import type { Car } from "../../types/car";
import axios from "axios";
import { useWishlist } from "../../hooks/useWishlist";
import CarCard from "../../components/client/CarCard";

export default function Wishlist() {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { wishlist } = useWishlist();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
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

  const wishlistedCars = cars.filter((car) => wishlist.includes(car._id));
  console.log(error);
  console.log(loading);

  if (wishlistedCars.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-500">
        <p className="text-xl">Your wishlist is empty</p>
      </div>
    );
  }

  return (
    // 1. Outer Container: Handles page width and padding
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">My Wishlist</h1>

      {/* 2. Grid Container: Directly wraps the items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlistedCars.map((car) => (
          <CarCard car={car} key={car._id} />
        ))}
      </div>
    </div>
  );
}
