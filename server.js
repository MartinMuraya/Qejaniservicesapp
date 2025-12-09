import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from "./config/db.js";   // <-- IMPORTANT
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import mpesaRoutes from './routes/mpesaRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mpesa', mpesaRoutes);

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
