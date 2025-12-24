import User from "../models/user.js";

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
