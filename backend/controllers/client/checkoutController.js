import Cart from "../../models/cart.js";
import Order from "../../models/order.js";
import Payment from "../../models/payment.js";
export const checkout = async (req, res) => {
  try {
    const userId = req.userId;
    const { fullName, phone, address, city, country, zipCode, paymentMethod } =
      req.body;
    if (!fullName || !phone || !address || !city || !country || !zipCode) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.item.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Cart is not found",
      });
    }
    const orderItems = cart.item.map((item) => ({
      carId: item.carId,
      image: item.image,
      selectOptions: item.selectOptions,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));
    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const order = await Order.create({
      userId,
      items: orderItems,
      totalPrice: totalPrice,
      orderStatus: "Pending",
      paymentStatus: "Unpaid",
      shippingAddress: {
        fullName: fullName,
        phone: phone,
        address: address,
        city: city,
        country: country,
        zipCode: zipCode,
      },
    });
    const payment = await Payment.create({
      userId: userId,
      orderId: order._id,
      amount: totalPrice,
      paymentMethod: paymentMethod,
      status: "Pending",
      transactionId: "txn_" + Date.now(),
    });
    order.paymentId = payment._id;
    await order.save();
    cart.item = [];
    await cart.save();
    return res.status(201).json({
      status: "success",
      data: order,
      orderSuccess: {
        orderId: order._id,
        transactionId: payment.transactionId,
        paymentMethod: payment.paymentMethod,
        totalPrice: order.totalPrice,
        orderStatus: order.orderStatus,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
