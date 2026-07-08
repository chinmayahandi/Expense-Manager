import bcrypt from "bcryptjs";
import { supabase } from "../config/supabaseClient.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered to another user"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user in Supabase users table
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          full_name,
          email,
          password: hashedPassword
        }
      ])
      .select("id, full_name, email, created_at")
      .single();

    if (insertError || !newUser) {
      console.error("Supabase insert user error:", insertError?.message);
      return res.status(500).json({
        success: false,
        message: "Failed to create user account"
      });
    }

    // Generate JWT token
    const token = generateToken(newUser.id, newUser.email);

    return res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        created_at: newUser.created_at
      },
      token
    });
  } catch (err) {
    console.error("Register user controller error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred during registration"
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const { data: user, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (findError || !user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address or password"
      });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address or password"
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        created_at: user.created_at
      },
      token
    });
  } catch (err) {
    console.error("Login user controller error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred during login"
    });
  }
};

// @desc    Get currently logged-in user profile details
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // req.user is already populated by protect middleware
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (err) {
    console.error("getMe controller error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while fetching profile"
    });
  }
};
