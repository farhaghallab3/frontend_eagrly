// src/services/packageService.js
import axiosInstance from "./api";

const API_URL = "/packages/";

export const packageService = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get(API_URL);
      return res.data.results || [];
    } catch (error) {
      console.error("Error fetching packages:", error);
      return [];
    }
  },
};
