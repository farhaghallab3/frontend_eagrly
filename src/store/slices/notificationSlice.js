// src/store/slices/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Create axios instance for notifications
const notificationAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

notificationAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Fetch user notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationAxios.get("/notifications/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch notifications");
    }
  }
);

// ✅ Get unread count
export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationAxios.get("/notifications/unread-count/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch unread count");
    }
  }
);

// ✅ Mark notification as read
export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationAxios.post(`/notifications/${notificationId}/mark-read/`);
      return { id: notificationId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to mark notification as read");
    }
  }
);

// ✅ Mark all notifications as read
export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationAxios.post("/notifications/mark-all-read/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to mark all notifications as read");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    // Update unread count locally (useful for real-time updates)
    updateUnreadCount: (state, action) => {
      state.unreadCount = Math.max(0, state.unreadCount + action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.results || action.payload || [];
        // Recalculate unread count from fetched notifications
        state.unreadCount = state.notifications.filter(n => !n.is_read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.unread_count || 0;
      })

      // Mark notification as read
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload.id);
        if (notification && !notification.is_read) {
          notification.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // Mark all as read
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.is_read = true;
        });
        state.unreadCount = 0;
      });
  },
});

export const { clearNotifications, updateUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
