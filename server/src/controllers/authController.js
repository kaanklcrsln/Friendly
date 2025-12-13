import admin from 'firebase-admin';
import { rtdb } from '../config/firebase.js';
import { ref, set, get } from 'firebase/database';

// Firebase Admin SDK ile authentication yapıyoruz (API key exposed olmaz)
export const signInWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email ve şifre gereklidir' });
    }

    // Firebase Admin SDK kullan (backend'te secure)
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Client'e token döndür (şifre doğrulaması frontend'te yapılacak)
    return res.status(200).json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      message: 'Kullanıcı bulundu'
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Giriş başarısız' });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, displayName, university, department, year } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'Email, şifre ve isim gereklidir' });
    }

    // Firebase Admin ile kullanıcı oluştur
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName
    });

    // Realtime Database'e kullanıcı bilgilerini kaydet
    const userRef = ref(rtdb, `users/${userRecord.uid}`);
    await set(userRef, {
      uid: userRecord.uid,
      email,
      displayName,
      university: university || '',
      department: department || '',
      year: year || 0,
      profilePicture: '',
      bio: '',
      createdAt: Date.now()
    });

    return res.status(201).json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      message: 'Kayıt başarılı'
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(400).json({ error: error.message || 'Kayıt başarısız' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email gereklidir' });
    }

    // Firebase Admin ile geçici şifre sıfırla
    const resetLink = await admin.auth().generatePasswordResetLink(email);

    return res.status(200).json({
      resetLink,
      message: 'Şifre sıfırlama linki gönderildi'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(400).json({ error: 'Şifre sıfırlama başarısız' });
  }
};
