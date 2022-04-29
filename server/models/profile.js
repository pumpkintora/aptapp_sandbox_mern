import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User" },
    first_name: { type: String, required: true, unique: true },
    last_name: { type: String, required: true, unique: true },
    telephone: { type: String, required: true, },
    role: { type: String, required: true, },
    dob: { type: Date, required: true, },
    nationality: { type: String, required: true, },
    citizenship: { type: String, required: true, },
    residence: { type: String, required: true, },
    identity: { type: String, required: true, },
    nric: { type: String, required: true, },
    passport_no: { type: String, required: true, },
    gender: { type: String, required: true, },
    address_1: { type: String, required: true, },
    address_2: String,
    postal_code: { type: String, required: true, },
})

const Profile = new mongoose.model("Profile", profileSchema)

export default Profile
