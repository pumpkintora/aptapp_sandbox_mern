import db from '../models/index.js'
import jwt from 'jsonwebtoken'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// function generateOTP() {         
//     // Declare a digits variable 
//     // which stores all digits
//     var digits = '0123456789';
//     let otp = '';
//     for (let i = 0; i < 6; i++ ) {
//         otp += digits[Math.floor(Math.random() * 10)];
//     }
//     return otp;
// }

export const signin = async (req, res, next) => {
    // finding a user
    try {
        let user = await db.User.findOne({
            email: req.body.email,
        })
        let { id, email } = user
        let isMatch = await user.comparePassword(req.body.password)
        if (isMatch) {
            let token = jwt.sign(
                { id, email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' },
            )
            return res.status(200).json({
                id,
                email,
                token,
            })
        } else {
            return next({
                status: 400,
                message: 'Invalid Email/Password.',
            })
        }
    } catch (e) {
        return next({ status: 400, message: 'Invalid Email/Password.' })
    }
}

export const signup = async (req, res, next) => {
    try {
        // check if email is taken
        let notUniqueUser = await db.User.findOne({email: req.body.email})
        let notUniquePending = await db.PendingVerifyUser.findOne({email: req.body.email})
        if (notUniqueUser || notUniquePending) return res.send({ message: 'Email is taken!'})
        // create a pending verify user
        let pendingVerifyUser = await db.PendingVerifyUser.create(req.body)
        // return successful response
        return res.status(200).json(pendingVerifyUser)
    } catch (e) {
        if (e.code === 11000) {
            e.message = 'username/email taken'
        }
        return next({
            status: 400,
            message: e.message,
        })
    }
}

export const setupTFA = async (req, res, next) => {
    try {
        // find the pending verify user
        let pendingVerifyUser = await db.PendingVerifyUser.findOne({ email: req.body.email })
        if (!pendingVerifyUser) return res.send({ message: 'pending verify user not found'})
        // generate totp_secret
        let totp_secret = speakeasy.generateSecret();
        totp_secret.otpauth_url = totp_secret.otpauth_url.replace("SecretKey", "aptvise")
        pendingVerifyUser.totp_secret = totp_secret
        // generate qrcode
        let qrcode = await QRCode.toDataURL(totp_secret.otpauth_url)
        console.log(qrcode)
        console.log(await QRCode.toString(totp_secret.otpauth_url))
        // generate a verify token
        let verifyToken = await crypto.randomBytes(64).toString('hex')
        pendingVerifyUser.verifyToken = verifyToken
        await pendingVerifyUser.save().catch(err => console.error(err))
        // email user with link containing verify token
        const msg = {
            to: req.body.email,
            from: 'Aptvise <noreply@aptvise.com>', // Use the email address or domain you verified above
            subject: 'Email verification link',
            text: `Go to this link to complete your email verification: http://localhost:3000/auth/verify/${verifyToken}`,
        }
        await sgMail.send(msg).catch((err) => console.error(err.response.body))
        console.log('verification email sent!')
        return res.status(200).json(pendingVerifyUser)
    } catch (e) {
        return next({ 
            status: 400, 
            message: e.message 
        })
    }
}

export const verifyEmail = async (req, res, next) => {
    try {
        // find the verifying user from PendingVerifyUser collection
        let pendingUser = await db.PendingVerifyUser.findOne({
            verifyToken: req.params.verifyToken,
        })
        // if pending user not found, return error
        if (!pendingUser) return res.send({ message: 'invalid verification token' })
        // create a user in database
        let { email, password, totp_secret } = pendingUser
        let user = await db.User.create({
            email,
            password,
            totp_secret
        })
        await pendingUser.remove()
        return res.status(200).json(user)
    } catch (e) {
        return next({ 
            status: 400, 
            message: e.message 
        })
    }
}

// verify user session with jwt token
// if token is invalid or expired, return 401 error
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        return res.send({ user: user })
    } catch (e) {
        return next({ status: 400, message: 'invalid token' })
    }
}

export const forgotPassword = async (req, res, next) => {
    try {
        // find user by email
        let user = await db.User.findOne({
            email: req.body.email,
        })
        if (!user) {
            return res.send({ userExist: false })
        }
        // create a token for reset password
        let token = await crypto.randomBytes(64).toString('hex')
        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 10 * 1000
        await user.save().catch((err) => console.log(err))
        // send reset password email
        const msg = {
            to: user.email,
            from: 'Aptvise <noreply@aptvise.com>', // Use the email address or domain you verified above
            subject: 'Reset password',
            text: `Reset password by clicking this link: http://localhost:3000/auth/new-password/${token}`,
            // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        }
        await sgMail.send(msg).catch((err) => console.error(err.response.body))
        console.log('email sent!')
        return res.send({ userExist: true })
    } catch (e) {
        return next(e)
    }
}

// if reset token still valid, set new password
export const resetPassword = async (req, res, next) => {
    try {
        // find user by reset password token
        const { token } = req.params
        let user = await db.User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        })
        if (!user) {
            return res.send({ resetPassword: false })
        }
        user.password = await bcrypt.hash(req.body.newPassword, 10)
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save().catch((err) => console.error(err))
        return res.send({ resetPassword: true })
    } catch (e) {
        return next(e)
    }
}
