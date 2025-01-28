import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {genToken} from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req ,res)=>{
    const {email, fullName, password} = req.body;
    try {
        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }


        if(password.length < 6){
            return res.status(400).json({message : "Password must be atleast 6 characters long"});
        }

        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message : "User already exists"});
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password : hashedPassword
        });

        if(newUser){
            genToken(newUser._id , res)
            await newUser.save();

            return res.status(201).json({message : "User created successfully"});
        }
        else{
            return res.status(400).json({message : "Invalid user data"});
        }
        


    } catch (error) {
        console.log("Error in sign in " ,error.message);
        return res.status(500).json({message : "Internal server error"});
    }
}

export const login = async (req ,res)=>{
    const {email , password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message : "Invalid credientials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password , user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid credientials"});
        }
        
        genToken(user._id , res)

        return res.status(200).json({
            _id : user._id,
            email : user.email,
            fullName : user.fullName,
            profilePic : user.profile

        });
    } catch (error) {
        console.log("Error in sign in " ,error.message);
        return res.status(500).json({message : "Internal server error"});
    }
}
export const logout = (req ,res)=>{
    try {
        res.cookie('jwt' , '' , {
            maxAge : 0
        })
        res.status(200).json({message : "Logged out successfully"});
    } catch (error) {
        console.log("Error in sign in " ,error.message);
        return res.status(500).json({message : "Internal server error"});
    }
    
}

export const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body;
      const userId = req.user._id;
  
      if (!profilePic) {
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("error in update profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };