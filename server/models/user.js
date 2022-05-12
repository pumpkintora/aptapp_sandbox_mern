import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    totp_secret: Object,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
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