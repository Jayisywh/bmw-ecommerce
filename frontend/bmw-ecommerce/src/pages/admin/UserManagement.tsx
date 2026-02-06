import React, { useEffect, useState } from "react";
import { Search, Edit2, Trash2, X, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  totalOrders: number;
  status?: "Active" | "Blocked";
  password?: string; // Used only for the form
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserData>();

  // 1. Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/admin/users`);
        setUsers(res.data.data);
      } catch (err) {
        console.error("Fetch Error: ", err);
      }
    };
    fetchUsers();
  }, []);

  // 2. Delete User
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Delete Error: ", err);
    }
  };

  // 3. Open Modal for Create or Edit
  const openModal = (user?: UserData) => {
    if (user) {
      setEditingUser(user);
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "", // Keep blank for security
      });
    } else {
      setEditingUser(null);
      reset({ name: "", email: "", role: "user", password: "" });
    }
    setIsModalOpen(true);
  };

  // 4. Handle Create/Update Submit
  const onSubmit = async (data: UserData) => {
    try {
      if (editingUser) {
        // UPDATE
        const res = await axios.put(
          `http://127.0.0.1:8000/api/admin/users/${editingUser._id}`,
          data,
        );
        setUsers(
          users.map((u) => (u._id === editingUser._id ? res.data.data : u)),
        );
      } else {
        // CREATE
        const res = await axios.post(
          `http://127.0.0.1:8000/api/admin/users`,
          data,
        );
        setUsers([...users, res.data.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(String(err) || "Operation failed");
    }
  };

  // Filter logic for search bar
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-8 bg-[#0b0e14] min-h-screen text-white relative">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Users Management</h1>
          <p className="text-gray-400 text-sm">
            Manage user accounts and roles.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} /> Add New User
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full bg-[#1a1d2e] border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#161927] rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-[#1a1d2e] text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold text-center">Orders</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredUsers.map((u) => (
              <tr
                key={u._id}
                className="hover:bg-gray-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20 text-sm">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      u.role === "admin"
                        ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        : "bg-gray-700/30 text-gray-400 border border-gray-700/50"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm font-medium text-gray-300">
                  {u.totalOrders || 0}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openModal(u)}
                      className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- FORM MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1d2e] w-full max-w-md rounded-2xl border border-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold">
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">
                  Full Name
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">
                  Email Address
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                  className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">
                  Password {editingUser && "(Leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: editingUser ? false : "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                  className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">
                  Role
                </label>
                <select
                  {...register("role")}
                  className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-800 text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  {editingUser ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
