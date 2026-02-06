import type { Car } from "../../types/car";
import type { Config } from "../../types/config";

type PreviewSectionProps = {
  car: Car;
  config: Config;
};

export default function PreviewSection({ car, config }: PreviewSectionProps) {
  const colorKey = config.color?.name || car.defaultColor;
  const image =
    car.images?.[colorKey]?.[0] || car.images?.[car.defaultColor]?.[0];

  return (
    <div>
      <img src={image} alt={car.name} className="rounded-3xl" />

      <div className="flex gap-2 mt-4">
        <Badge label="Color" value={config.color?.name} />
        <Badge label="Wheels" value={config.wheels?.size} />
        <Badge label="Interior" value={config.interior?.name} />
        <Badge label="Trim" value={config.trim?.name} />
        {config.packages.length > 0 && (
          <Badge label="Packages" value={`${config.packages.length}`} />
        )}
      </div>
    </div>
  );
}

function Badge({ label, value }: { label: string; value?: string }) {
  return (
    <div className="px-3 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827]">
      <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
      <p className="text-sm font-black text-gray-900 dark:text-gray-100">{value || "Default"}</p>
    </div>
  );
}
