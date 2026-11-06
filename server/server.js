import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

import {
  notFound,
  errorHandler
} from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// Database connection
await connectDB();

// Security middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Parse JSON
app.use(express.json({ limit: "10kb" }));

// API rate limiter
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-8",
    legacyHeaders: false
  })
);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow API is running successfully"
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TaskFlow API running on port ${PORT}`);
});