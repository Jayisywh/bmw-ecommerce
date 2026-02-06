import category from "../../models/category.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await category.find().lean();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
