import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';

const router = express.Router()

router.post('/v1/signup', signup)

router.post('/v1/login', login)

router.post('/v1/logout', logout)

export default router;