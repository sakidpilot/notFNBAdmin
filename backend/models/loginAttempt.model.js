import mongoose from "mongoose";

const loginAttemptSchema = new mongoose.Schema({
    accNum: { //change to account number
        type: Number, //Number
        required: [true, "Your account number is required"],
        immutable: true,
        trim: true,
        match: [/^[0-9]{5,10}$/, 'Please fill in a valid account number (min 5 max 10 digits)'],
    },
    ipAddress: {
        type: String,
        required: true,
        immutable: true
    },
    successfulLogin: {
        type: Boolean,
        required: true,
        immutable: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

export default mongoose.model("LoginAttempt", loginAttemptSchema);