import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Otp from "../../models/otp.js";
import { sendEmail } from "../../utils/sendEmail.js";
import user from "../../models/user.js";
import randomstring from "randomstring";
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "The email is already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(201).json({
      status: "success",
      message: "Sign up successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const { name } = req.body;
    const isExisted = await User.findById(req.user.userId);
    if (!isExisted) {
      return res.status(404).json({
        status: "fail",
        message: "User is not found",
      });
    }
    const updateUser = await User.findByIdAndDelete(
      req.user.userId,
      { name },
      { new: true, runValidators: true },
    ).select("-password");
    return res.status(201).json({
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

export const requestPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({
        status: "fail",
        message: "Email is required",
      });
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(404).json({
        status: "fail",
        message: "User is not found",
      });
    const otpCode = randomstring.generate({
      length: 6,
      charset: "numeric",
    });
    await Otp.create({
      email: email,
      otp: otpCode,
    });
    await sendEmail(
      email,
      "Your Password Reset Code",
      `Your OTP code is ${otpCode}, It expires in 5 minutes.`,
    );
    return res.status(200).json({
      status: "success",
      message: "OTP code sent to your email",
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }
    const verifyOtp = await Otp.findOne({ email, otp });
    if (!verifyOtp)
      return res.status(400).json({
        status: "fail",
        message: "Invalid or expire OTP code",
      });
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await user.findOneAndUpdate(
      {
        email,
      },
      {
        password: hashedPassword,
      },
    );
    await Otp.findByIdAndDelete(verifyOtp._id);
    return res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
