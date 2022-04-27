import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config()

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// mongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); () => {
    console.log("connected to DB")
}

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

// jwt
let refreshToken = []

function generateAccessToken(username) {
    return jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' })
}

//routes
app.post('/', (req, res) => {
    const token = req.body.token
    if (token == null) return res.sendStatus(401)

    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    return res.send({ user: user })
})

app.get("/login", (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    return res.send({ token: token })
})

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            if (password === user.password) {
                const token = generateAccessToken({ username: user.name })
                res.json(token)
            } else {
                res.send({ message: "wrong credentials" })
            }
        } else {
            res.send("not register", err)
        }
    })
});

app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            res.send({ message: "user already exist" })
        } else {
            const user = new User({ name, email, password })
            user.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "successful" })
                }
            })
        }
    })


})

app.listen(6969, () => {
    console.log("started on localhost:6969")
})