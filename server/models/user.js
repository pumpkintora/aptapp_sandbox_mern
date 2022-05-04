import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
})

userSchema.pre("save", async function (next) {
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

userSchema.methods.comparePassword = async function (candidatePassword, next) {
    try {
        let isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (e) {
        next(e);
    }
}

const User = new mongoose.model("User", userSchema)

export default User