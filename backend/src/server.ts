import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import cardRoutes from "./routes/cards";
import commentRoutes from "./routes/comments";
import userRoutes from "./routes/users";
import notificationRoutes from "./routes/notifications";
import adminRoutes from "./routes/admin";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({message: err.message || "Error"});
});

mongoose.connect(process.env.MONGO_URI!, {dbName: "wissensplattform"})
  .then(() => {
    app.listen(4000, () => console.log("Backend läuft auf Port 4000"));
  });
