import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();


//create a collection called user using this schema in DB
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Your username is required"],
        //lowercase: true,
        match: [/^[a-zA-Z0-9_]{5,20}$/, 'Please fill in a valid username (5-20 alphanumeric characters)'], // Alphanumeric and underscores, 5-15 chars
      
    },
    idNum:{
        type: Number,
        required: [true, "Your ID number is required"],
        unique: true,
        match: [/^[0-9]{13}$/, 'Please fill in a valid ID number (max 13 digits)'],
       
    },
    accountNum:{
        type: Number,
        required: [true, "Your account number is required"],
        unique: true,
        match: [/^[0-9]{2,10}$/, 'Please fill in a valid account number (min 5 max 10 digits)'],
     
    },
    email:{
        type: String,
        required: [true, "Your email is required"],
        unique: true,
        //lowercase: true,
  
    },
    password:{
        type: String,
        required: [true, "Your password is required"],
        
    },
    role: {
        type: String,
        required: true,
        default: 'user', // Default role is 'user'
        enum: ['user', 'employee', 'admin'], // Define possible roles
    },
    lastLogin:{
        type: Date,
        default: Date.now,
        immutable: true
    }
}, {
    timestamps: true //time stamps to keep log of created user payment
});






//create an entry in db payment collection
const User = mongoose.model('User', userSchema);

export default User;