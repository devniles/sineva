import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5050/api/personas";

export const usePersonaStore = create((set) => ({
  personas: [],
  loading: false,
  fetchPersonas: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(API_URL);
      set({ personas: res.data.data || [] });
    } catch (err) {
      console.error("Fetch personas error:", err);
      set({ personas: [] });
    } finally {
      set({ loading: false });
    }
  },
  addPersona: async (data) => {
    try {
      const res = await axios.post(API_URL, data);
      set((state) => ({ personas: [res.data.data, ...(state.personas || [])] }));
      return res.data.data;
    } catch (err) {
      console.error("Add persona error:", err);
      throw err;
    }
  },
  updatePersona: async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      set((state) => ({
        personas: state.personas.map((p) => (p._id === id ? res.data.data : p)),
      }));
      return res.data.data;
    } catch (err) {
      console.error("Update persona error:", err);
      throw err;
    }
  },
  deletePersona: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({ personas: state.personas.filter((p) => p._id !== id) }));
    } catch (err) {
      console.error("Delete persona error:", err);
      throw err;
    }
  },
}));
