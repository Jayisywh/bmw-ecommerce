import Payment from "../../models/payment.js";

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email")
      .populate("orderId", "totalPrice createdAt")
      .sort({ createdAt: -1 });
    return res.status(200).json({ status: "success", data: payments });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id)
      .populate("userId", "name email")
      .populate("orderId");
    if (!payment)
      return res
        .status(404)
        .json({ status: "fail", message: "Payment not found" });
    return res.status(200).json({ status: "success", data: payment });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const updated = await Payment.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true },
    );
    if (!updated)
      return res
        .status(404)
        .json({ status: "fail", message: "Payment not found" });
    return res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};

// Create a payment record (admin)
export const createPayment = async (req, res) => {
  try {
    const { userId, orderId, amount, paymentMethod, status, transactionId } =
      req.body;
    if (!userId || !orderId || typeof amount !== "number" || !paymentMethod) {
      return res.status(400).json({
        status: "fail",
        message: "userId, orderId, amount, paymentMethod are required",
      });
    }
    const newPayment = await Payment.create({
      userId,
      orderId,
      amount,
      paymentMethod,
      status: status || "Pending",
      transactionId,
    });
    return res.status(201).json({ status: "success", data: newPayment });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};

// Delete a payment (admin)
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Payment.findById(id);
    if (!existing)
      return res
        .status(404)
        .json({ status: "fail", message: "Payment not found" });
    await Payment.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ status: "success", message: "Payment deleted" });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};
