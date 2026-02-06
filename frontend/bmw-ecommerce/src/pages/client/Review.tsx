import { useState } from "react";
import { Star, Send, Lock } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth"; // or useContext(AuthContext)
import { Link } from "react-router-dom";

export default function Review() {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.warn("Please select a star rating!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8000/api/reviews/create",
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Thank you for your feedback!");
      setComment("");
      setRating(0);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            We Value Your Feedback
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Tell us about your experience with the BMW Ecommerce platform.
          </p>
        </div>

        {user ? (
          // --- AUTHENTICATED USER FORM ---
          <div className="bg-white dark:bg-[#111827] p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
            <form onSubmit={handleSubmit}>
              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(rating)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= (hover || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>

              {/* Text Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Review
                </label>
                <textarea
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 focus:ring-0 transition-all text-gray-900 dark:text-white resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Submit Review"}
                {!loading && <Send size={20} />}
              </button>
            </form>
          </div>
        ) : (
          // --- GUEST USER CARD ---
          <div className="bg-white dark:bg-[#111827] p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="text-gray-400" size={30} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Login to Write a Review
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Only verified users can share their feedback. Please sign in to
              continue.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
