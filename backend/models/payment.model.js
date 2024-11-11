import mongoose from "mongoose"; //sanitize*** also add user email 

//create a collection called payment using this schema in DB
const paymentSchema = new mongoose.Schema({
    userAcc:{
        type: Number,
        required: true,
        trim: true
    },
    amount:{
        type: Number,
        required: [true, "An amount is required"],
        min: 0,
        trim: true
    },
    currency:{
        type: String,
        required: [true, "Currency is required"],
        enum: ['ZAR', 'EUR', 'GBP', 'USD'], //revisit
        default: 'ZAR'
    },
    provider:{
        type: String,
        required: [true, "Provider is required"],
        enum: ['SWIFT', 'PAYFAST'], //revisit
        default: 'SWIFT'
    },
    accountInfo:{
        type: Number,
        required: [true, "An account number is required"],
        trim: true,
    },
    swiftCode:{
        type: Number,
        required: [true, "Swift Code is required"],
        trim: true,
    },
    transactionStatus: { // Status of the payment
        type: String,
        required: true,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    createdAt: { // When the transaction was initiated
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: { // When the transaction status was last updated
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true //time stamps to keep log of created user payment
});


// Middleware to update the `updatedAt` field when transactionStatus is updated **
paymentSchema.pre('save', function (next) {
    if (this.isModified('transactionStatus')) {
        this.updatedAt = Date.now();
    }
    next();
});

paymentSchema.pre('findByIdAndUpdate', function (next) {
    if (this.isModified('transactionStatus')) {
        this.updatedAt = Date.now();
    }
    next();
});

//create an entry in db payment collection
const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;