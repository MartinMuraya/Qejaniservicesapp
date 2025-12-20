import Provider from "../models/Provider.js";

/**
 * GET all providers
 */
export const getProviders = async (req, res) => {
  try {
    const providers = await Provider.find()
      .populate("service")
      .sort({ createdAt: -1 });

    res.json(providers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch providers" });
  }
};

/**
 * CREATE provider (image + geo)
 */
export const createProvider = async (req, res) => {
  try {
    const { name, phone, price, service, lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Location is required" });
    }

    const provider = await Provider.create({
      name,
      phone,
      price,
      service,
      image: req.file ? `/uploads/providers/${req.file.filename}` : null,
      location: {
        type: "Point",
        coordinates: [Number(lng), Number(lat)], // lng first
      },
    });

    res.status(201).json(provider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create provider" });
  }
};

/**
 * UPDATE provider (optional image & geo)
 */
export const updateProvider = async (req, res) => {
  try {
    const { lat, lng, ...rest } = req.body;

    const updateData = { ...rest };

    if (lat && lng) {
      updateData.location = {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
      };
    }

    if (req.file) {
      updateData.image = `/uploads/providers/${req.file.filename}`;
    }

    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json(provider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update provider" });
  }
};

/**
 * DELETE provider
 */
export const deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.json({ message: "Provider deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete provider" });
  }
};
