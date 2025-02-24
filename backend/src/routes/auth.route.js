import express from "express";
import { login, logout, signup  , updateProfile , checkAuth } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/signup", signup );
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile" , isAuthenticated, upload.single('profilePic') ,  updateProfile);
router.get("/check" , isAuthenticated , checkAuth)


export default router;