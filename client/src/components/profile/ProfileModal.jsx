import { useState, useEffect, useRef } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { rtdb, auth, storage } from '../../api/firebase';
import ImageCropModal from './ImageCropModal';
import styles from './ProfileModal.module.css';

const UNIVERSITIES = [
  'Boğaziçi Üniversitesi',
  'İstanbul Teknik Üniversitesi',
  'ODTÜ',
  'Hacettepe Üniversitesi',
  'İstanbul Üniversitesi',
  'Ankara Üniversitesi',
  'Ege Üniversitesi',
  'Dokuz Eylül Üniversitesi',
  'Marmara Üniversitesi',
  'Yıldız Teknik Üniversitesi',
  'Sabancı Üniversitesi',
  'Koç Üniversitesi',
  'Bilkent Üniversitesi',
  'Galatasaray Üniversitesi',
  'Bahçeşehir Üniversitesi',
  'Diğer'
];

export default function ProfileModal({ isOpen, onClose }) {
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    university: '',
    bio: '',
    socialLinks: ['', '', ''],
    profilePicture: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const userRef = ref(rtdb, `users/${userId}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProfile({
          displayName: data.displayName || auth.currentUser.displayName || '',
          email: data.email || auth.currentUser.email || '',
          university: data.university || '',
          bio: data.bio || '',
          socialLinks: data.socialLinks || ['', '', ''],
          profilePicture: data.profilePicture || null
        });
      }
    });

    return () => unsubscribe();
  }, [isOpen]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Dosya boyutu 5MB\'dan küçük olmalıdır' });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCroppedImage = async (croppedBlob) => {
    setShowCropModal(false);
    setLoading(true);

    try {
      const userId = auth.currentUser.uid;
      const imageRef = storageRef(storage, `profilePictures/${userId}/profile.jpg`);
      
      await uploadBytes(imageRef, croppedBlob);
      const downloadURL = await getDownloadURL(imageRef);

      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, { photoURL: downloadURL });

      // Update Realtime Database
      const userRef = ref(rtdb, `users/${userId}`);
      await update(userRef, { profilePicture: downloadURL });

      setProfile(prev => ({ ...prev, profilePicture: downloadURL }));
      setMessage({ type: 'success', text: 'Profil resmi güncellendi!' });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setMessage({ type: 'error', text: 'Profil resmi yüklenirken bir hata oluştu' });
    } finally {
      setLoading(false);
      setSelectedImage(null);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const userId = auth.currentUser.uid;
      const userRef = ref(rtdb, `users/${userId}`);

      await update(userRef, {
        displayName: profile.displayName,
        university: profile.university,
        bio: profile.bio,
        socialLinks: profile.socialLinks.filter(link => link.trim() !== '')
      });

      // Update Firebase Auth display name
      await updateProfile(auth.currentUser, { displayName: profile.displayName });

      setMessage({ type: 'success', text: 'Profil güncellendi!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Profil güncellenirken bir hata oluştu' });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLinkChange = (index, value) => {
    const newLinks = [...profile.socialLinks];
    newLinks[index] = value;
    setProfile(prev => ({ ...prev, socialLinks: newLinks }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h3>Profili Düzenle</h3>
            <button className={styles.closeBtn} onClick={onClose}>×</button>
          </div>

          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <div className={styles.form}>
            {/* Profile Picture */}
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profil" className={styles.avatar} />
                ) : (
                  <div className={styles.avatarPlaceholder}>👤</div>
                )}
                <button
                  className={styles.avatarEditBtn}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  📷
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <p className={styles.avatarHint}>256x256 px olarak kırpılacak</p>
            </div>

            {/* Display Name */}
            <div className={styles.field}>
              <label>Kullanıcı Adı</label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Kullanıcı adınız"
                maxLength={50}
              />
            </div>

            {/* Email (readonly) */}
            <div className={styles.field}>
              <label>E-posta</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className={styles.disabled}
              />
            </div>

            {/* University */}
            <div className={styles.field}>
              <label>Üniversite</label>
              <select
                value={profile.university}
                onChange={(e) => setProfile(prev => ({ ...prev, university: e.target.value }))}
              >
                <option value="">Üniversite seçin</option>
                {UNIVERSITIES.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>

            {/* Bio */}
            <div className={styles.field}>
              <label>Biyografi</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Kendinizden bahsedin..."
                maxLength={200}
                rows={3}
              />
              <span className={styles.charCount}>{profile.bio.length}/200</span>
            </div>

            {/* Social Links */}
            <div className={styles.field}>
              <label>Sosyal Medya Linkleri (maks. 3)</label>
              {[0, 1, 2].map(index => (
                <input
                  key={index}
                  type="url"
                  value={profile.socialLinks[index] || ''}
                  onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                  placeholder={`Link ${index + 1} (örn: instagram.com/kullaniciadi)`}
                  className={styles.socialInput}
                />
              ))}
            </div>

            {/* Save Button */}
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>

      {showCropModal && selectedImage && (
        <ImageCropModal
          image={selectedImage}
          onCrop={handleCroppedImage}
          onClose={() => {
            setShowCropModal(false);
            setSelectedImage(null);
          }}
        />
      )}
    </>
  );
}
