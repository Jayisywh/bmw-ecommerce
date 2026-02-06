import { useEffect, useState } from "react";
import axios from "axios";
import { Star, User, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: {
    name: string;
    email: string;
  };
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/reviews/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(res.data.data);
      } catch (err) {
        toast.error("Failed to load reviews");
        console.log("Error: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f111a] text-white">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#0f111a] min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">User Reviews</h1>
        <p className="text-gray-400 text-sm mt-1">
          Read what users are saying about the platform.
        </p>
      </div>

      <div className="bg-[#161927] rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1a1d2e] text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium border-b border-gray-800">
                  User
                </th>
                <th className="p-4 font-medium border-b border-gray-800">
                  Rating
                </th>
                <th className="p-4 font-medium border-b border-gray-800">
                  Comment
                </th>
                <th className="p-4 font-medium border-b border-gray-800">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {reviews.map((review) => (
                <tr
                  key={review._id}
                  className="hover:bg-[#1a1d2e]/50 transition"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-200">
                          {review.userId?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {review.userId?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${
                            i < review.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 max-w-md">
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {review.comment}
                    </p>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No reviews found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
