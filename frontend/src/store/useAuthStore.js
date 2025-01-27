import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";

export const useAuthStore = create((set) =>({
    authUser : null,
    isSigningUp : false,
    isLoggingIng : false,
    isCheckingAuth : true,

    checkAuth : async () =>{
        try {
            const res =await axiosInstance.get("/auth/check")
            set({authUser : res.data})
        } catch (error) {
            console.log("Error in check auth" , error.message)
            set({authUser : null})
        }finally{
            set({isCheckingAuth : false})
        }
    }
    ,
    signUp : async (data) =>{
        set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      if (res && res.data) {
        set({ authUser: res.data });
        toast.success("Account created successfully");
      }
      
    } catch (error) {
      toast.error(error.response);
    } finally {
      set({ isSigningUp: false });
    }
    }

    // signup : async (name , email , password)=>{
    //     const res = await axiosInstance.post("/auth/signup",{ name , email , password})
    //     set({authUser : res.data})

    // }


}))