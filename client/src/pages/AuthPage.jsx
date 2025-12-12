import Button from '../components/common/Button';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth.jsx';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const { user, signInWithEmail, signUpWithEmail, signOut } = useAuth();

  const handleLogin = async () => {
    const email = window.prompt('E-postaınızı girin');
    const password = window.prompt('Şifre (en az 6 karakter)');
    if (email && password) {
      try {
        await signInWithEmail(email, password);
      } catch (err) {
        alert('Giriş başarısız: ' + err.message);
      }
    }
  };

  const handleSignUp = async () => {
    const email = window.prompt('E-postaınızı girin');
    const password = window.prompt('Şifre (en az 6 karakter)');
    if (email && password) {
      try {
        await signUpWithEmail(email, password);
        alert('Hesap oluşturuldu!');
      } catch (err) {
        alert('Kayıt başarısız: ' + err.message);
      }
    }
  };

  return (
    <Layout>
      <div className={styles.authContainer}>
        <div className={styles.card}>
          <h1>Friendly'e Hoşgeldiniz</h1>
          
          {user ? (
            <div className={styles.userSection}>
              <p>Giriş yaptı: <strong>{user.email}</strong></p>
              <Button onClick={signOut}>Çıkış Yap</Button>
            </div>
          ) : (
            <div className={styles.authSection}>
              <div className={styles.buttonGroup}>
                <Button onClick={handleLogin}>Giriş Yap</Button>
                <Button onClick={handleSignUp}>Kayıt Ol</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
