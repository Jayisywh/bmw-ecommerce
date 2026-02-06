import React, { useState } from "react";
import { X, Upload, Plus } from "lucide-react";

const EditCarModal = ({ isOpen, onClose, car }: any) => {
  const [activeTab, setActiveTab] = useState("Details");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#161927] w-full max-w-3xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Car</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-gray-800">
          {["Details", "Images", "Options"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium transition-all relative ${
                activeTab === tab
                  ? "text-blue-500"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Car {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {activeTab === "Details" && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-semibold uppercase">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={car?.name}
                  className="w-full bg-[#0f111a] border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-semibold uppercase">
                  Series
                </label>
                <select className="w-full bg-[#0f111a] border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option>{car?.series}</option>
                  <option>M Series</option>
                  <option>X Series</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-semibold uppercase">
                  Category
                </label>
                <select className="w-full bg-[#0f111a] border border-gray-800 rounded-xl px-4 py-2.5 text-sm">
                  <option>{car?.category}</option>
                  <option>Sports</option>
                  <option>SUV</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-semibold uppercase">
                  Base Price
                </label>
                <input
                  type="text"
                  defaultValue={car?.price}
                  className="w-full bg-[#0f111a] border border-gray-800 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
              <div className="col-span-2 flex items-center gap-3 py-2">
                <div
                  className={`w-10 h-5 rounded-full relative cursor-pointer ${
                    car?.isFeatured ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 bg-white rounded-full ${
                      car?.isFeatured ? "left-6" : "left-1"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium">Featured Car</span>
              </div>
            </div>
          )}

          {activeTab === "Images" && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer">
                <Upload size={32} className="mb-2" />
                <p className="text-sm">
                  Drag and drop images here, or click to browse
                </p>
                <button className="mt-4 bg-[#1a1d2e] text-gray-200 px-4 py-2 rounded-lg text-xs font-semibold">
                  Upload Images
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {["Alpine White", "Black Sapphire", "Brooklyn Grey"].map(
                  (color) => (
                    <div key={color} className="text-center">
                      <div className="aspect-video bg-[#0f111a] border border-gray-800 rounded-xl mb-2 flex items-center justify-center text-gray-600 text-[10px] uppercase font-bold tracking-tighter">
                        No Image
                      </div>
                      <p className="text-xs text-gray-400">{color}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {activeTab === "Options" && (
            <div className="space-y-8">
              <OptionSection
                title="Interior Options"
                items={[
                  { name: "Vernasca Leather - Black", price: 2500 },
                  { name: "Merino Leather - Cognac", price: 4200 },
                ]}
              />
              <OptionSection
                title="Wheel Options"
                items={[
                  { name: '19" M Double-spoke', price: 0 },
                  { name: '20" M Y-spoke - Jet Black', price: 1800 },
                ]}
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3 bg-[#1a1d2e]/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button className="px-6 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const OptionSection = ({ title, items }: any) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
        {title}
      </h3>
      <button className="text-xs font-semibold text-blue-500 flex items-center gap-1 hover:text-blue-400">
        <Plus size={14} /> Add Option
      </button>
    </div>
    <div className="space-y-2">
      {items.map((item: any, i: number) => (
        <div
          key={i}
          className="flex justify-between items-center bg-[#0f111a] p-4 rounded-xl border border-gray-800"
        >
          <span className="text-sm text-gray-300">{item.name}</span>
          <span className="text-sm font-bold text-blue-400">
            {item.price === 0 ? "Included" : `+$${item.price.toLocaleString()}`}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default EditCarModal;
