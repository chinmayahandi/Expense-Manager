import axiosInstance from "./axiosInstance";

const authApi = {
  // Register a new user profile
  register: async (fullName, email, password) => {
    const response = await axiosInstance.post("/auth/register", {
      full_name: fullName,
      email,
      password
    });
    return response.data;
  },

  // Log in existing user
  login: async (email, password) => {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password
    });
    return response.data;
  },

  // Fetch current user details using active bearer token
  getMe: async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email
    });
    return response.data;
  },

  // Reset password using token
  resetPassword: async (token, password) => {
    const response = await axiosInstance.post(`/auth/reset-password/${token}`, {
      password
    });
    return response.data;
  },

  // Resend email verification
  resendVerification: async (email) => {
    const response = await axiosInstance.post("/auth/resend-verification", {
      email
    });
    return response.data;
  }
};

export default authApi;

