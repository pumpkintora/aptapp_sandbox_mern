import express from 'express';
const router = express.Router();
import { verify } from '../handlers/token.js'

router.post('/verify', verify)

export default router