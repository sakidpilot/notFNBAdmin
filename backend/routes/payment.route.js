import express from "express";
import authMiddleware from "../middleware/authJWT.middleware.js";
import dotenv from 'dotenv';
import { createPayments, readPayments} from "../controllers/payment.controller.js";
import rateLimit from "express-rate-limit";
import { limitRequest } from '../middleware/limitRequest.middleware.js';


const router = express.Router();


// Route to create a payment transaction
router.post("/payment/add", authMiddleware,  limitRequest, createPayments); 

// Route to view all transactions for a specific recipient --> REVISIT GET METHOD!!!!
router.get("/payment/read/:details", authMiddleware, limitRequest, readPayments); 

// Route to update a payment transaction by ID
//router.put("/update/:id", authMiddleware, updatePayments);

// Route to delete a payment transaction by ID
//router.delete("/delete/:id", authMiddleware, deletePayments);


export default router;