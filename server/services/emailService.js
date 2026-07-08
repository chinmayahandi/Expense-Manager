import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || "re_gNJ3GAcA_P9tG73mgaMUS11guq559hAQL");

/**
 * Sends a verification email to a newly signed up user
 * @param {string} email 
 * @param {string} fullName 
 * @param {string} token 
 */
export const sendVerificationEmail = async (email, fullName, token) => {
  const backendUrl = process.env.BACKEND_URL || "https://expensemanager-py2d.onrender.com";
  const verificationLink = `${backendUrl}/api/auth/verify-email/${token}`;
  
  const textContent = `Hello ${fullName},

Welcome to Expense Tracker.

Please verify your email by clicking below:

${verificationLink}

This link expires in 24 hours.`;

  try {
    console.log(`Sending verification email to ${email}...`);
    const { data, error } = await resend.emails.send({
      from: "Expense Tracker <onboarding@resend.dev>",
      to: email,
      subject: "Verify your Expense Tracker account",
      text: textContent
    });

    if (error) {
      console.error("Resend verification email API error:", error);
      throw error;
    }
    console.log(`Verification email sent successfully to ${email}. ID:`, data?.id);
    return data;
  } catch (err) {
    console.error(`Failed to send verification email to ${email}:`, err.message);
    throw err;
  }
};

/**
 * Sends a password reset email to a user
 * @param {string} email 
 * @param {string} fullName 
 * @param {string} token 
 */
export const sendResetPasswordEmail = async (email, fullName, token) => {
  const frontendUrl = process.env.FRONTEND_URL || "https://expensemanager-ochre.vercel.app";
  const resetLink = `${frontendUrl}/reset-password/${token}`;
  
  const textContent = `Hello ${fullName},

Click below to reset password:

${resetLink}

This link expires in 15 minutes.`;

  try {
    console.log(`Sending password reset email to ${email}...`);
    const { data, error } = await resend.emails.send({
      from: "Expense Tracker <onboarding@resend.dev>",
      to: email,
      subject: "Reset your Expense Tracker password",
      text: textContent
    });

    if (error) {
      console.error("Resend reset email API error:", error);
      throw error;
    }
    console.log(`Password reset email sent successfully to ${email}. ID:`, data?.id);
    return data;
  } catch (err) {
    console.error(`Failed to send password reset email to ${email}:`, err.message);
    throw err;
  }
};
