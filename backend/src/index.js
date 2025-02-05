import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config({ path: "../.env" });
const PORT = process.env.PORT || 3000;
console.log(PORT);

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
