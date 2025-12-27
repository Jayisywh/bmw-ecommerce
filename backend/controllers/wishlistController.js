import User from "../models/user.js";

export const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select(
      "preferences.favoriteModels"
    );
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User is not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: {
        wishlist: user.preferences.favoriteModels,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { carId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "user is not found",
      });
    }
    const isExisting = user.preferences.favoriteModels.find(
      (item) => item.carId.toString() === carId.toString()
    );
    if (!isExisting) {
      user.preferences.favoriteModels.push({ carId });
    } else {
      user.preferences.favoriteModels = user.preferences.favoriteModels.filter(
        (item) => item.carId.toString() !== carId.toString()
      );
    }
    await user.save();
    return res.status(200).json(user.preferences.favoriteModels);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
