import Cart from "../models/cart.js";

export const normalizeSelectOptions = (options = {}) => ({
  color: (function (c) {
    if (!c) return null;
    // Accept string color, or object { name } or { color }
    if (typeof c === "string") return { name: c };
    if (typeof c === "object") {
      if (c.name) return c;
      if (c.color) return { name: c.color, price: c.price, hex: c.hex };
    }
    return null;
  })(options.color),

  interior:
    options.interior && typeof options.interior === "object"
      ? options.interior
      : null,

  wheels: (function (w) {
    if (!w) return null;
    if (typeof w === "string") return { size: w };
    if (typeof w === "object") return w;
    return null;
  })(options.wheels),

  trim: options.trim && typeof options.trim === "object" ? options.trim : null,

  packages: Array.isArray(options.packages) ? options.packages : [],
});

export const addToCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { carId, selectOptions, quantity, unitPrice, image } = req.body;
    // Debug incoming payload to help diagnose client shape issues
    console.log("[addToCartItem] incoming:", {
      carId,
      selectOptions,
      quantity,
      unitPrice,
      hasImage: !!image,
      imagePreview:
        typeof image === "string" ? image.slice(0, 120) : typeof image,
    });
    const safeSelectOptions = normalizeSelectOptions(selectOptions);
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        item: [],
      });
    }
    const existingItem = cart.item.find((item) => {
      const isSameCar = item.carId.toString() === carId.toString();

      const leftColor = item.selectOptions?.color;
      const rightColor = safeSelectOptions?.color;
      const leftName = leftColor ? leftColor.name || leftColor.color : null;
      const rightName = rightColor ? rightColor.name || rightColor.color : null;

      const isSameColor = leftName && rightName && leftName === rightName;
      const isSamePackages =
        JSON.stringify(item.selectOptions?.packages || []) ===
        JSON.stringify(safeSelectOptions.packages || []);

      return isSameCar && isSameColor && isSamePackages;
    });
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.item.push({
        carId,
        image,
        selectOptions: safeSelectOptions,
        quantity,
        unitPrice,
      });
    }
    await cart.save();
    return res.status(200).json({ item: cart.item });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({
      userId: userId,
    }).populate("item.carId", "images name series price");
    if (!cart) {
      return res.json({
        item: [],
      });
    }
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, quantity } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        message: "cart is not found",
      });
    }
    if (quantity < 1) {
      return res.stauts(400).json({
        message: "quantity must be at least 1",
      });
    }
    const item = cart.item.id(itemId);
    if (!item) return res.status(404).json({ message: "item is not found" });
    item.quantity = quantity;
    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        message: "your cart is not found",
      });
    }
    const item = cart.item.id(itemId);
    if (!item) {
      return res.status(404).json({
        message: "item is not found",
      });
    }
    cart.item.pull({ _id: itemId });
    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
