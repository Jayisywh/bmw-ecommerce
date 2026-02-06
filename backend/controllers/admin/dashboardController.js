import User from "../../models/user.js";
import Order from "../../models/order.js";
import Payment from "../../models/payment.js";

// GET /api/admin/dashboard
export const getDashboardSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalOrders = await Order.countDocuments();

    // Total revenue from successful payments
    const revenueResult = await Payment.aggregate([
      { $match: { status: "Success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });

    // Order status counts
    const statusAgg = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);
    const orderStatusCounts = {};
    statusAgg.forEach((s) => {
      orderStatusCounts[s._id] = s.count;
    });

    // Monthly sales for last 12 months (based on createdAt)
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const monthlyAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // build array of 12 months
    const monthlySales = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const found = monthlyAgg.find(
        (m) => m._id.year === year && m._id.month === month,
      );
      monthlySales.push(found ? found.total : 0);
    }

    return res.status(200).json({
      status: "success",
      data: {
        totalUsers,
        totalOrders,
        totalRevenue,
        pendingOrders,
        orderStatusCounts,
        monthlySales,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};
