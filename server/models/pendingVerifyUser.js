import mongoose from "mongoose";
import bcrypt from "bcrypt";

const pendingVerifyUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, },
    verifyToken: String,
    verifyTokenExpires: Date,
})

pendingVerifyUserSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next()
        }
        let hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword
        return next()
    } catch (err) {
        return next(err)
    }
})

const PendingVerifyUser = new mongoose.model("PendingVerifyUser", pendingVerifyUserSchema)

export default PendingVerifyUser