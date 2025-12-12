import styles from './HomePage.module.css';
import MapContainer from '../components/map/MapContainer';
import Layout from '../components/layout/Layout';

export default function HomePage() {
  return (
    <Layout>
      <div className={styles.homeContainer}>
        <div className={styles.mapWrapper}>
          <MapContainer />
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <h2>Yakınımdaki Etkinlikler</h2>
            <div className={styles.eventsList}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Harita üzerindeki etkinlikleri tıkla
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <h3>Hakkında</h3>
            <p style={{ fontSize: 'var(--font-size-sm)' }}>
              Friendly, coğrafi tabanlı sosyal platform. Yakınınızdaki etkinlikleri keşfedin, 
              insanlarla bağlantı kurun ve gerçek zamanlı sohbet edin.
            </p>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
