import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Create secret token function
// Sign token with user ID and secret key
// Set token expiration to 1 hour
export const createSecretToken = async (res, userId) => { 
  const token = jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie("token", token, {
    withCredentials: true,
    httpOnly: true, 
    sameSite: "strict",
    maxAge: 1*24*60*60*1000,
    secure: process.env.NODE_ENV === "production",
  });

  return token;
};
    
   
