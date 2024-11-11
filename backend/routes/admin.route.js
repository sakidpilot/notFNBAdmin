import express from 'express';
import dotenv from 'dotenv';
import {registerAcc, viewPendingPayments, verifyPayments, viewAllPayments } from "../controllers/admin.controller.js";
import { registerValidate } from '../middleware/expressValidateAuth.middleware.js';
import authEmployeeMiddleware from '../middleware/authJWTemployee.middleware.js';
import { limitRequest } from '../middleware/limitRequest.middleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


// base route
router.get("/admin", (req, res) => {
    res.send("Admin Route");
});
 
router.post("/admin/signup", limitRequest, authEmployeeMiddleware, registerValidate, registerAcc);

router.put("/admin/verifyPayment/:id", limitRequest, authEmployeeMiddleware, verifyPayments);

router.get("/admin/pendingPayments", limitRequest, authEmployeeMiddleware, viewPendingPayments);

router.get("/admin/allPayments", limitRequest, authEmployeeMiddleware, viewAllPayments);


export default router 



/*router.get("admin/failedPayments", limitRequest, authEmployeeMiddleware, viewFailedPayments);

router.get("admin/completyedPayments", limitRequest, authEmployeeMiddleware, viewCompletedPayments);*/