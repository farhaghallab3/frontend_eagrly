import { useSelector, useDispatch } from "react-redux";
import { loginUser, registerUser, registerRequest, verifyOTP, resendOTP, logout, clearError } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { auth, facebookProvider, googleProvider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, token, otpLoading, otpError, pendingEmail } = useSelector((state) => state.auth);

  // Login with email/password
  const login = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      localStorage.setItem("token", result.payload.access);
      localStorage.setItem("user", JSON.stringify(result.payload.user));
      navigate("/");
      return result.payload;
    }
    return null;
  };

  // Register with OTP verification (new flow)
  const registerWithOTP = async (data) => {
    const result = await dispatch(registerRequest(data));
    if (registerRequest.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  };

  // Verify OTP code
  const verifyOTPCode = async (email, otp) => {
    const result = await dispatch(verifyOTP({ email, otp }));
    if (verifyOTP.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  };

  // Resend OTP code
  const resendOTPCode = async (email) => {
    const result = await dispatch(resendOTP({ email }));
    if (resendOTP.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  };

  // Clear all errors
  const clearErrors = () => {
    dispatch(clearError());
  };

  // Legacy register (kept for compatibility)
  const register = async (data) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  // Helper: clean username to match backend pattern
  const sanitizeUsername = (name, email) => {
    if (!name) return email.split("@")[0];
    return name.replace(/\s+/g, "").replace(/[^\w.@+-]/g, "");
  };

  // Google OAuth (updated to use email-based login)
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const username = sanitizeUsername(result.user.displayName, result.user.email);

      const userData = {
        email: result.user.email,
        username,
        password: result.user.uid, // temporary password
        first_name: result.user.displayName?.split(" ")[0] || "",
        last_name: result.user.displayName?.split(" ")[1] || "",
      };

      // Try login with email first
      let loginRes = await dispatch(loginUser({ email: result.user.email, password: result.user.uid }));
      if (!loginUser.fulfilled.match(loginRes)) {
        // If login fails, register then login
        const regResult = await dispatch(registerRequest(userData));
        if (registerRequest.fulfilled.match(regResult)) {
          // Auto-verify for OAuth users
          // Note: For OAuth users, we skip OTP verification as they're verified via provider
          loginRes = await dispatch(loginUser({ email: result.user.email, password: result.user.uid }));
        }
      }

      if (loginUser.fulfilled.match(loginRes)) {
        localStorage.setItem(
          "token",
          loginRes.payload.access
        );
        localStorage.setItem(
          "user",
          JSON.stringify({ ...loginRes.payload.user, photoURL: result.user.photoURL })
        );
        navigate("/");
        return true;
      }
    } catch (err) {
      console.error("Google login error:", err.message);
    }
    return false;
  };

  // Facebook OAuth (updated to use email-based login)
  const loginWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const username = sanitizeUsername(result.user.displayName, result.user.email);

      const userData = {
        email: result.user.email,
        username,
        password: result.user.uid,
        first_name: result.user.displayName?.split(" ")[0] || "",
        last_name: result.user.displayName?.split(" ")[1] || "",
      };

      // Try login with email first
      let loginRes = await dispatch(loginUser({ email: result.user.email, password: result.user.uid }));
      if (!loginUser.fulfilled.match(loginRes)) {
        // If login fails, register then login
        const regResult = await dispatch(registerRequest(userData));
        if (registerRequest.fulfilled.match(regResult)) {
          loginRes = await dispatch(loginUser({ email: result.user.email, password: result.user.uid }));
        }
      }

      if (loginUser.fulfilled.match(loginRes)) {
        localStorage.setItem(
          "token",
          loginRes.payload.access
        );
        localStorage.setItem(
          "user",
          JSON.stringify({ ...loginRes.payload.user, photoURL: result.user.photoURL })
        );
        navigate("/");
        return true;
      }
    } catch (err) {
      console.error("Facebook login error:", err.message);
    }
    return false;
  };

  // Logout
  const logoutUser = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return {
    user,
    loading,
    error,
    token,
    otpLoading,
    otpError,
    pendingEmail,
    login,
    register,
    registerWithOTP,
    verifyOTPCode,
    resendOTPCode,
    clearErrors,
    logoutUser,
    loginWithGoogle,
    loginWithFacebook,
  };
};

