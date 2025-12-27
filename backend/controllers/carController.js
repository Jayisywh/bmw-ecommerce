import Category from "../models/category.js";
import Car from "../models/car.js";
import mongoose from "mongoose";

export const getAllCar = async (req, res) => {
  try {
    const cars = await Car.find();
    if (cars.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "cars are not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: cars,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({
        status: "fail",
        message: "car detail is not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: {
        car,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const addCar = async (req, res) => {
  try {
    const {
      name,
      series,
      price,
      categoryId,
      engineType,
      horsePower,
      colors,
      images,
      isFeatured,
      defaultColor,
    } = req.body;
    if (
      !name ||
      !series ||
      typeof price !== "number" ||
      !mongoose.Types.ObjectId.isValid(categoryId) ||
      !engineType ||
      !horsePower ||
      !Array.isArray(colors) ||
      typeof images !== "object" ||
      images === null
    ) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required to add a car",
      });
    }
    const isCategoryExist = await Category.findById(categoryId);
    if (!isCategoryExist) {
      return res.status(404).json({
        status: "fail",
        message: "Category is not exist",
      });
    }
    const newCar = await Car.create({
      name,
      series,
      price,
      categoryId,
      engineType,
      horsePower,
      colors,
      images,
      isFeatured,
      defaultColor,
    });
    await newCar.save();
    return res.status(201).json({
      status: "success",
      data: {
        newCar,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
