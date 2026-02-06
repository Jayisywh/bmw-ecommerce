import user from "../../models/user.js";
import bcrypt from "bcryptjs";
export const getAllUser = async (req, res) => {
  try {
    const users = await user.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "userOrders",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          totalOrders: { $size: "$userOrders" },
        },
      },
    ]);
    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "all fields are rquired to create an user",
      });
    }
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "email is already registered",
      });
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await user.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    return res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        status: "fail",
        message: "name and email are required",
      });
    }
    const existingUser = await user.findById(id);
    if (!existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "the user is not existed",
      });
    }
    const updateFields = {
      name,
      email,
      role,
    };

    // Only update password if provided and not empty
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const updateUser = await user.findByIdAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true },
    );
    return res.status(200).json({
      status: "success",
      data: updateUser,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const isUser = await user.findById(id);
    if (!isUser) {
      return res.status(404).json({
        status: "fail",
        message: "user is not found",
      });
    }
    const deleteUser = await user.findByIdAndDelete(id);
    return res.status(200).json({
      status: "success",
      message: "user deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
