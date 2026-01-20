import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    // Remove "Bearer " prefix if present
    const tokenString = token.startsWith("Bearer ") ? token.slice(7).trimStart() : token;

    const verified = jwt.verify(tokenString, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};