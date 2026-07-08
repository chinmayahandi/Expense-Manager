import axiosInstance from "./axiosInstance";

const transactionApi = {
  // Fetch all transactions for the authenticated user
  getAll: async () => {
    const response = await axiosInstance.get("/transactions");
    return response.data;
  },

  // Fetch details of a single transaction
  getById: async (id) => {
    const response = await axiosInstance.get(`/transactions/${id}`);
    return response.data;
  },

  // Log a new transaction
  create: async (transactionData) => {
    const response = await axiosInstance.post("/transactions", transactionData);
    return response.data;
  },

  // Modify an existing transaction
  update: async (id, transactionData) => {
    const response = await axiosInstance.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  // Delete a transaction from database
  delete: async (id) => {
    const response = await axiosInstance.delete(`/transactions/${id}`);
    return response.data;
  }
};

export default transactionApi;
