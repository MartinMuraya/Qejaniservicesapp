import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";
import MapPicker from "../components/MapPicker";

export default function AdminCreateProvider() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    price: "",
    service: "",
  });

  const [location, setLocation] = useState(null); // 🔥 NEW
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      toast.error("Please select provider location on the map");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );

      // 📍 GEO LOCATION
      formData.append("lat", location.lat);
      formData.append("lng", location.lng);

      // 🖼 IMAGE
      if (image) formData.append("image", image);

      await api.post("/admin/providers", formData);

      toast.success("Provider created successfully");

      // optional reset
      setForm({ name: "", phone: "", price: "", service: "" });
      setImage(null);
      setPreview(null);
      setLocation(null);
    } catch (err) {
      toast.error("Failed to create provider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Provider</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Provider Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* 🗺 MAP PICKER */}
        <div>
          <p className="font-medium mb-2">Select Provider Location</p>
          <MapPicker onLocationSelect={setLocation} />
          {location && (
            <p className="text-sm text-gray-600 mt-1">
              Lat: {location.lat.toFixed(5)}, Lng: {location.lng.toFixed(5)}
            </p>
          )}
        </div>

        {/* 🖼 IMAGE INPUT */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="w-full"
        />

        {/* 🖼 IMAGE PREVIEW */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded"
          />
        )}

        <button
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Saving..." : "Create Provider"}
        </button>
      </form>
    </div>
  );
}
