import Car from "../models/car.js";
import CarOption from "../models/carOption.js";

export const getCarOptionsById = async (req, res) => {
  try {
    const { carId } = req.params;
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        status: "fail",
        message: "Car not found",
      });
    }
    const carOptions = await CarOption.findOne({ carId: carId }).lean();
    if (!carOptions)
      return res.status(404).json({
        status: "fail",
        message: "Car options are not found for that car",
      });
    return res.status(200).json(carOptions);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
