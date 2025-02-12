import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { io } from "socket.io-client";


const socket = io("http://localhost:3000", {
  withCredentials: true,
});

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,


  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

 
  getMessages: async (userId) => {
    if (!userId) {
      toast.error("No user selected for fetching messages.");
      return;
    }

    set({ isMessageLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error(" Error fetching messages:", error.response?.data || error);
    } finally {
      set({ isMessageLoading: false });
    }
  },

 
  sendMessages: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser.id}`,
        messageData
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  
  subscribeToMessages : () => {
    const {selectedUser} = get()
    if(!selectedUser) return

    const socket = useAuthStore.getState().socket

    socket.on("newMessage" , (newMessage) => {
        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser.id
        if(!isMessageSentFromSelectedUser) return
            
        set({
            messages : [...get().messages , newMessage],
        })
    })
},

 
  unSubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket
    socket.off("newMessage")

  },

  
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));