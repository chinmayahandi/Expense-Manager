import jwt from "jsonwebtoken";
import { supabase } from "../config/supabaseClient.js";
import dotenv from "dotenv";

dotenv.config();

const protect = async (req, res, next) => {
  let token;

  // Check for Authorization header with Bearer scheme
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from Supabase to ensure they still exist and token is valid
      const { data: user, error } = await supabase
        .from("users")
        .select("id, email, full_name")
        .eq("id", decoded.id)
        .single();

      if (error || !user) {
        return res.status(401).json({
          success: false,
          message: "User not found or authorization denied"
        });
      }

      // Attach user details to request object
      req.user = user;
      next();
    } catch (err) {
      console.error("Auth middleware error:", err.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token is invalid or expired"
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided"
    });
  }
};

export default protect;
