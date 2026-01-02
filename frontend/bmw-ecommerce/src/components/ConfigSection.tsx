import { Check } from "lucide-react";
import type { CarOptions, Config } from "../types/config";

type ConfigSectionProps = {
  options: CarOptions;
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

export default function ConfigSection({
  options,
  config,
  setConfig,
}: ConfigSectionProps) {
  // ADD THIS LOG: Check your browser console to see what 'options' actually contains
  console.log("Current Car Options from DB:", options);

  const togglePackage = (pkgName: string) => {
    setConfig((prev) => ({
      ...prev,
      packages: prev.packages.includes(pkgName)
        ? prev.packages.filter((p) => p !== pkgName)
        : [...prev.packages, pkgName],
    }));
  };

  return (
    <div className="space-y-12 pb-24">
      {/* 01. EXTERIOR COLORS */}
      <section>
        <SectionHeader
          number="01"
          title="Exterior Paint"
          selected={config.color || "Not Selected"}
        />
        <div className="flex flex-wrap gap-4 mt-4">
          {(options.colors || []).map((c) => (
            <button
              key={c.color}
              onClick={() => setConfig({ ...config, color: c.color })}
              className={`p-1 rounded-full border-2 transition-all ${
                config.color === c.color
                  ? "border-[#1C69D2] scale-110"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <div
                className="w-10 h-10 rounded-full border border-black/10"
                style={{
                  backgroundColor: c.color.toLowerCase().replace(/\s/g, ""),
                }}
              />
            </button>
          ))}
        </div>
      </section>

      {/* 02. WHEELS & SIZES - MAPPING size ARRAY FROM DB */}
      <section>
        <SectionHeader
          number="02"
          title="Wheels & Sizes"
          selected={config.size || "Not Selected"}
        />
        <div className="grid grid-cols-1 gap-3 mt-4">
          {/* We check specifically for the 'size' array from your DB screenshot */}
          {options.size && options.size.length > 0 ? (
            options.size.map((s, index) => (
              <button
                key={`${s.size}-${s.type}-${index}`}
                onClick={() => setConfig({ ...config, size: s.size })}
                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                  config.size === s.size
                    ? "border-[#1C69D2] bg-blue-50 dark:bg-blue-900/10 shadow-sm"
                    : "border-gray-100 dark:border-gray-800 hover:border-gray-300"
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {s.size} {s.type} Design
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                    BMW M Performance
                  </p>
                </div>
                <p className="text-sm font-black text-[#1C69D2]">
                  + ${s.price?.toLocaleString()}
                </p>
              </button>
            ))
          ) : (
            <div className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-center">
              <p className="text-xs text-gray-400 uppercase font-bold italic">
                No Wheel Options Found (Check Browser Console)
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 03. INTERIOR & MATERIAL */}
      <section>
        <SectionHeader
          number="03"
          title="Interior & Material"
          selected={config.interior || "Not Selected"}
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          {(options.interior || []).map((i) => (
            <button
              key={i.name}
              onClick={() => setConfig({ ...config, interior: i.name })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                config.interior === i.name
                  ? "border-[#1C69D2] bg-blue-50 dark:bg-blue-900/10"
                  : "border-gray-100 dark:border-gray-800 hover:border-gray-300"
              }`}
            >
              <p className="text-xs font-black uppercase text-gray-900 dark:text-white">
                {i.name}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">
                {i.color}
              </p>
              <p className="text-xs font-bold text-[#1C69D2]">
                + ${i.price.toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 04. INTERIOR TRIM */}
      <section>
        <SectionHeader
          number="04"
          title="Interior Trim"
          selected={config.trims || "Not Selected"}
        />
        <div className="grid grid-cols-1 gap-3 mt-4">
          {(options.trims || []).map((t) => (
            <button
              key={t.name}
              onClick={() => setConfig({ ...config, trims: t.name })}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                config.trims === t.name
                  ? "border-[#1C69D2] bg-blue-50 dark:bg-blue-900/10"
                  : "border-gray-100 dark:border-gray-800 hover:border-gray-300"
              }`}
            >
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {t.name}
              </p>
              <p className="text-sm font-black text-[#1C69D2]">
                + ${t.price.toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 05. OPTIONAL PACKAGES */}
      <section>
        <SectionHeader
          number="05"
          title="Optional Packages"
          selected={`${config.packages.length} Selected`}
        />
        <div className="space-y-3 mt-4">
          {(options.package || []).map((pkg) => {
            const isSelected = config.packages.includes(pkg.name);
            return (
              <div
                key={pkg.name}
                onClick={() => togglePackage(pkg.name)}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-[#1C69D2] bg-blue-50 dark:bg-blue-900/10"
                    : "border-gray-100 dark:border-gray-800"
                }`}
              >
                <div className="flex gap-4 items-center">
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? "bg-[#1C69D2] border-[#1C69D2]"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <Check size={14} className="text-white" strokeWidth={4} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {pkg.name}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                      Premium Equipment
                    </p>
                  </div>
                </div>
                <p className="text-sm font-black text-[#1C69D2]">
                  + ${pkg.price.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  number,
  title,
  selected,
}: {
  number: string;
  title: string;
  selected: string;
}) {
  return (
    <header className="flex items-baseline justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black text-[#1C69D2]">{number}</span>
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <span className="text-[10px] font-bold text-gray-400 uppercase">
        {selected}
      </span>
    </header>
  );
}
