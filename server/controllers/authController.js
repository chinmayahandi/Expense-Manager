import bcrypt from "bcryptjs";
import crypto from "crypto";
import { supabase } from "../config/supabaseClient.js";
import generateToken from "../utils/generateToken.js";
import { sendVerificationEmail, sendResetPasswordEmail } from "../services/emailService.js";

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

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save user in Supabase users table
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          full_name,
          email,
          password: hashedPassword,
          email_verified: false,
          verification_token: token,
          verification_token_expires: tokenExpires
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

    // Send verification email using Resend
    await sendVerificationEmail(email, full_name, token);

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        created_at: newUser.created_at
      }
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

    // Block login until email is verified
    if (!user.email_verified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email before logging in."
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

// @desc    Verify email address using verification token
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find user by verification token
    const { data: user, error: findError } = await supabase
      .from("users")
      .select("id, verification_token_expires")
      .eq("verification_token", token)
      .maybeSingle();

    const frontendUrl = process.env.FRONTEND_URL || "https://expensemanager-ochre.vercel.app";

    if (findError || !user) {
      console.warn(`Email verification failed. Token invalid: ${token}`);
      return res.redirect(`${frontendUrl}/login?verified=false&error=invalid`);
    }

    // Check if verification token has expired
    if (new Date(user.verification_token_expires) < new Date()) {
      console.warn(`Email verification failed. Token expired for user: ${user.id}`);
      return res.redirect(`${frontendUrl}/login?verified=false&error=expired`);
    }

    // Update user: email_verified=true and clear token
    const { error: updateError } = await supabase
      .from("users")
      .update({
        email_verified: true,
        verification_token: null,
        verification_token_expires: null
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Verification update error:", updateError.message);
      return res.redirect(`${frontendUrl}/login?verified=false&error=update_failed`);
    }

    console.log(`User ${user.id} email verified successfully.`);
    return res.redirect(`${frontendUrl}/login?verified=true`);
  } catch (err) {
    console.error("verifyEmail controller error:", err.message);
    const frontendUrl = process.env.FRONTEND_URL || "https://expensemanager-ochre.vercel.app";
    return res.redirect(`${frontendUrl}/login?verified=false&error=server_error`);
  }
};

// @desc    Trigger forgot password (generate reset token & send email)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const { data: user, error: findError } = await supabase
      .from("users")
      .select("id, full_name, email")
      .eq("email", email)
      .maybeSingle();

    if (findError || !user) {
      return res.status(404).json({
        success: false,
        message: "User with this email address does not exist."
      });
    }

    // Generate reset token and expiration timestamp
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const { error: updateError } = await supabase
      .from("users")
      .update({
        reset_password_token: resetToken,
        reset_password_token_expires: resetTokenExpires
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Forgot password token update error:", updateError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to generate password reset request"
      });
    }

    // Send reset password email using Resend
    await sendResetPasswordEmail(email, user.full_name, resetToken);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email."
    });
  } catch (err) {
    console.error("forgotPassword controller error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred during password reset request"
    });
  }
};

// @desc    Reset password using reset token
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by reset token
    const { data: user, error: findError } = await supabase
      .from("users")
      .select("id, reset_password_token_expires")
      .eq("reset_password_token", token)
      .maybeSingle();

    if (findError || !user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token."
      });
    }

    // Check if token has expired
    if (new Date(user.reset_password_token_expires) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Password reset link has expired. Please request a new one."
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear token fields
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        reset_password_token: null,
        reset_password_token_expires: null
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Reset password update error:", updateError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to reset password."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully."
    });
  } catch (err) {
    console.error("resetPassword controller error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred during password reset"
    });
  }
};

// @desc    Resend email verification token
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const { data: user, error: findError } = await supabase
      .from("users")
      .select("id, full_name, email, email_verified")
      .eq("email", email)
      .maybeSingle();

    if (findError || !user) {
      return res.status(404).json({
        success: false,
        message: "User with this email address does not exist."
      });
    }

    // If already verified, return error
    if (user.email_verified) {
      return res.status(400).json({
        success: false,
        message: "Email address is already verified."
      });
    }

    // Generate new token and expiration timestamp
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const { error: updateError } = await supabase
      .from("users")
      .update({
        verification_token: token,
        verification_token_expires: tokenExpires
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Resend verification token update error:", updateError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to generate verification request"
      });
    }

    // Send verification email
    await sendVerificationEmail(email, user.full_name, token);

    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully."
    });
  } catch (err) {
    console.error("resendVerification controller error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while resending verification"
    });
  }
};

