import express from 'express'
const router = express.Router()
import {
    signin,
    signup,
    setupTFA,
    verifyEmail,
    authenticateToken,
    forgotPassword,
    resetPassword,
} from '../handlers/auth.js'

router.get('/', authenticateToken)
router.post('/signup', signup)
router.post('/signin', signin)
router.post('/setup-tfa', setupTFA)
router.post('/verify-email/:verifyToken', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

export default router
