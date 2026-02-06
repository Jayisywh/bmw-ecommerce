import Cart from "../models/cart.js";

export const addToCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { carId, selectOptions, quantity, totalPrice, image } = req.body;
    console.log("REQ BODY:", req.body);
    console.log("USER:", req.userId);
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        item: [],
      });
    }
    const existingItem = cart.item.find((item) => {
      const isSameCar = item.carId.toString() === carId.toString();
      const isSameColor = item.selectOptions.color === selectOptions.color;
      const isSamePackages =
        JSON.stringify(item.selectOptions.packages) ===
        JSON.stringify(selectOptions.packages);

      return isSameCar && isSameColor && isSamePackages;
    });
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice += totalPrice * quantity;
    } else {
      cart.item.push({
        carId,
        image,
        selectOptions: selectOptions,
        quantity,
        totalPrice,
      });
    }
    await cart.save();
    await cart.populate("item.carId", "images name series price");
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
      return res.staus(400).json({
        message: "quantity must be at least 1",
      });
    }
    const item = cart.item.id(itemId);
    if (!item) return res.status(404).json({ message: "item is not found" });
    item.quantity = quantity;
    await cart.save();
    await cart.populate("item.carId", "images name series price");
    return res.status(200).json({ item: cart.item });
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
    item.remove();
    await cart.save();
    await cart.populate("item.carId", "images name series price");
    return res.status(200).json({ item: cart.item });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
