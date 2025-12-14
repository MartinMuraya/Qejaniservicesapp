import Provider from "../models/Provider.js";

export const getProviders = async (req, res) => {
  const providers = await Provider.find().populate("service");
  res.json(providers);
};

export const createProvider = async (req, res) => {
  const provider = await Provider.create(req.body);
  res.json(provider);
};

export const updateProvider = async (req, res) => {
  const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(provider);
};

export const deleteProvider = async (req, res) => {
  await Provider.findByIdAndDelete(req.params.id);
  res.json({ message: "Provider deleted" });
};
