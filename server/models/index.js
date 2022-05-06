import mongoose from "mongoose";
import User from "./user.js"
import PendingVerifyUser from "./pendingVerifyUser.js";
import Profile from './profile.js';
import dotenv from 'dotenv';
dotenv.config()

mongoose.set("debug", true);
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); () => {
    console.log("connected to DB")
}

export default {
    User,
    PendingVerifyUser,
    // Profile,
    // Notification,
} 