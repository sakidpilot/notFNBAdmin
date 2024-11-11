import express from 'express';
import bruteForce from "../middleware/bruteForceProtection.middleware.js"
import LoginAttemptLogger from "../middleware/loginAttemptLog.middleware.js";
import dotenv from 'dotenv';
import { loginAcc, /*registerAcc,*/ logoutAcc } from "../controllers/auth.controller.js";
import { /*registerValidate,*/ loginValidate } from '../middleware/expressValidateAuth.middleware.js';
import authMiddleware from "../middleware/authJWT.middleware.js";
import { limitRequest } from '../middleware/limitRequest.middleware.js';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


// base route
router.get("/", (req, res) => {
    res.send("Auth Route");
});

//router.post("/auth/signup", registerValidate, registerAcc);

// Login
// Apply rate limiting to login route
router.post("/auth/login",  bruteForce.prevent, LoginAttemptLogger, limitRequest,  loginValidate, loginAcc); 


//Logout
router.post("/auth/logout", limitRequest, authMiddleware, logoutAcc);


export default router