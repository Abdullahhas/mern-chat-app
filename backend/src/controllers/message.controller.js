import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { Op } from "sequelize";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const filteredUsers = await User.findAll({
      where: { id: { [Op.ne]: loggedInUserId } },
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in get users for sidebar:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.id;

    const user1 = await User.findByPk(myId);
    const user2 = await User.findByPk(userToChatId);

    if (!user1 || !user2) {
      return res.status(404).json({ message: "User not found" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).lean();

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in get messages:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user?.id;
    const { text } = req.body;

    if (!text || !senderId) {
      return res
        .status(400)
        .json({ message: "Message text and senderId are required" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      createdAt: new Date(),
    });

    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiverId)
    
    if(receiverSocketId) 
    {
        io.to(receiverSocketId).emit('newMessage' , newMessage);
    }else {
      console.log("User is offline or not connected");
  }



    return res.status(201).json(newMessage);
  } catch (error) {
    console.error(" Error in sendMessage:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
