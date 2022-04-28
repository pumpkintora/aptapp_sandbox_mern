import express from 'express';
const router = express.Router();
import { signup, signin, authenticateToken } from '../handlers/auth.js'

router.get('/', authenticateToken)
router.post('/signup', signup)
router.post('/signin', signin)

export default router