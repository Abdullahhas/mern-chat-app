import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String, // Change from ObjectId to String (UUID from SQL)
      required: true,
    },
    receiverId: {
      type: String, // Change from ObjectId to String (UUID from SQL)
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
