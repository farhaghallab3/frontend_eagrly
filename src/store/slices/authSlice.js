import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API endpoints
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Register request thunk (creates unverified user, sends OTP)
export const registerRequest = createAsyncThunk(
    "auth/registerRequest",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/users/register_request/`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Verify OTP thunk
export const verifyOTP = createAsyncThunk(
    "auth/verifyOTP",
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/users/verify_otp/`, { email, otp });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Resend OTP thunk
export const resendOTP = createAsyncThunk(
    "auth/resendOTP",
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/users/resend_otp/`, { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Legacy register thunk (kept for compatibility)
export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/users/`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Login thunk (now uses email instead of username)
export const loginUser = createAsyncThunk(
    "auth/login",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/token/`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: (() => {
            const userString = localStorage.getItem("user");
            return userString && userString !== "undefined" ? JSON.parse(userString) : null;
        })(),
        token: localStorage.getItem("token") || null,
        loading: false,
        error: null,
        // OTP registration state
        otpLoading: false,
        otpError: null,
        pendingEmail: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.pendingEmail = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        clearError: (state) => {
            state.error = null;
            state.otpError = null;
        },
        setPendingEmail: (state, action) => {
            state.pendingEmail = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register Request
            .addCase(registerRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingEmail = action.payload.email;
            })
            .addCase(registerRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Registration failed";
            })
            // Verify OTP
            .addCase(verifyOTP.pending, (state) => {
                state.otpLoading = true;
                state.otpError = null;
            })
            .addCase(verifyOTP.fulfilled, (state) => {
                state.otpLoading = false;
                state.pendingEmail = null;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.otpLoading = false;
                state.otpError = action.payload?.error || action.payload?.detail || "Invalid OTP";
            })
            // Resend OTP
            .addCase(resendOTP.pending, (state) => {
                state.otpLoading = true;
                state.otpError = null;
            })
            .addCase(resendOTP.fulfilled, (state) => {
                state.otpLoading = false;
            })
            .addCase(resendOTP.rejected, (state, action) => {
                state.otpLoading = false;
                state.otpError = action.payload?.error || "Failed to resend OTP";
            })
            // Legacy Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Register failed";
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.access;
                localStorage.setItem("token", action.payload.access);
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            });
    },
});

export const { logout, clearError, setPendingEmail } = authSlice.actions;
export default authSlice.reducer;

