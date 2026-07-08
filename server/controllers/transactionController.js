import { supabase } from "../config/supabaseClient.js";

// @desc    Get all transactions of the currently logged-in user
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", req.user.id)
      .order("date", { ascending: false });

    if (error) {
      console.error("Supabase get transactions error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve transactions"
      });
    }

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (err) {
    console.error("getTransactions controller error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while fetching transactions"
    });
  }
};

// @desc    Get a single transaction by ID (must own the transaction)
// @route   GET /api/transactions/:id
// @access  Private
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: transaction, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (error) {
      console.error("Supabase get transaction by ID error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve transaction details"
      });
    }

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or access unauthorized"
      });
    }

    return res.status(200).json({
      success: true,
      transaction
    });
  } catch (err) {
    console.error("getTransactionById controller error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while fetching transaction details"
    });
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    const { data: newTxn, error } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: req.user.id,
          title,
          amount: parseFloat(amount),
          type,
          category,
          date,
          notes: notes || null
        }
      ])
      .select("*")
      .single();

    if (error || !newTxn) {
      console.error("Supabase create transaction error:", error?.message);
      return res.status(500).json({
        success: false,
        message: "Failed to create transaction record"
      });
    }

    return res.status(201).json({
      success: true,
      transaction: newTxn
    });
  } catch (err) {
    console.error("createTransaction controller error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while creating transaction"
    });
  }
};

// @desc    Update an existing transaction (must own the transaction)
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, type, category, date, notes } = req.body;

    // Check if transaction exists and belongs to the user first
    const { data: existingTxn, error: checkError } = await supabase
      .from("transactions")
      .select("id")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (checkError) {
      return res.status(500).json({
        success: false,
        message: "Failed to verify transaction status"
      });
    }

    if (!existingTxn) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or access unauthorized"
      });
    }

    // Update the transaction details
    const { data: updatedTxn, error: updateError } = await supabase
      .from("transactions")
      .update({
        title,
        amount: parseFloat(amount),
        type,
        category,
        date,
        notes: notes || null
      })
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select("*")
      .single();

    if (updateError || !updatedTxn) {
      console.error("Supabase update transaction error:", updateError?.message);
      return res.status(500).json({
        success: false,
        message: "Failed to update transaction record"
      });
    }

    return res.status(200).json({
      success: true,
      transaction: updatedTxn
    });
  } catch (err) {
    console.error("updateTransaction controller error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while updating transaction"
    });
  }
};

// @desc    Delete a transaction (must own the transaction)
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if transaction exists and belongs to the user
    const { data: existingTxn, error: checkError } = await supabase
      .from("transactions")
      .select("id")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (checkError) {
      return res.status(500).json({
        success: false,
        message: "Failed to verify transaction status"
      });
    }

    if (!existingTxn) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or access unauthorized"
      });
    }

    // Delete row
    const { error: deleteError } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (deleteError) {
      console.error("Supabase delete transaction error:", deleteError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to delete transaction record"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully"
    });
  } catch (err) {
    console.error("deleteTransaction controller error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while deleting transaction"
    });
  }
};
