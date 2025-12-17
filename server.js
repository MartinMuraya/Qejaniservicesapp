import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from "./config/db.js";   // <-- IMPORTANT
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import mpesaRoutes from './routes/mpesaRoutes.js';
import dataRoutes from "./routes/dataRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminProviderRoutes from "./routes/adminProviderRoutes.js";
import adminServiceRoutes from "./routes/adminServiceRoutes.js";
import adminWithdrawalRoutes from "./routes/adminWithdrawalRoutes.js";

dotenv.config();
const app = express();

// HTTP server and Socket.IO instance
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"], // frontend URL
    methods: ['GET','POST','PUT','DELETE']
  }
});

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174"
  ],       
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
app.use("/api/admin", adminRoutes);

app.use("/api/admin/providers", adminProviderRoutes);
app.use("/api/admin/services", adminServiceRoutes);
app.use("/api/admin/withdrawals", adminWithdrawalRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend API is running');
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server and connect DB
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();   // connect to MongoDB
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

