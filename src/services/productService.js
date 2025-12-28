
import axios from "axios";
import * as jwtDecode from "jwt-decode";
import axiosInstance from "./axiosInstance.js";

const API_URL = import.meta.env.VITE_API_URL + "/products/";


export const productService = {
  getAll: async () => {
    // Don't send auth headers so backend treats as anonymous user and returns all active products
    const res = await axios.get(import.meta.env.VITE_API_URL + "/products/");
    let products = res.data.results;

    // Filter out user's own products if logged in, so they don't see their own in marketplace
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode.jwtDecode(token);
        const userId = decoded.user_id;
        products = products.filter(product => product.seller !== userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    return products;
  },

  getProductsByCategory: async (categoryId) => {
    // Don't send auth headers so backend treats as anonymous user and returns all active products
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories/${categoryId}/products/`);
    let products = res.data?.results || res.data || [];

    // For category browsing, show all active products in the category (public viewing)
    // No filtering of user's own products here

    return products;
  },

  getMyProducts: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.get(`${API_URL}my_products/`, config);

      return response.data;
    } catch (error) {
      console.error("Error fetching user products:", error);
      return [];
    }
  },



  create: async (data) => {
    const token = localStorage.getItem("token");
    const config = token ? {
      headers: { Authorization: `Bearer ${token}` },
    } : {};
    const res = await axiosInstance.post(API_URL, data, config);
    return res.data;
  },

  update: async (id, data) => {
    const token = localStorage.getItem("token");
    const config = token ? {
      headers: { Authorization: `Bearer ${token}` },
    } : {};
    const res = await axiosInstance.patch(`${API_URL}${id}/`, data, config);

    return res.data;
  },

  delete: async (id) => {
    const token = localStorage.getItem("token");
    const config = token ? {
      headers: { Authorization: `Bearer ${token}` },
    } : {};
    await axiosInstance.delete(`${API_URL}${id}/`, config);
    return id;
  },

  getProductDetails: async (id) => {
    const token = localStorage.getItem("token");
    const config = token ? {
      headers: { Authorization: `Bearer ${token}` },
    } : {};
    const res = await axiosInstance.get(`${API_URL}${id}/`, config);
    return res.data;
  },

  checkEligibility: async () => {
    const token = localStorage.getItem("token");
    if (!token) return { can_post: false, message: 'Please login to post ads' };

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const res = await axios.get(`${API_URL}check_eligibility/`, config);
    return res.data;
  },

  republishProduct: async (id) => {
    const token = localStorage.getItem("token");
    const config = token ? {
      headers: { Authorization: `Bearer ${token}` },
    } : {};
    const res = await axiosInstance.post(`${API_URL}${id}/republish/`, {}, config);
    return res.data;
  },
};
