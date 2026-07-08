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
  }
};

export default authApi;
