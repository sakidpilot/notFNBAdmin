import User from "../models/user.model.js";
import Payment from "../models/payment.model.js";
import { validationResult } from "express-validator";
import dotenv from"dotenv";
import { createSecretToken } from "../util/jwt.token.js";
import argon2 from "argon2";
import { registerValidate, loginValidate } from '../middleware/expressValidateAuth.middleware.js';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

dotenv.config();
const masala = process.env.MASALA;

//limit to admin - use token for auth check on method
export const registerAcc = async (req, res) => { //call signup

  const JWT_SECRET = process.env.JWT_SECRET;
  const token = req.headers.authorization.split(" ")[1]; // "Bearer <token>"
  const decodedToken = jwt.verify(token, JWT_SECRET);
  const role = decodedToken.role;

  if(role!='admin'){
    console.log("access denied");
    return res.status(401).json({ errors: errors.array(), message: "User permissions not granted! Access denied!" });
  }

  const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      console.log("errors");
      return res.status(401).json({ errors: errors.array(), message: "Invalid user inputs" });
    }
  
      try{
          const { name, idNum, accountNum, email, password, role} = req.body;
  
          /* validate if fields are filled *** --> whitelist inputs with regex
          if(!name || !idNum || !accountNum || !email || !password ){
            return res.status(401).json({error:'All fields are required'}) // fields not entered
          } */
  
          // Check if the user already exists
          const existingUser = await User.findOne({ $or: [{idNum}, {accountNum}, {email}]})
          if(existingUser) {
              return res.status(400).json({ success: false, message: "User already exists" });
          }
  
          //hash, salt and pepper the password using argon2 before saving it into mongoDB
          //argon2 has automatic salting when hashed
          const passwordHash = await argon2.hash(password + masala, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16, // 64 MB
            timeCost: 5,
            parallelism: 1, //***********
        });
  
        //console.log(passwordHash);
  
          // create the new user
          const newUser = new User({name, idNum, accountNum, email, password: passwordHash, role});
          await newUser.save();
          return res.status(201).json({success: true, message:'Account created successfully', user: {...newUser._doc, password: undefined,}})
          
          
  
      } catch (error) {
          res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message})
      }
  }


  export const verifyPayments = async (req, res) => {
    const { id } = req.params;
  
    const info = req.body; //user data input
  
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({success: false, message: "Payment not found!"})
    }
  
    //*** consider validating fields ***
    try {
      //info.body.updatedAt = Date.now(); // Update the timestamp manually in case `transactionStatus` isn't modified
  
      await Payment.findByIdAndUpdate(id, info,{new: true} ); // Return the updated document
      res.status(201).json({success: true, message: "Payment status verified and successfully updated!"});
  
    } catch(error) {
      console.error("Error occurred when updating payment in DB.", error.message);
      res.status(500).json({success: false, message: "Server Error!"});
    }
  }


  export const viewPendingPayments = async (req, res) => { 
  
    const transactionStatus = "Pending";
    try {
      const payments = await Payment.find({ transactionStatus });
  
      if (payments.length === 0) {
        return res.status(404).json({ error: "No pending payments found in database" });
      }
  
      console.log("pending payment called successfully");
      res.status(200).json(payments);
  
    } catch (error) {
      console.error("Error occurred when getting payments from DB", error.message);
          res.status(500).json({success: false, message: "Server Error!"});
    }
  }


  export const viewAllPayments = async (req, res) => { 
    try {
      const payments = await Payment.find({});
  
      if (payments.length === 0) {
        return res.status(404).json({ error: "No payments found in database" });
      }
  
      res.status(200).json(payments);
  
    } catch (error) {
      console.error("Error occurred when getting payments from DB", error.message);
          res.status(500).json({success: false, message: "Server Error!"});
    }
  }

  /*export const viewFailedPayments = async (req, res) => { 
  
    const transactionStatus = "Failed";
    try {
      const payments = await Payment.find({ transactionStatus });
  
      if (payments.length === 0) {
        return res.status(404).json({ error: "No failed payments found in database" });
      }
  
      res.status(200).json(payments);
  
    } catch (error) {
      console.error("Error occurred when getting payments from DB", error.message);
          res.status(500).json({success: false, message: "Server Error!"});
    }
  }*/


  /*export const viewCompletedPayments = async (req, res) => { 
  
    const transactionStatus = "Completed";
    try {
      const payments = await Payment.find({ transactionStatus });
  
      if (payments.length === 0) {
        return res.status(404).json({ error: "No completed payments found in database" });
      }
  
      res.status(200).json(payments);
  
    } catch (error) {
      console.error("Error occurred when getting payments from DB", error.message);
          res.status(500).json({success: false, message: "Server Error!"});
    }
  }*/





  