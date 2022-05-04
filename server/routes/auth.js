import express from 'express';
const router = express.Router();
import { signup, signin, authenticateToken, reset } from '../handlers/auth.js'

router.get('/', authenticateToken)
router.post('/signup', signup)
router.post('/signin', signin)
router.post('/reset', reset)

export default router