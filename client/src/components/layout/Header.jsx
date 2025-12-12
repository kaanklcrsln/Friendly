import styles from './Header.module.css';
import { useAuth } from '../../hooks/useAuth.jsx';

export default function Header() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>🌍 Friendly</h1>
        </div>

        <nav className={styles.nav}>
          <a href="/">Harita</a>
          <a href="/events">Etkinlikler</a>
          <a href="/chat">Sohbet</a>
          <a href="/about">Hakkında</a>
        </nav>

        <div className={styles.userMenu}>
          {user ? (
            <>
              <span className={styles.userEmail}>{user.email}</span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Çıkış
              </button>
            </>
          ) : (
            <a href="/auth" className={styles.loginBtn}>
              Giriş Yap
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
