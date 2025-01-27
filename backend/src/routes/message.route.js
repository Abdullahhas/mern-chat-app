import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getUsersForSideBar , getMessages , sendMessage } from "../controllers/message.controller.js";



const router = express.Router();

router.get("/users" , isAuthenticated ,  getUsersForSideBar)
router.get("/:id" , isAuthenticated ,  getMessages)
router.post('/send/:id' , isAuthenticated ,  sendMessage)

export default router;
