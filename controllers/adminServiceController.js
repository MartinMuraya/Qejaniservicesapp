import Service from "../models/Service.js";

// GET all services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

// CREATE new service
export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Failed to create service" });
  }
};

// UPDATE service
export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Failed to update service" });
  }
};

// DELETE service
export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete service" });
  }
};
