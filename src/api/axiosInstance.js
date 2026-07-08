import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://expensemanager-py2d.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request Interceptor: Automatically inject JWT token to authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (like 401 unauthorized session expiration)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If user's session expired or token became invalid, clear local storage
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem("isLoggedIn") === "true") {
        localStorage.setItem("session_expired", "true");
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      
      console.warn("Session expired or unauthorized. Cleared local auth state.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
