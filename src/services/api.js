import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";


export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories/`);
  return response.data.results || [];
};

export const getCategory = async (id) => {
  const response = await axios.get(`${API_URL}/categories/${id}/`);
  return response.data;
};
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "multipart/form-data" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail || error.response?.data || error.message || "Unknown Error";
    toast.error(message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
