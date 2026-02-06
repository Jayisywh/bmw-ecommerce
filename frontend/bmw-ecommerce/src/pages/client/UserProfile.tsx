import axios from "axios";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Heart,
  ShoppingCart,
  Package,
  X,
  Loader2,
  Edit2,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import type { UserInfo } from "../../types/auth"; // Ensure this path matches your project structure
import { useAuth } from "../../hooks/useAuth";

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const { logout } = useAuth();

  // --- STATE: Edit Profile ---
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");

  // --- STATE: Password Reset Modal ---
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fetchUserInfo = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/auth/userprofile",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUserInfo(res.data.data);
      setNewName(res.data.data.name);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [token]);

  // 2. Update Profile Name
  const handleUpdateProfile = async () => {
    try {
      await axios.put(
        "http://127.0.0.1:8000/api/auth/update-profile",
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsEditing(false);
      fetchUserInfo();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center dark:bg-[#0B0F19]">
        <Loader2 className="animate-spin text-[#1C69D2]" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Account
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account and view activity
        </p>

        {/* USER INFO SECTION */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center gap-6 bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-[#1C69D2] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
            {userInfo?.name?.charAt(0).toUpperCase()}
          </div>

          {/* Details & Edit Form */}
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-[#1C69D2] outline-none"
                  autoFocus
                />
                <button
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="group">
                <p className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {userInfo?.name}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-[#1C69D2] transition-all"
                    title="Edit Name"
                  >
                    <Edit2 size={16} />
                  </button>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                  <Mail size={14} />
                  {userInfo?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-10 border-t border-gray-200 dark:border-gray-800" />

        {/* STATS OVERVIEW */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activity Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Stat
              icon={<Heart size={20} />}
              label="Favorites"
              value={userInfo?.favoriteCount || 0}
            />
            <Stat
              icon={<ShoppingCart size={20} />}
              label="Cart Items"
              value={userInfo?.cartItemCount || 0}
            />
            <Stat
              icon={<Package size={20} />}
              label="Orders"
              value={userInfo?.orderItemCount || 0}
            />
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-10 border-t border-gray-200 dark:border-gray-800" />

        {/* ACTIONS BUTTONS */}
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="
              px-6 py-3 rounded-xl
              bg-[#1C69D2] hover:bg-blue-700
              text-white font-medium
              shadow-lg shadow-blue-500/20
              transition-all duration-300
              flex items-center gap-2
            "
          >
            <KeyRound size={18} />
            Change Password
          </button>

          <button
            className="
              px-6 py-3 rounded-xl
              bg-red-500 hover:bg-red-600
              text-white font-medium
              shadow-lg shadow-red-500/20
              transition-all duration-300
            "
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      </div>

      {/* --- OTP PASSWORD COMPONENT --- */}
      {showPasswordModal && (
        <OtpVerificationModal
          email={userInfo?.email || ""}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-[#111827] p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1C69D2]">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

/**
 * The Dedicated Component for OTP Logic
 * Handles sending email, inputting code, and resetting password.
 */
function OtpVerificationModal({
  email,
  onClose,
}: {
  email: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"send" | "verify">("send");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/request-otp", { email });
      setStep("verify");
    } catch (err: any) {
      setError("Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      alert("Password updated successfully!");
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP or Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#111827] p-8 rounded-2xl w-full max-w-md relative shadow-2xl border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-[#1C69D2] rounded-full flex items-center justify-center mx-auto mb-4">
            {step === "send" ? <Mail size={24} /> : <CheckCircle2 size={24} />}
          </div>
          <h2 className="text-2xl font-bold dark:text-white">
            Security Verification
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {step === "send"
              ? "We need to verify it's you. Click below to send a code."
              : `Enter the code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        {step === "send" ? (
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full bg-[#1C69D2] text-white py-3 rounded-xl hover:bg-blue-700 font-medium flex justify-center items-center gap-2 transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Send Verification Code"
            )}
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center text-2xl tracking-[0.5em] font-bold border dark:border-gray-700 p-3 rounded-xl dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#1C69D2] outline-none transition-all placeholder:tracking-normal placeholder:font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border dark:border-gray-700 p-3 rounded-xl dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#1C69D2] outline-none transition-all"
              />
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-medium flex justify-center items-center gap-2 mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
