import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import dotenv from"dotenv";
import { createSecretToken } from "../util/jwt.token.js";
import argon2 from "argon2";
import { registerValidate, loginValidate } from '../middleware/expressValidateAuth.middleware.js';
import jwt from 'jsonwebtoken';

dotenv.config();
const masala = process.env.MASALA;


/*export const registerAcc = async (req, res) => { //call signup
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array(), message: "Invalid user inputs" });
  }

    try{
        const { name, idNum, accountNum, email, password} = req.body;

        // validate if fields are filled *** --> whitelist inputs with regex
        //if(!name || !idNum || !accountNum || !email || !password ){
        //  return res.status(401).json({error:'All fields are required'}) // fields not entered
        //} 

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
        const newUser = new User({name, idNum, accountNum, email, password: passwordHash});
        await newUser.save();
        return res.status(201).json({success: true, message:'User created successfully', user: {...newUser._doc, password: undefined,}})

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message})
    }
} */


export const loginAcc = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }

    try {
        const { name, accountNum, password } = req.body; //get email and password from user
        
        /*** validate if fields are filled *** --> whitelist inputs with regex
        
        if(!name || !accountNum || !password ){
          return res.status(401).json({error:'All fields are required'}) // fields not entered
        } */
  
        const user = await User.findOne({ name , accountNum }); //find user object with the same number
        
        if(!user){
          console.log("No user found");
          return res.status(404).json({success: false, message:'User does not exist!' }) //user doesn't exist
        }


        // Verify the password using Argon2
        const auth = await argon2.verify(user.password, password + masala);
        if (!auth) {
          return res.status(401).json({ message: 'Incorrect credentials' });
        }                         
  
        // Create and set token **** check cookie
        // const token = createSecretToken(res, user._id);
        
        const token = jwt.sign({ name: user.name, accountNum: user.accountNum, role:user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: true, 
            sameSite: "strict",
            maxAge: 1*24*60*60*1000,
            secure: process.env.NODE_ENV === "production",
          });
         console.log("Current Session Token: " + token)
  
         user.lastLogin = new Date();
         await user.save();
  
        res.status(201).json({ success: true, message: "User logged in successfully", token:token , user: {...user._doc, password: undefined,}, accountNum: user.accountNum }); 
        //return res.status(201).json(token);

      }  catch (error) {
        res.status(500).json({success: false, message: 'Internal Server Error', error: error.message})
      }
}


export const logoutAcc = async (req, res) => {
  try 
  {
    res.clearCookie("token");

    console.log("User certs cleared on logout");

    return res.status(200).json({success: true, message:'Logged Out Successfully'}) 
  
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message})
  }
}