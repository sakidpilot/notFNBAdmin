import Payment from "../models/payment.model.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const createPayments = async (req, res) => {
    const payment = req.body; //user data input 

    //validation of data fields
    if(! payment.userAcc || !payment.amount || !payment.currency || !payment.provider || !payment.accountInfo || !payment.swiftCode){
        return res.status(400).json({success: false, message: "Please fill in all fields!"});
    }
 
    const newPayment = new Payment(payment);

    try {
        await newPayment.save();
        res.status(201).json({success: true, data: newPayment});
        
    } catch (error) {
        console.error("Error occurred when creating payment in DB", error.message);
        res.status(500).json({success: false, message: "Server Error!"}); // internal service error --> 500 status code
    }
}



export const readPayments = async (req, res) => { //read REVISIT LOGIC
  const JWT_SECRET = process.env.JWT_SECRET;
  const token = req.headers.authorization.split(" ")[1]; // "Bearer <token>"
  const decodedToken = jwt.verify(token, JWT_SECRET);
  const userAcc = decodedToken.accountNum;

  if (!userAcc) {
    return res.status(400).send({ message: "User account is missing from the token." });
  }
  try {
    const payments = await Payment.find({ userAcc });

    if (payments.length === 0) {
      return res.status(404).json({ error: "No payments found for this user" });
    }

    res.status(200).json(payments);

  } catch (error) {
    console.error("Error occurred when getting payments from DB", error.message);
        res.status(500).json({success: false, message: "Server Error!"});
  }
}

/*export const updatePayments = async (req, res) => {
    const { id } = req.params;
  
    const info = req.body; //user data input
  
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({success: false, message: "Payment not found!"})
    }
  
    //*** consider validating fields ***
    try {
      info.params.updatedAt = Date.now(); // Update the timestamp manually in case `transactionStatus` isn't modified
  
      await Payment.findByIdAndUpdate(id, info,{new: true} ); // Return the updated document
      res.status(200).json({success: true, data: updatedPayment});
  
    } catch(error) {
      console.error("Error occurred when updating payment in DB.", error.message);
      res.status(500).json({success: false, message: "Server Error!"});
    }
  }



  export const deletePayments = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedPayment = await Payment.findByIdAndDelete(id);
  
      if (!deletedPayment) {
        return res.status(404).json({ error: "Payment not found" });
      }
  
      res.status(200).json({ message: "Payment successfully deleted" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }


    */