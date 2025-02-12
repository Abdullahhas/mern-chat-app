import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const isAuthenticated = async (req, res, next) => {
    const secret = 'mysceretkey'
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({message : "Unauthorized-No token provided"});
        }

        const decoded = jwt.verify(token, secret); 

        if(!decoded){
            return res.status(401).json({message : "Unauthorized-Invalid token"});
        }

        const user = await User.findByPk(decoded.userId, {
  attributes: { exclude: ["password"] } 
});

        if(!user){
            return res.status(404).json({message : "User not found"});
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in authentication " , error.message);
        return res.status(500).json({message : "Internal server error"});
        }
}