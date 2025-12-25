// chatService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const chatAxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

chatAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getChats = async () => {
  try {
    const response = await chatAxiosInstance.get("/chats/");
    return response.data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
};

export const getChat = async (chatId) => {
  try {
    const response = await chatAxiosInstance.get(`/chats/${chatId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching chat ${chatId}:`, error);
    throw error;
  }
};

export const sendMessage = async (chatId, text, messageType = 'text') => {
  try {
    const response = await chatAxiosInstance.post("/messages/", {
      chat: chatId,
      text: text,
      message_type: messageType,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const findOrCreateChat = async (product, seller, buyer) => {
  try {
    const response = await chatAxiosInstance.post("/chats/find-or-create/", {
      product,
      seller,
      buyer,
    });
    return response.data;
  } catch (error) {
    console.error("Error finding or creating chat:", error);
    throw error;
  }
};

export const sendMessageToBot = async (message, initial = false) => {
  try {
    // Build request data
    const requestData = { message };
    if (initial) {
      requestData.initial = true;
    }

    const res = await chatAxiosInstance.post("/chatbot/", requestData);

    return res.data;
  } catch (err) {
    console.error("Error sending message:", err);

    if (err.response?.status === 401) {
      return {
        error: "Please log in to use the chatbot",
        authenticated: false
      };
    }

    if (err.message === "User not authenticated") {
      return {
        error: "Please log in to use the chatbot",
        authenticated: false
      };
    }

    return {
      error: "An error occurred while contacting the chatbot.",
      authenticated: false
    };
  }
};
