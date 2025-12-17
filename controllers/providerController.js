import Provider from "../models/Provider.js";
import mongoose from "mongoose";

export const getProvidersByService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: "Invalid service ID format" });
    }

   const providers = await Provider.find({
  service: new mongoose.Types.ObjectId(serviceId)
  }).populate('service');

    res.json(providers);
  } catch (err) {
    console.error("Error fetching providers:", err);
    res.status(500).json({ message: "Failed to fetch providers for this service" });
  }
};

// getting sing provider by ID

export const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid provider ID format" });
    }

    const provider = await Provider.findById(id).populate("service");

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json(provider);
  } catch (err) {
    console.error("Error fetching provider:", err);
    res.status(500).json({ message: "Failed to fetch provider" });
  }
};

export const getProvidersNearUser = async (req, res) => {
  try {
    const { lat, lng, radius = 5000, serviceId } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Location required" });
    }

    const query = {
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    };

    if (serviceId) {
      query.service = serviceId;
    }

    const providers = await Provider
      .find(query)
      .populate("service");

    res.json(providers);
  } catch (err) {
    console.error("Nearby providers error:", err);
    res.status(500).json({ message: "Failed to fetch nearby providers" });
  }
};

