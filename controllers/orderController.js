import Order from "../models/Order.js";
import Provider from "../models/Provider.js";
import User from "../models/User.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { providerId, serviceId } = req.body;

    const provider = await Provider.findById(providerId);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    const order = await Order.create({
      user: userId,
      provider: providerId,
      service: serviceId,
      amount: provider.price,
      status: "pending",
    });

    res.json({ message: "Booking successful", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate("provider", "name service phone")
      .populate("service", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
