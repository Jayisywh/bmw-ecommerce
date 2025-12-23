import { useState } from "react";
import { Link } from "react-router-dom";
import { signupUser } from "../services/authApi";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!name || !email || !password) {
      setError("All fields are required");
    }
    try {
      setError(null);
      setIsSubmitting(true);
      const data = await signupUser({
        name,
        email,
        password,
      });
      login(data.user, data.token);
    } catch {
      setError("Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Sign Up
        </h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="min-h-5 text-center">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Sign Up
        </button>
        <p className="text-sm text-gray-600 dark:text-gray-30 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
