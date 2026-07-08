import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (userId, email) => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  // Signs the user identity into a 30-day token
  return jwt.sign({ id: userId, email }, secret, {
    expiresIn: "30d"
  });
};

export default generateToken;
