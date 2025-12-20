import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    phone: { type: String, required: true },
    price: { type: Number, required: true },

    walletBalance: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },

    // 📍 GEO LOCATION
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    }
  },
  { timestamps: true }
);

// 🔥 REQUIRED FOR GEO QUERIES
providerSchema.index({ location: "2dsphere" });

export default mongoose.model("Provider", providerSchema);
