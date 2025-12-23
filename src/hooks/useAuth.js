import { useSelector, useDispatch } from "react-redux";
import { loginUser, registerUser, logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { auth, facebookProvider, googleProvider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, token } = useSelector((state) => state.auth);

  // Login with email/password
  const login = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      localStorage.setItem("token", result.payload.access);
      localStorage.setItem("user", JSON.stringify(result.payload.user));
      navigate("/");
    }
  };

  // Register with email/password
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

  // Google OAuth
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

      // Try login first
      let loginRes = await dispatch(loginUser({ username, password: result.user.uid }));
      if (!loginUser.fulfilled.match(loginRes)) {
        // If login fails, register then login
        await dispatch(registerUser(userData));
        loginRes = await dispatch(loginUser({ username, password: result.user.uid }));
      }

      if (loginUser.fulfilled.match(loginRes)) {
        localStorage.setItem(
          "token",
          loginRes.payload.access
        );
        localStorage.setItem(
          "user",
          JSON.stringify({ username, email: result.user.email, photoURL: result.user.photoURL })
        );
        navigate("/");
      }
    } catch (err) {
      console.error("Google login error:", err.message);
    }
  };

  // Facebook OAuth
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

      // Try login first
      let loginRes = await dispatch(loginUser({ username, password: result.user.uid }));
      if (!loginUser.fulfilled.match(loginRes)) {
        // If login fails, register then login
        await dispatch(registerUser(userData));
        loginRes = await dispatch(loginUser({ username, password: result.user.uid }));
      }

      if (loginUser.fulfilled.match(loginRes)) {
        localStorage.setItem(
          "token",
          loginRes.payload.access
        );
        localStorage.setItem(
          "user",
          JSON.stringify({ username, email: result.user.email, photoURL: result.user.photoURL })
        );
        navigate("/");
      }
    } catch (err) {
      console.error("Facebook login error:", err.message);
    }
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
    login,
    register,
    logoutUser,
    loginWithGoogle,
    loginWithFacebook,
  };
};
