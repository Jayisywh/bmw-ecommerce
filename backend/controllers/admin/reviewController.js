import Review from "../../models/review.js";

export const getAllReviews = async (req, res) => {
  try {
    // Populate user details so Admin knows who wrote it
    const reviews = await Review.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: reviews,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
