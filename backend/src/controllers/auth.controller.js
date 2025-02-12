import User from "../models/user.model.js";  // Sequelize User Model
import bcrypt from "bcryptjs";
import { genToken } from "../lib/utils.js";
import QRCode from "qrcode";


export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
  
    try {
      if (!email || !fullName || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
  
      
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const qrData = JSON.stringify({ email, fullName });
      const qrCode = await QRCode.toDataURL(qrData, { width: 200, height: 200 });
  
    
      const newUser = await User.create({
        email,
        fullName,
        password: hashedPassword,
        qrCode,
      });
  
      
      genToken(newUser.id, res);
  
      return res.status(201).json({ message: "User created successfully" });
  
    } catch (error) {
      console.error("Error in signup:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
     
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      
      const qrData = JSON.stringify({ email: user.email, fullName: user.fullName });
      const qrCode = await QRCode.toDataURL(qrData, { width: 200, height: 200 });
  
      genToken(user.id, res);
  
      return res.status(200).json({
        id: user.id, // Use `id` instead of `_id`
        email: user.email,
        fullName: user.fullName,
        profilePic: user.profile,
        qrCode: qrCode,
      });
  
    } catch (error) {
      console.error("Error in login:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  


export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user.id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        const updatedUser = await User.update(
            { profilePic },
            { where: { id: userId } }
        );

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in update profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const checkAuth = async (req, res) => {
    try {
      
      const user = await User.findByPk(req.user.id);
  
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      res.status(200).json(user);
  
    } catch (error) {
      console.error("Error in checkAuth:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
