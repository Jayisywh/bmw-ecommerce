import mongoose from "mongoose";
import Car from "../../models/car.js";
import CarOption from "../../models/carOption.js";

/* ----------------- HELPERS ----------------- */

const formatOptions = (data) => {
  if (!data) return [];
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(data) ? data.filter(Boolean) : [];
};

const validateWheels = (wheels) =>
  wheels
    .map((w) => ({
      size: String(w.size || ""),
      type: String(w.type || ""),
      price: Number(w.price) || 0,
    }))
    .filter((w) => w.size);

/* ----------------- GET ALL CARS ----------------- */

export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find()
      .populate("categoryId", "name") // ✅ FIX
      .sort({ createdAt: -1 })
      .lean();

    const carsWithOptions = await Promise.all(
      cars.map(async (car) => {
        const options = await CarOption.findOne({ carId: car._id }).lean();
        if (!options) return car;

        const { _id, carId, ...opts } = options;
        return { ...car, ...opts };
      }),
    );

    res.status(200).json({ status: "success", data: carsWithOptions });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

/* ----------------- CREATE CAR ----------------- */

export const createCar = async (req, res) => {
  try {
    const { interior, size, trims, package: pkg, ...carData } = req.body;

    if (
      !carData.categoryId ||
      !mongoose.Types.ObjectId.isValid(carData.categoryId)
    ) {
      return res
        .status(400)
        .json({ status: "fail", message: "Valid categoryId is required" });
    }

    const newCar = await Car.create({
      name: carData.name,
      series: carData.series,
      price: Number(carData.price),
      categoryId: carData.categoryId,
      engineType: carData.engineType,
      horsePower: carData.horsePower,
      colors: carData.colors || [],
      images: carData.images || {},
      defaultColor: carData.defaultColor || "black",
      isFeatured: Boolean(carData.isFeatured),
    });

    await CarOption.findOneAndUpdate(
      { carId: newCar._id },
      {
        carId: newCar._id,
        interior: formatOptions(interior),
        size: validateWheels(formatOptions(size)),
        trims: formatOptions(trims),
        package: formatOptions(pkg),
      },
      { upsert: true, new: true },
    );

    const finalCar = await Car.findById(newCar._id)
      .populate("categoryId", "name")
      .lean();

    res.status(201).json({ status: "success", data: finalCar });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

/* ----------------- UPDATE CAR ----------------- */

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { interior, size, trims, package: pkg, ...carData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid Car ID" });
    }

    const updatePayload = {
      name: carData.name,
      series: carData.series,
      price: Number(carData.price),
      engineType: carData.engineType,
      horsePower: carData.horsePower,
      colors: carData.colors || [],
      images: carData.images || {},
      isFeatured: Boolean(carData.isFeatured),
    };

    // ✅ ONLY update category if sent
    if (
      carData.categoryId &&
      mongoose.Types.ObjectId.isValid(carData.categoryId)
    ) {
      updatePayload.categoryId = carData.categoryId;
    }

    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true, runValidators: true },
    )
      .populate("categoryId", "name")
      .lean();

    if (!updatedCar) {
      return res.status(404).json({ status: "fail", message: "Car not found" });
    }

    await CarOption.findOneAndUpdate(
      { carId: id },
      {
        $set: {
          interior: formatOptions(interior),
          size: validateWheels(formatOptions(size)),
          trims: formatOptions(trims),
          package: formatOptions(pkg),
        },
      },
      { upsert: true },
    );

    res.status(200).json({ status: "success", data: updatedCar });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

/* ----------------- DELETE CAR ----------------- */

export const deleteCar = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    await CarOption.findOneAndDelete({ carId: req.params.id });

    res.status(200).json({ status: "success", message: "Car deleted" });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
