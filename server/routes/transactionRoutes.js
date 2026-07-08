import express from "express";
import { body, validationResult } from "express-validator";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from "../controllers/transactionController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to protect all routes in this file
router.use(protect);

// Helper validation middleware to process express-validator outputs
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

// Common validation chain for transaction payloads
const transactionValidation = [
  body("title").trim().notEmpty().withMessage("Transaction title is required"),
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be a positive number"),
  body("type").isIn(["income", "expense"]).withMessage("Type must be either 'income' or 'expense'"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("date").isDate().withMessage("A valid date (YYYY-MM-DD) is required")
];

// @route   GET & POST /api/transactions
router
  .route("/")
  .get(getTransactions)
  .post(transactionValidation, validateRequest, createTransaction);

// @route   GET, PUT & DELETE /api/transactions/:id
router
  .route("/:id")
  .get(getTransactionById)
  .put(transactionValidation, validateRequest, updateTransaction)
  .delete(deleteTransaction);

export default router;
