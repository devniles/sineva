import { create } from "zustand";
import axios from "axios";

// const API_URL = "http://localhost:5050/api/personas";
const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/personas`;


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
  createMetaAd: async (persona) => {
    try {
      const res = await axios.post(`${API_BASE}/meta/ads`, { persona });
      return res.data.data;
    } catch (err) {
      console.error('Create Meta Ad error:', err);
      throw err;
    }
  },
  createLiveMetaAd: async (payload) => {
    try {
      const res = await axios.post(`${API_BASE}/meta/ads/live`, payload);
      return res.data;
    } catch (err) {
      console.error('Create Live Meta Ad error:', err.response?.data || err.message || err);
      throw err;
    }
  },
}));
