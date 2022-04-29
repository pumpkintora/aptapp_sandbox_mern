import db from "../models/index.js"
import jwt from "jsonwebtoken";

export const signin = async (req, res, next) => {
    // finding a user
    try {
        let user = await db.User.findOne({
            email: req.body.email
        });
        let { id, email } = user;
        let isMatch = await user.comparePassword(req.body.password);
        if (isMatch) {
            let token = jwt.sign(
                { id, email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "10s" }
            );
            return res.status(200).json({
                id,
                email,
                token
            });
        } else {
            return next({
                status: 400,
                message: "Invalid Email/Password."
            });
        }
    } catch (e) {
        return next({ status: 400, message: "Invalid Email/Password." });
    }
}

export const signup = async (req, res, next) => {
    try {
        // create a user 
        // create a token
        let user = await db.User.create(req.body);
        let { id, email } = user
        let token = jwt.sign(
            { id, email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        )
        return res.status(200).json({
            id, email, token
        })
    } catch (e) {
        if (e.code === 11000) {
            e.message = "username/email taken"
        }
        return next({
            status: 400,
            message: e.message
        })
    }
}

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)
    
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        return res.send({user: user})
    } catch (e) {
        return next({ status: 400, message: "invalid token"})
    }
}