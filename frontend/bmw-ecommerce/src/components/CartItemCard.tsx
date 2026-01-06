import { useCart } from "../hooks/useCart";

export default function CartItemCard({ item }: { item: any }) {
  const { updateCartItem, removeCartItem } = useCart();

  return (
    <div
      className="
      flex gap-6 p-6 rounded-2xl
      bg-white dark:bg-[#111827]
      border border-gray-200 dark:border-gray-800
    "
    >
      {/* Image */}
      <img src={item.image} className="w-44 h-28 object-cover rounded-xl" />

      {/* Info */}
      <div className="flex-1">
        <h2 className="text-lg font-bold">BMW Vehicle</h2>

        <p className="text-sm text-gray-500 mt-1">
          Color:{" "}
          <span className="font-semibold">
            {item.selectOptions?.color?.name ||
              item.selectOptions?.color?.color ||
              item.selectOptions?.color ||
              "Default"}
          </span>
        </p>
        {/* Controls */}
        <div className="mt-4 flex items-end justify-between">
          {/* Left side */}
          <div className="space-y-2">
            {/* Quantity */}
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updateCartItem(item._id, Math.max(1, item.quantity - 1))
                }
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"
              >
                −
              </button>

              <span className="font-bold">{item.quantity}</span>

              <button
                onClick={() => updateCartItem(item._id, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"
              >
                +
              </button>
            </div>

            {/* Configuration info */}
            <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-zinc-400">
              {item.selectOptions?.wheels && (
                <p>
                  Wheels:{" "}
                  <span className="font-medium">
                    {item.selectOptions.wheels.size}
                  </span>
                </p>
              )}

              {item.selectOptions?.interior && (
                <p>
                  Interior:{" "}
                  <span className="font-medium">
                    {item.selectOptions.interior.name}
                  </span>
                </p>
              )}

              {item.selectOptions?.trim && (
                <p>
                  Trim:{" "}
                  <span className="font-medium">
                    {item.selectOptions.trim.name}
                  </span>
                </p>
              )}

              {item.selectOptions?.packages?.length > 0 && (
                <p>
                  Packages:{" "}
                  <span className="font-medium">
                    {item.selectOptions.packages.map((p) => p.name).join(", ")}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6">
            <span className="font-black text-lg">
              ${item.unitPrice * item.quantity}
            </span>

            <button
              onClick={() => removeCartItem(item._id)}
              className="text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
