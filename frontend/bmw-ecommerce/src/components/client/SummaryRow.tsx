export default function SummaryRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between mb-4">
      <span className={bold ? "font-black" : "text-gray-500"}>{label}</span>
      <span className={bold ? "font-black" : "font-semibold"}>{value}</span>
    </div>
  );
}
