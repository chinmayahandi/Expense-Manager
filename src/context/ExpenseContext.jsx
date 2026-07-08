import React, { createContext, useContext, useState, useEffect } from "react";
import transactionApi from "../api/transactionApi";
import { useAuth } from "./AuthContext";

const ExpenseContext = createContext(undefined);

export const ExpenseProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  
  // State for transaction ledger
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // User Settings State (Local Only)
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("expense_tracker_settings");
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    return {
      userName: "Alex Mercer",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      currency: "₹",
      currencyCode: "INR",
      language: "en",
      notifications: true,
      theme: "light"
    };
  });

  // Save settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem("expense_tracker_settings", JSON.stringify(settings));
  }, [settings]);

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    if (!isLoggedIn) return;
    setLoadingTransactions(true);
    try {
      const data = await transactionApi.getAll();
      if (data.success) {
        // Amount values from backend are numeric strings or floats. Convert for calculations
        const formattedTxns = data.transactions.map((t) => ({
          ...t,
          amount: parseFloat(t.amount) || 0
        }));
        setTransactions(formattedTxns);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err.message);
      showToast("Could not load transactions from database", "error");
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Automatically sync transactions when logged-in state updates
  useEffect(() => {
    if (isLoggedIn) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [isLoggedIn]);

  // Toast notifications trigger state
  const [toasts, setToasts] = useState([]);
  
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Transaction CRUD operations
  const addTransaction = async (txn) => {
    try {
      const formattedTxn = {
        ...txn,
        amount: parseFloat(txn.amount) || 0
      };
      const data = await transactionApi.create(formattedTxn);
      if (data.success) {
        showToast(`Added "${data.transaction.title}" successfully!`, "success");
        await fetchTransactions(); // Reload list
        return data.transaction;
      }
    } catch (err) {
      console.error("Failed to create transaction:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to create transaction";
      showToast(errMsg, "error");
      throw err;
    }
  };

  const updateTransaction = async (id, updatedFields) => {
    try {
      const formattedTxn = {
        ...updatedFields,
        amount: parseFloat(updatedFields.amount) || 0
      };
      const data = await transactionApi.update(id, formattedTxn);
      if (data.success) {
        showToast(`Updated "${data.transaction.title}" successfully!`, "success");
        await fetchTransactions(); // Reload list
        return data.transaction;
      }
    } catch (err) {
      console.error("Failed to update transaction:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to update transaction";
      showToast(errMsg, "error");
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      // Find title locally to show in toast message
      const itemToDelete = transactions.find((t) => t.id === id);
      const data = await transactionApi.delete(id);
      if (data.success) {
        showToast(`Deleted "${itemToDelete?.title || "transaction"}"`, "info");
        await fetchTransactions(); // Reload list
        return true;
      }
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to delete transaction";
      showToast(errMsg, "error");
      throw err;
    }
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast("Settings updated successfully!", "success");
  };

  // Derived financial dashboard statistics
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;
  const savings = currentBalance > 0 ? currentBalance : 0;
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        loadingTransactions,
        settings,
        totalIncome,
        totalExpense,
        currentBalance,
        savings,
        savingsRate,
        toasts,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateSettings,
        showToast
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider");
  }
  return context;
};
