import CarOption from "../../models/carOption.js";

// SAVE OR UPDATE CAR OPTIONS
export const saveCarOptions = async (req, res) => {
  try {
    const {
      carId,
      interior = [],
      size = [],
      trims = [],
      package: pkg = [],
    } = req.body;

    const options = await CarOption.findOneAndUpdate(
      { carId },
      {
        $set: {
          carId,
          interior,
          size,
          trims,
          package: pkg,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(200).json({ status: "success", data: options });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// GET OPTIONS BY CAR ID
export const getOptionsByCarId = async (req, res) => {
  try {
    const options = await CarOption.findOne({ carId: req.params.carId }).lean();
    res.status(200).json({ status: "success", data: options });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
