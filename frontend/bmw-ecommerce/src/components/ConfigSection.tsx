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
  const togglePackage = (pkgName: string) => {
    const pkgObj = options.package.find((p) => p.name === pkgName);
    if (!pkgObj) return;

    setConfig((prev) => ({
      ...prev,
      packages: prev.packages.some((p) => p.name === pkgName)
        ? prev.packages.filter((p) => p.name !== pkgName)
        : [...prev.packages, pkgObj],
    }));
  };

  return (
    <div className="space-y-12 pb-24">
      <section>
        <SectionHeader
          number="01"
          title="Exterior Paint"
          selected={config.color?.name || "Not Selected"}
        />

        <div className="flex flex-wrap gap-4 mt-4">
          {options.colors.map((c) => {
            const isSelected = config.color?.name === c.color;

            return (
              <button
                key={c.color}
                onClick={() =>
                  setConfig({
                    ...config,
                    color: {
                      name: c.color,
                      price: c.price,
                    },
                  })
                }
                className={`p-1 rounded-full border-2 transition-all ${
                  isSelected
                    ? "border-[#1C69D2] scale-110"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-xs font-black">
                  {c.color.slice(0, 2)}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 02. WHEELS */}
      <section>
        <SectionHeader
          number="02"
          title="Wheels & Sizes"
          selected={config.wheels?.size || "Not Selected"}
        />

        <div className="grid grid-cols-1 gap-3 mt-4">
          {options.size.map((s, i) => (
            <button
              key={i}
              onClick={() => setConfig({ ...config, wheels: s })}
              className={`flex justify-between p-4 rounded-xl border-2 ${
                config.wheels?.size === s.size
                  ? "border-[#1C69D2] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div>
                <p className="font-bold">
                  {s.size} {s.type}
                </p>
                <p className="text-xs text-gray-400">BMW M Performance</p>
              </div>
              <p className="font-black text-[#1C69D2]">
                + ${s.price.toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 03. INTERIOR */}
      <section>
        <SectionHeader
          number="03"
          title="Interior & Material"
          selected={config.interior?.name || "Not Selected"}
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          {options.interior.map((i) => (
            <button
              key={i.name}
              onClick={() => setConfig({ ...config, interior: i })}
              className={`p-4 rounded-xl border-2 ${
                config.interior?.name === i.name
                  ? "border-[#1C69D2] bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <p className="font-bold">{i.name}</p>
              <p className="text-xs text-gray-400">{i.color}</p>
              <p className="font-black text-[#1C69D2]">
                + ${i.price.toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 04. TRIM */}
      <section>
        <SectionHeader
          number="04"
          title="Interior Trim"
          selected={config.trim?.name || "Not Selected"}
        />

        <div className="space-y-3 mt-4">
          {options.trims.map((t) => (
            <button
              key={t.name}
              onClick={() => setConfig({ ...config, trim: t })}
              className={`flex justify-between p-4 rounded-xl border-2 ${
                config.trim?.name === t.name
                  ? "border-[#1C69D2] bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <p className="font-bold">{t.name}</p>
              <p className="font-black text-[#1C69D2]">
                + ${t.price.toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 05. PACKAGES */}
      <section>
        <SectionHeader
          number="05"
          title="Optional Packages"
          selected={`${config.packages.length} Selected`}
        />

        <div className="space-y-3 mt-4">
          {options.package.map((pkg) => {
            const selected = config.packages.some((p) => p.name === pkg.name);
            return (
              <div
                key={pkg.name}
                onClick={() => togglePackage(pkg.name)}
                className={`flex justify-between p-5 rounded-2xl border-2 cursor-pointer ${
                  selected ? "border-[#1C69D2] bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="flex gap-3 items-center">
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      selected ? "bg-[#1C69D2] border-[#1C69D2]" : ""
                    }`}
                  >
                    {selected && <Check size={14} className="text-white" />}
                  </div>
                  <p className="font-bold">{pkg.name}</p>
                </div>
                <p className="font-black text-[#1C69D2]">
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
    <div className="flex justify-between border-b pb-2">
      <div className="flex gap-3">
        <span className="text-xs text-[#1C69D2]">{number}</span>
        <h3 className="font-black uppercase">{title}</h3>
      </div>
      <span className="text-xs text-gray-400">{selected}</span>
    </div>
  );
}
