import Order from "../../models/order.js";
import User from "../../models/user.js";
import Cart from "../../models/cart.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.json(user);
  } catch (err) {
    return res.status(500).json({
      message: "Server or network error",
    });
  }
};

export const getUserinfo = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "user is not found",
      });
    }
    const favoriteCount = user.preferences.favoriteModels.length || 0;
    const cart = await Cart.findOne({ userId });
    const cartItemCount = cart
      ? cart.item.reduce((sum, item) => sum + item.quantity, 0)
      : 0;
    const order = await Order.findOne({ userId });
    const orderItemCount = order
      ? order.items.reduce((sum, item) => sum + item.quantity, 0)
      : 0;
    return res.status(200).json({
      status: "success",
      data: {
        name: user.name,
        email: user.email,
        favoriteCount: favoriteCount,
        cartItemCount: cartItemCount,
        orderItemCount: orderItemCount,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
