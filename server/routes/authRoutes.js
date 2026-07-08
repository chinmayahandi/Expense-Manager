import express from "express";
import { body, validationResult } from "express-validator";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

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

// @route   POST /api/auth/register
router.post(
  "/register",
  [
    body("full_name").trim().notEmpty().withMessage("Full name is required"),
    body("email").trim().isEmail().withMessage("A valid email address is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
  ],
  validateRequest,
  registerUser
);

// @route   POST /api/auth/login
router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("A valid email address is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validateRequest,
  loginUser
);

// @route   GET /api/auth/me
router.get("/me", protect, getMe);

export default router;
