import { Router } from 'express';
import { signInWithPassword, registerUser, resetPassword } from '../controllers/authController.js';

const router = Router();

// Giriş endpoint'i (API key backend'te korunur)
router.post('/login', signInWithPassword);

// Kayıt endpoint'i
router.post('/register', registerUser);

// Şifre sıfırlama
router.post('/reset-password', resetPassword);

export default router;
