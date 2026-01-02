import type { Car } from "../types/car";
import type { Config } from "../types/config";

type PreviewSectionProps = {
  car: Car;
  config: Config;
};

export default function PreviewSection({ car, config }: PreviewSectionProps) {
  const selectedColor = config.color || car.defaultColor;
  const image =
    car?.images?.[selectedColor]?.[0] || car?.images?.[car.defaultColor]?.[0];

  return (
    <div className="relative group">
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-700">
        <img
          src={image}
          alt={car.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 h-2 w-full bg-gradient-to-r from-[#1C69D2] to-[#003366]" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {/* FIX: Use || "" to ensure it's never null */}
        <Badge label="Exterior" value={config.color || ""} />
        <Badge label="Interior" value={config.interior || ""} />
        <Badge label="Wheels" value={config.size || ""} />
        {config.packages && config.packages.length > 0 && (
          <Badge
            label="Packages"
            value={`${config.packages.length} Selected`}
          />
        )}
      </div>
    </div>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm">
      <span className="text-[10px] uppercase text-gray-400 font-bold block leading-none mb-1">
        {label}
      </span>
      <span className="text-xs font-black text-gray-800 dark:text-gray-100 uppercase">
        {value || "Default"}
      </span>
    </div>
  );
}
