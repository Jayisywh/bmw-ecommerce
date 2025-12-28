import { useEffect, useState } from "react";
import type { Car } from "../types/car";
import axios from "axios";
import { useWishlist } from "../hooks/useWishlist";
import CarCard from "../components/CarCard";

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
  if (wishlistedCars.length === 0) return <p>No wishlist yet</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {wishlistedCars.map((car) => (
          <CarCard car={car} key={car._id} />
        ))}
      </div>
    </div>
  );
}
