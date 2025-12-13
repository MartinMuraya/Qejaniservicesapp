import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from "./config/db.js";   // <-- IMPORTANT
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import mpesaRoutes from './routes/mpesaRoutes.js';
import dataRoutes from "./routes/dataRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5174', 
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mpesa', mpesaRoutes);

app.use("/api/data", dataRoutes);

app.use("/api/services", serviceRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/orders", orderRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend API is running');
});

// Start server
const PORT = process.env.PORT || 5000;

// CONNECT DB
connectDB();   

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
