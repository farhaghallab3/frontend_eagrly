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
  getById: async (id) => {
    try {
      const res = await axiosInstance.get(`${API_URL}${id}/`);
      return res.data;
    } catch (error) {
      console.error("Error fetching package:", error);
      throw error;
    }
  },
  subscribe: async (id) => {
    try {
      const res = await axiosInstance.post(`${API_URL}${id}/subscribe/`);
      return res.data;
    } catch (error) {
      console.error("Error subscribing:", error);
      throw error;
    }
  },
  verifyPayment: async (queryParams) => {
    try {
      // payments is a ViewSet under /api/payments/ but we added it to router as 'payments'
      // Wait, the router registers 'payments' -> PaymentViewSet
      // So the url is /payments/callback/
      const res = await axiosInstance.get(`/payments/callback/?${queryParams}`);
      return res.data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  },
  confirmManualPayment: async (packageId, paymentMethod) => {
    try {
      const res = await axiosInstance.post(`/payments/confirm_user_payment/`, {
        package_id: packageId,
        payment_method: paymentMethod
      });
      return res.data;
    } catch (error) {
      console.error("Error confirming manual payment:", error);
      throw error;
    }
  }
};
