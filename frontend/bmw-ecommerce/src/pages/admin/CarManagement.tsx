import React, { useEffect, useState } from "react";
import {
  Plus,
  X,
  Edit2,
  Trash2,
  Settings,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const API_BASE = "http://127.0.0.1:8000/api/admin";

// --- INTERFACES ---
interface CarData {
  _id?: string;
  name: string;
  series: string;
  price: number;
  engineType: string;
  horsePower: string;
  categoryId: string;
  isFeatured: boolean;
  defaultColor: string;
  colors: string[];
  images: Record<string, string[]>;
  interior?: InteriorOpt[];
  size?: WheelOpt[];
  trims?: BasicOpt[];
  package?: BasicOpt[];
}

interface InteriorOpt {
  name: string;
  color: string;
  price: number;
}
interface WheelOpt {
  size: string;
  type: string;
  price: number;
}
interface BasicOpt {
  name: string;
  price: number;
}

interface Category {
  _id: string;
  name: string;
}

const CarManagement: React.FC = () => {
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarData | null>(null);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);

  const [imageGroups, setImageGroups] = useState([
    { color: "black", urls: "" },
  ]);
  const [interiors, setInteriors] = useState<InteriorOpt[]>([
    { name: "", color: "", price: 0 },
  ]);
  const [wheels, setWheels] = useState<WheelOpt[]>([
    { size: "", type: "", price: 0 },
  ]);
  const [trims, setTrims] = useState<BasicOpt[]>([{ name: "", price: 0 }]);
  const [packages, setPackages] = useState<BasicOpt[]>([
    { name: "", price: 0 },
  ]);

  const { register, handleSubmit, reset } = useForm<CarData>();

  const fetchCars = async () => {
    try {
      const res = await axios.get(`${API_BASE}/cars`);
      setCars(res.data.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchCategories();
  }, []);

  const handleEdit = (car: CarData) => {
    setEditingCar(car);
    setEditingCarId(String((car as any)._id || (car as any).id || "").trim());

    // ✅ CRITICAL FIX: Extract the ID string from the populated object
    // The backend sends categoryId as { _id: "...", name: "..." }, but the form needs just "..."
    let selectedCategoryId = "";

    if (car.categoryId && typeof car.categoryId === "object") {
      // If it's an object, grab the _id property
      selectedCategoryId = (car.categoryId as any)._id;
    } else if (typeof car.categoryId === "string") {
      // If it's already a string, use it directly
      selectedCategoryId = car.categoryId;
    }

    // Pass the clean string ID to the form
    reset({
      ...car,
      categoryId: selectedCategoryId,
    });

    // Properly map images from Record<string, string[]> to local state
    if (car.images && typeof car.images === "object") {
      const formattedGroups = Object.entries(car.images).map(
        ([color, urls]) => ({
          color: color,
          urls: Array.isArray(urls) ? urls.join("\n") : "",
        }),
      );
      setImageGroups(
        formattedGroups.length > 0
          ? formattedGroups
          : [{ color: "black", urls: "" }],
      );
    }

    // Map nested options
    setInteriors(
      car.interior?.length ? car.interior : [{ name: "", color: "", price: 0 }],
    );
    setWheels(car.size?.length ? car.size : [{ size: "", type: "", price: 0 }]);
    setTrims(car.trims?.length ? car.trims : [{ name: "", price: 0 }]);
    setPackages(car.package?.length ? car.package : [{ name: "", price: 0 }]);

    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;
    try {
      await axios.delete(`${API_BASE}/cars/${id}`);
      toast.success("Car deleted successfully");
      fetchCars();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const onSubmit = async (data: CarData) => {
    setIsSubmitting(true);
    try {
      const formattedImages: Record<string, string[]> = {};
      const colorList: string[] = [];

      imageGroups.forEach((g) => {
        const trimmedColor = g.color.trim();
        if (trimmedColor) {
          colorList.push(trimmedColor);
          formattedImages[trimmedColor] = g.urls
            .split("\n")
            .map((url) => url.trim())
            .filter((url) => url !== "");
        }
      });

      const fullPayload = {
        ...data,
        price: Number(data.price),
        colors: colorList,
        images: formattedImages,
        defaultColor: colorList[0] || "black",
        categoryId: data.categoryId,
        interior: interiors.filter((i) => i.name.trim() !== ""),
        size: wheels.filter((w) => w.size.trim() !== ""),
        trims: trims.filter((t) => t.name.trim() !== ""),
        package: packages.filter((p) => p.name.trim() !== ""),
      };

      if (editingCarId) {
        // use stored original id; ensure trimmed
        const cleanId = String(editingCarId).trim();
        await axios.put(`${API_BASE}/cars/${cleanId}`, fullPayload);
        toast.success("Vehicle updated successfully!");
      } else {
        await axios.post(`${API_BASE}/cars`, fullPayload);
        toast.success("New vehicle added successfully!");
      }

      setIsModalOpen(false);
      setEditingCar(null);
      setEditingCarId(null);
      fetchCars();
    } catch (err: any) {
      console.error("Save Error:", err);
      toast.error(err.response?.data?.message || "Failed to save vehicle.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
    setEditingCar(null);
    setEditingCarId(null);
    reset({
      name: "",
      series: "",
      price: 0,
      engineType: "",
      horsePower: "",
      isFeatured: false,
    });
    setImageGroups([{ color: "black", urls: "" }]);
    setInteriors([{ name: "", color: "", price: 0 }]);
    setWheels([{ size: "", type: "", price: 0 }]);
    setTrims([{ name: "", price: 0 }]);
    setPackages([{ name: "", price: 0 }]);
    setIsModalOpen(true);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0b0e14] text-white">
        Loading Inventory...
      </div>
    );

  return (
    <div className="p-8 bg-[#0b0e14] min-h-screen text-white font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Vehicle Inventory</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} /> Add New BMW
        </button>
      </div>

      <div className="bg-[#161927] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-[#1a1d2e] text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
            <tr>
              <th className="px-8 py-6">Model</th>
              <th className="px-8 py-6">Engine / HP</th>
              <th className="px-8 py-6">Base Price</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {cars.map((car) => (
              <tr
                key={car._id}
                className="hover:bg-blue-500/5 transition-colors"
              >
                <td className="px-8 py-5">
                  <div className="font-bold text-lg">{car.name}</div>
                  <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                    {car.series}
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-gray-400">
                  {car.engineType} <br /> {car.horsePower} HP
                </td>
                <td className="px-8 py-5 font-mono text-emerald-400 font-bold">
                  ${car.price?.toLocaleString()}
                </td>
                <td className="px-8 py-5 text-right flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(car)}
                    className="p-3 hover:bg-gray-800 rounded-full text-gray-400 hover:text-blue-400 transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => car._id && handleDelete(car._id)}
                    className="p-3 hover:bg-gray-800 rounded-full text-gray-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#1a1d2e] w-full max-w-6xl rounded-3xl border border-gray-700 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-[#1a1d2e] flex justify-between items-center p-8 border-b border-gray-800">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <Settings className="text-blue-500" /> Vehicle Configurator
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-800 p-2 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-colors"
              >
                <X />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-8 grid grid-cols-12 gap-10"
            >
              {/* LEFT: CORE SPECS */}
              <div className="col-span-12 lg:col-span-3 space-y-6">
                <h3 className="text-blue-500 text-xs font-black uppercase tracking-widest">
                  Base Specs
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold">
                      MODEL NAME
                    </label>
                    <input
                      {...register("name")}
                      required
                      className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold">
                      SERIES
                    </label>
                    <input
                      {...register("series")}
                      required
                      className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold">
                      BASE PRICE ($)
                    </label>
                    <input
                      type="number"
                      {...register("price")}
                      required
                      className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold">
                      ENGINE
                    </label>
                    <input
                      {...register("engineType")}
                      className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold">
                      HP
                    </label>
                    <input
                      {...register("horsePower")}
                      className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10]px text-gray-500 font-bold">
                      Category
                    </label>
                    <select
                      {...register("categoryId", { required: true })}
                      className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                    >
                      <option value={""} className="bg-[#0b0e14] text-gray-500">
                        Select a category
                      </option>
                      {categories.map((cat) => (
                        <option
                          key={cat._id}
                          value={cat._id}
                          className="bg-[#0b0e14]"
                        >
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* CENTER: ASSETS */}
              <div className="col-span-12 lg:col-span-4 border-l border-gray-800 pl-10 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-blue-500 text-xs font-black uppercase tracking-widest">
                    Color & Images
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setImageGroups([...imageGroups, { color: "", urls: "" }])
                    }
                    className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded"
                  >
                    + Add Color
                  </button>
                </div>
                <div className="space-y-4">
                  {imageGroups.map((g, i) => (
                    <div
                      key={i}
                      className="bg-[#0b0e14] p-4 rounded-2xl border border-gray-800"
                    >
                      <input
                        placeholder="Color Name"
                        value={g.color}
                        onChange={(e) => {
                          const n = [...imageGroups];
                          n[i].color = e.target.value;
                          setImageGroups(n);
                        }}
                        className="w-full bg-transparent border-b border-gray-800 mb-2 text-xs font-bold py-1 outline-none"
                      />
                      <textarea
                        placeholder="Paste URLs (one per line)"
                        value={g.urls}
                        onChange={(e) => {
                          const n = [...imageGroups];
                          n[i].urls = e.target.value;
                          setImageGroups(n);
                        }}
                        className="w-full bg-transparent text-[10px] font-mono h-24 outline-none resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: DETAILED OPTIONS */}
              <div className="col-span-12 lg:col-span-5 border-l border-gray-800 pl-10 space-y-8">
                <h3 className="text-blue-500 text-xs font-black uppercase tracking-widest">
                  Optional Equipment
                </h3>
                <div className="space-y-3">
                  <p className="text-[10px] text-gray-400 font-black">
                    INTERIOR MATERIALS
                  </p>
                  {interiors.map((it, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2">
                      <input
                        placeholder="Material"
                        className="col-span-5 bg-[#0b0e14] p-2 rounded text-[10px]"
                        value={it.name}
                        onChange={(e) => {
                          const n = [...interiors];
                          n[idx].name = e.target.value;
                          setInteriors(n);
                        }}
                      />
                      <input
                        placeholder="Color"
                        className="col-span-4 bg-[#0b0e14] p-2 rounded text-[10px]"
                        value={it.color}
                        onChange={(e) => {
                          const n = [...interiors];
                          n[idx].color = e.target.value;
                          setInteriors(n);
                        }}
                      />
                      <input
                        type="number"
                        placeholder="$"
                        className="col-span-3 bg-[#0b0e14] p-2 rounded text-[10px]"
                        value={it.price}
                        onChange={(e) => {
                          const n = [...interiors];
                          n[idx].price = Number(e.target.value);
                          setInteriors(n);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setInteriors([
                        ...interiors,
                        { name: "", color: "", price: 0 },
                      ])
                    }
                    className="text-[9px] text-blue-500 hover:underline"
                  >
                    + Add Interior
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] text-gray-400 font-black">WHEELS</p>
                  {wheels.map((wh, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2">
                      <input
                        placeholder="Size"
                        className="col-span-5 bg-[#0b0e14] p-2 rounded text-[10px]"
                        value={wh.size}
                        onChange={(e) => {
                          const n = [...wheels];
                          n[idx].size = e.target.value;
                          setWheels(n);
                        }}
                      />
                      <input
                        placeholder="Type"
                        className="col-span-4 bg-[#0b0e14] p-2 rounded text-[10px]"
                        value={wh.type}
                        onChange={(e) => {
                          const n = [...wheels];
                          n[idx].type = e.target.value;
                          setWheels(n);
                        }}
                      />
                      <input
                        type="number"
                        placeholder="$"
                        className="col-span-3 bg-[#0b0e14] p-2 rounded text-[10px]"
                        value={wh.price}
                        onChange={(e) => {
                          const n = [...wheels];
                          n[idx].price = Number(e.target.value);
                          setWheels(n);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setWheels([...wheels, { size: "", type: "", price: 0 }])
                    }
                    className="text-[9px] text-blue-500 hover:underline"
                  >
                    + Add Wheels
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] text-gray-400 font-black">TRIMS</p>
                  {trims.map((trim, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2">
                      <input
                        placeholder="Trim Name"
                        className="col-span-9 bg-[#0b0e14] p-2 rounded text-[10px]"
                        value={trim.name}
                        onChange={(e) => {
                          const n = [...trims];
                          n[idx].name = e.target.value;
                          setTrims(n);
                        }}
                      />
                      <input
                        type="number"
                        placeholder="$"
                        className="col-span-3 bg-[#0b0e14] p-2 rounded text-[10px]"
                        value={trim.price}
                        onChange={(e) => {
                          const n = [...trims];
                          n[idx].price = Number(e.target.value);
                          setTrims(n);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTrims([...trims, { name: "", price: 0 }])}
                    className="text-[9px] text-blue-500 hover:underline"
                  >
                    + Add Trim
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] text-gray-400 font-black">
                    PACKAGES
                  </p>
                  {packages.map((pkg, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2">
                      <input
                        placeholder="Package Name"
                        className="col-span-9 bg-[#0b0e14] p-2 rounded text-[10px]"
                        value={pkg.name}
                        onChange={(e) => {
                          const n = [...packages];
                          n[idx].name = e.target.value;
                          setPackages(n);
                        }}
                      />
                      <input
                        type="number"
                        placeholder="$"
                        className="col-span-3 bg-[#0b0e14] p-2 rounded text-[10px]"
                        value={pkg.price}
                        onChange={(e) => {
                          const n = [...packages];
                          n[idx].price = Number(e.target.value);
                          setPackages(n);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setPackages([...packages, { name: "", price: 0 }])
                    }
                    className="text-[9px] text-blue-500 hover:underline"
                  >
                    + Add Package
                  </button>
                </div>
              </div>

              {/* FOOTER */}
              <div className="col-span-12 pt-10 border-t border-gray-800 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-10 py-4 rounded-2xl border border-gray-800 font-bold hover:bg-gray-800 transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <ShieldCheck size={24} />
                  )}
                  {editingCar ? "Update Configuration" : "Save New Car"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarManagement;
