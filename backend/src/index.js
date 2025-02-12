import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { connectSQL } from "./lib/sequelize.js";
import { app, server } from "./lib/socket.js";
import sequelize from "./lib/sequelize.js";
import User from "./models/user.model.js";

dotenv.config({ path: "../.env" });
const PORT = process.env.PORT || 4000;

connectDB();
connectSQL();

sequelize.sync({ force: false }) // Change to `true` to drop and recreate tables
  .then(() => console.log(" Database synchronized"))
  .catch(err => console.error("Error syncing database:", err));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
