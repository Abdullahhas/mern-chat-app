import React, { createContext, useContext, useState, useEffect , useCallback } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "./useAuthStore"; // Assuming you've already converted useAuthStore to context

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const { socket } = useAuth(); // Assuming useAuth provides the socket

  // Fetch users
  const getUsers =useCallback( async () => {
    setIsUsersLoading(true);
    try {
      const res = await axiosInstance.get("/messages/users");
      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsUsersLoading(false);
    }
  } , []);

  // Fetch messages for a specific user
  const getMessages = useCallback( async (userId) => {
    if (!userId) {
      toast.error("No user selected for fetching messages.");
      return;
    }

    setIsMessageLoading(true);

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error.response?.data || error);
    } finally {
      setIsMessageLoading(false);
    }
  } , []) ;

  // Send a message
  const sendMessages = async (messageData) => {
    if (!selectedUser) {
      toast.error("No user selected to send the message.");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser.id}`,
        messageData
      );
      setMessages((prevMessages) => [...prevMessages, res.data]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  // Subscribe to new messages
  const subscribeToMessages = useCallback( () => {
    if (!selectedUser || !socket) return;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser.id;
      if (!isMessageSentFromSelectedUser) return;

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  } , [selectedUser , socket]);

  // Unsubscribe from new messages
  const unSubscribeToMessages =useCallback( () => {
    if (socket) {
      socket.off("newMessage");
    }
  } , [socket]);

  // Update selected user
  const updateSelectedUser = (user) => {
    setSelectedUser(user);
  };

  // Cleanup socket listeners on unmount
  useEffect(() => {
    return () => {
      unSubscribeToMessages();
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        isUsersLoading,
        isMessageLoading,
        getUsers,
        getMessages,
        sendMessages,
        subscribeToMessages,
        unSubscribeToMessages,
        setSelectedUser: updateSelectedUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};