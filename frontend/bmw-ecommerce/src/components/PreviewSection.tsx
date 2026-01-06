import type { Car } from "../types/car";
import type { Config } from "../types/config";

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
    <div className="px-3 py-2 rounded-full border">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-black">{value || "Default"}</p>
    </div>
  );
}
