import Order from "../../models/order.js";

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("paymentId", "paymentMethod status transactionId")
      .sort({ createdAt: -1 });
    return res.status(200).json({ status: "success", data: orders });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};

// Get single order by id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("userId", "name email")
      .populate("paymentId", "paymentMethod status transactionId amount");
    if (!order)
      return res
        .status(404)
        .json({ status: "fail", message: "Order not found" });
    return res.status(200).json({ status: "success", data: order });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};

// Update order (e.g., status or paymentStatus)
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const updated = await Order.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true },
    );
    if (!updated)
      return res
        .status(404)
        .json({ status: "fail", message: "Order not found" });
    return res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};

// Create a new order (admin)
export const createOrder = async (req, res) => {
  try {
    const payload = req.body;
    // basic validation
    if (
      !payload.userId ||
      !Array.isArray(payload.items) ||
      !payload.items.length
    ) {
      return res
        .status(400)
        .json({ status: "fail", message: "userId and items are required" });
    }
    const newOrder = await Order.create(payload);
    return res.status(201).json({ status: "success", data: newOrder });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Order.findById(id);
    if (!existing)
      return res
        .status(404)
        .json({ status: "fail", message: "Order not found" });
    await Order.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ status: "success", message: "Order deleted" });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};
