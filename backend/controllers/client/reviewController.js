import Review from "../../models/review.js";

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Simple validation
    if (!rating || !comment) {
      return res
        .status(400)
        .json({ status: "fail", message: "Please provide rating and comment" });
    }

    const newReview = await Review.create({
      userId: req.userId,
      rating,
      comment,
    });

    res.status(201).json({
      status: "success",
      data: newReview,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
