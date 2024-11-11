import mongoose from "mongoose";
import dotenv from "dotenv";

//env usage
dotenv.config();

//connect to db using db connection string
 export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to DB: ${error.message}`);
        process.exit(1); //exit with process code 1 meaning failure

    }
}