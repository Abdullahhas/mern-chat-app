import { DataTypes } from "sequelize";
import  sequelize  from "../lib/sequelize.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID, // Use UUID if you're using MongoDB-like IDs
    defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  fullName: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePic: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  qrCode: {
    type: DataTypes.STRING,
    allowNull: true,
  }
  
  
}, { timestamps: true });

export default User;
