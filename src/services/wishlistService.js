import axios from "axios";
import axiosInstance from "./axiosInstance.js";

const API_URL = import.meta.env.VITE_API_URL + "/wishlist/";

// Flag to force localStorage mode when backend isn't ready
const USE_LOCAL_STORAGE_ONLY = false;

// localStorage helpers
const getWishlistStorageKey = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return `wishlist_${token.slice(-10)}`;
};

const getLocalWishlist = () => {
  const key = getWishlistStorageKey();
  if (!key) return [];
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalWishlist = (wishlist) => {
  const key = getWishlistStorageKey();
  if (key) {
    localStorage.setItem(key, JSON.stringify(wishlist));
  }
};

export const wishlistService = {
  getWishlist: async () => {
    if (USE_LOCAL_STORAGE_ONLY) {
      return getLocalWishlist();
    }

    const token = localStorage.getItem("token");
    if (!token) return [];

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      // If endpoint doesn't exist yet (404), return empty array
      if (error.response?.status === 404) {
        console.warn("Wishlist endpoint not found, returning empty wishlist");
        return [];
      }
      console.error("Error fetching wishlist:", error);
      return [];
    }
  },

  addToWishlist: async (productId) => {
    if (USE_LOCAL_STORAGE_ONLY) {
      const currentWishlist = getLocalWishlist();
      const newItem = {
        id: Date.now(),
        product_id: productId,
        product_title: `Product ${productId}`,
        product_price: Math.floor(Math.random() * 100) + 10,
        product_image: '/placeholder-image.jpg',
        user: 'current_user'
      };
      currentWishlist.push(newItem);
      saveLocalWishlist(currentWishlist);
      return newItem;
    }

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axiosInstance.post(API_URL, { product_id: productId }, config);
      return response.data;
    } catch (error) {
      // If endpoint doesn't exist yet (404), simulate success for frontend testing
      if (error.response?.status === 404) {
        console.warn("Wishlist endpoint not found, simulating add operation");
        return {
          id: Date.now(),
          product: {
            id: productId,
            title: `Product ${productId}`,
            price: Math.floor(Math.random() * 100) + 10,
            image: '/placeholder-image.jpg',
            description: 'Product description'
          },
          user: 'current_user'
        };
      }
      throw error;
    }
  },

  removeFromWishlist: async (productId) => {
    if (USE_LOCAL_STORAGE_ONLY) {
      const currentWishlist = getLocalWishlist();
      const filteredWishlist = currentWishlist.filter(item => item.product_id !== productId);
      saveLocalWishlist(filteredWishlist);
      return productId;
    }

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      // Use the remove_by_product endpoint that accepts product ID
      await axiosInstance.delete(`${API_URL}remove/${productId}/`, config);
      return productId;
    } catch (error) {
      // If endpoint doesn't exist yet (404), simulate success for frontend testing
      if (error.response?.status === 404) {
        console.warn("Wishlist endpoint not found, simulating remove operation");
        return productId;
      }
      throw error;
    }
  },

  toggleWishlist: async (productId) => {
    if (USE_LOCAL_STORAGE_ONLY) {
      const currentWishlist = getLocalWishlist();
      const existingIndex = currentWishlist.findIndex(item => item.product_id === productId);

      if (existingIndex >= 0) {
        // Remove
        currentWishlist.splice(existingIndex, 1);
        saveLocalWishlist(currentWishlist);
        return { status: 'removed', product_id: productId };
      } else {
        // Add
        const newItem = {
          id: Date.now(),
          product_id: productId,
          product_title: `Product ${productId}`,
          product_price: Math.floor(Math.random() * 100) + 10,
          product_image: '/placeholder-image.jpg',
          user: 'current_user'
        };
        currentWishlist.push(newItem);
        saveLocalWishlist(currentWishlist);
        return { status: 'added', item: newItem };
      }
    }

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axiosInstance.post(`${API_URL}toggle/`, { product_id: productId }, config);
      return response.data;
    } catch (error) {
      // Fallback for 404 (if endpoint not deployed yet)
      if (error.response?.status === 404) {
        console.warn("Wishlist toggle endpoint not found, simulating toggle");
        return { status: 'added', item: { id: Date.now(), product_id: productId } }; // Dummy success
      }
      throw error;
    }
  },

  isInWishlist: async (productId) => {
    const wishlist = await wishlistService.getWishlist();
    return wishlist.results?.some(item => item.product_id === productId) || false;
  }
};
