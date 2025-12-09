import Provider from "../models/Provider.js";

export const getProvidersByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const providers = await Provider.find({ service: serviceId, active: true });
    res.json(providers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch providers for this service" });
  }
};
