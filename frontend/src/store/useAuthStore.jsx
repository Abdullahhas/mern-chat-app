import React, { createContext, useContext, useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  // const [qrCodeImage, setQrCodeImage] = useState(null); // State to store the QR code image

  
    // const fetchQRCode = async () => {
    //   try {
    //     const response = await axiosInstance.get("/auth/qrcode");
    //     console.log(response)
    //     if (response.data.qrCodeImage) {
    //       setQrCodeImage(response.data.qrCodeImage);
    //     }
    //     else{
    //       console.log('error')
    //     }
    //   } catch (error) {
    //     console.error("Error fetching QR code:", error);
    //     toast.error("Failed to fetch QR code");
    //   }
    // };
    

  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      setAuthUser(res.data);
      connectSocket();
    } catch (error) {
      console.log("Error in check auth", error.message);
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const signUp = async (data) => {
    setIsSigningUp(true);
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      setAuthUser(res.data);
      toast.success("Account created successfully");
      connectSocket();
    } catch (error) {
      console.error("API error:", error.response?.data);
      toast.error(error.response.data.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setAuthUser(null);
      toast.success("Logged out successfully");
      disConnectSocket();
    } catch (error) {
      toast.log("Error in logout", error.message);
    }
  };

  const login = async (data) => {
    setIsLoggingIn(true);
    try {
      const res = await axiosInstance.post("/auth/login", data);
      setAuthUser(res.data);
      toast.success("Logged in successfully");
      connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const updateProfile = async (file) => {
    const formData = new FormData();
    formData.append('profilePic', file);

    try {
        const res = await axiosInstance.put("/auth/update-profile", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setAuthUser((prev) => ({ ...prev, profilePic: res.data.profilePic }));
        toast.success("Profile updated successfully");
    } catch (error) {
        console.error("Error updating profile:", error);
        toast.error(error.response?.data?.message || "Failed to update profile");
    }
};


  const connectSocket = () => {
    if (!authUser || socket?.connected) return;
    const newSocket = io("http://localhost:3000", {
      query: {
        userId: authUser.id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  const disConnectSocket = () => {
    if (socket?.connected) {
      socket.disconnect();
    }
  };

 
  return (
    <AuthContext.Provider
      value={{
        authUser,
        isSigningUp,
        isLoggingIn,
        isUpdatingProfile,
        isCheckingAuth,
        onlineUsers,
        socket,
        checkAuth,
        signUp,
        logout,
        login,
        updateProfile,
        connectSocket,
        disConnectSocket,
        qrCodeImage,
        fetchQRCode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};