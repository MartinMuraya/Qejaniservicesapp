import Provider from "../models/Provider.js";
import mongoose from "mongoose";

export const getProvidersByService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: "Invalid service ID format" });
    }

    const providers = await Provider.find({ service: serviceId }).populate("service");

    res.json(providers);
  } catch (err) {
    console.error("Error fetching providers:", err);
    res.status(500).json({ message: "Failed to fetch providers for this service" });
  }
};