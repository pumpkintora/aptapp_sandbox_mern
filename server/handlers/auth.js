import db from "../models/index.js"
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import crypto from "crypto";
import sgMail from "@sendgrid/mail"
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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

// verify user with jwt token
// if token is invalid or expired, return 401 error
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        return res.send({ user: user })
    } catch (e) {
        return next({ status: 400, message: "invalid token" })
    }
}

// if user exists, send reset password email 
export const forgotPassword = async (req, res, next) => {
    try {
        let user = await db.User.findOne({
            email: req.body.email
        });
        if (!user) {
            return res.send({ userExist: false })
        }
        let token = await crypto.randomBytes(64).toString('hex')
        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + (5 * 60 * 1000)
        await user.save().catch(err => console.log(err))
        const msg = {
            to: user.email,
            from: 'Aptvise <noreply@aptvise.com>', // Use the email address or domain you verified above
            subject: 'Reset password',
            text: `Reset password by clicking this link: http://localhost:3000/reset-password/${token}`,
            // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        await sgMail.send(msg).catch(err => console.error(err.response.body))
        console.log('email sent!')
        return res.send({ userExist: true })
    } catch (e) {
        return next(e)
    }
}

// if reset token still valid, set new password
export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params
        let user = await db.User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.send({ resetPassword: false })
        }
        user.password = req.body.newPassword
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save().catch(err => console.error(err));
        return res.send({ resetPassword: true })
    } catch (e) {
        return next(e)
    }
}