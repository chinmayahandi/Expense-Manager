import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

// Load configuration keys
dotenv.config();

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());

// Logger middleware for incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SpendWise Fintech Backend API is running successfully!"
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler caught:", err.stack);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred"
  });
});

// Catch-all Route for unmatched endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.url} does not exist.`
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SpendWise Server is active on http://localhost:${PORT}`);
});
