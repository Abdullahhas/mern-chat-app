import User from "../models/user.model.js";  
import bcrypt from "bcryptjs";
import { genToken } from "../lib/utils.js";





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
  
    
  
    
      const newUser = await User.create({
        email,
        fullName,
        password: hashedPassword,
       
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
  
      
      
  
      genToken(user.id, res);
  
      return res.status(200).json({
        id: user.id, // Use `id` instead of `_id`
        email: user.email,
        fullName: user.fullName,
        profilePic: user.profile,
        
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
    const userId = req.user?.id;

    // Check if the user ID exists
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // Construct the profile picture path
    const profilePic = `/uploads/${req.file.filename}`;

    // Update the user's profile picture
    const [updatedRows] = await User.update({ profilePic }, { where: { id: userId } });

    if (updatedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      profilePic,
    });

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
  




