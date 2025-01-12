import {axiosInstance} from "../lib/axios";
import { create } from "zustand";
import { toast } from "react-toastify";
import {io} from 'socket.io-client'

const BASE_URL = import.meta.env.MODE === "development"? "http://localhost:3000":"/";

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isLoading: false,
    isCheckingAuth: true,
    socket: null,


    register: async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/user/register", data);
            set({ authUser: res.data.user});
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({ isLoading: false });
        }
    },

    login: async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/user/login", data);
            set({ authUser: res.data.user });
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({ isLoading: false });
        }
    },

    checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/user/checkAuth");
          set({authUser:res.data})
          get().connectSocket();
        } catch (error) {
          console.log("Error in checkAuth:",error.message);
          set({authUser: null});  
        }finally{
          set({isCheckingAuth:false})
        }
    },

    logout: async () => {
        try {
            await axiosInstance.get("/user/logout");
            set({ authUser: null });
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    connectSocket: () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL);
        socket.connect();
        set({socket:socket});
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    }
}));
