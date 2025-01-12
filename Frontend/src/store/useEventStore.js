import {axiosInstance} from "../lib/axios";
import { create } from "zustand";
import { toast } from "react-toastify";


export const useEventStore = create((set) => ({
    events: [],
    isLoading: false,

    createEvent: async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/events/createevent", data);
            set({ events: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoading: false });
        }
    },

    getAllEvents: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/events/getevents");
            set({ events: res.data || [] });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ events: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    getEventById: async (id) => {
        try {
          set({ isLoading: true });
          const res = await axiosInstance.get(`/events/${id}`);
          set({ events: res.data || [] });
          return res.data;  // return the event data
        } catch (error) {
          toast.error(error.response.data.message);
          set({ events: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      joinEvent: async (id) => {
        try {
          set({ isLoading: true });
          const res = await axiosInstance.post(`/events/${id}/join`);
          set({ events: res.data || [] });
        } catch (error) {
          toast.error(error.response.data.message);
          set({ events: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      leaveEvent: async (id) => {
        try {
          set({ isLoading: true });
          const res = await axiosInstance.post(`/events/${id}/leave`);
          set({ events: res.data || [] });
        } catch (error) {
          toast.error(error.response.data.message);
          set({ events: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      updateEvent: async (id, data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.put(`/events/${id}/update`, data);
            set({ events: res.data });
            toast.success("Event updated successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoading: false });
        }
    },

      deleteEvent: async (id) => {
        try {
          set({ isLoading: true });
          const res = await axiosInstance.delete(`/events/${id}/delete`);
          set({ events: res.data || [] });
        } catch (error) {
          toast.error(error.response.data.message);
          set({ events: [] });
        } finally {
          set({ isLoading: false });
        }
      }
      
}));
