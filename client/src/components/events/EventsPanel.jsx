import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../../api/firebase';
import styles from './EventsPanel.module.css';

export default function EventsPanel() {
  const [events, setEvents] = useState([]);

  // Firebase'den etkinlikleri yükle
  useEffect(() => {
    const eventsRef = ref(rtdb, 'etkinlikler');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const eventsData = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          const eventData = child.val();
          eventsData.push({
            id: child.key,
            ...eventData,
            // Eğer attendees yoksa participantCount kullan
            attendees: eventData.participantCount || 1
          });
        });
      }
      // Tarihe göre sırala (en yakın tarih önce)
      eventsData.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.eventsPanel}>
      <div className={styles.header}>
        <h2>Etkinlikler</h2>
      </div>

      <div className={styles.eventsList}>
        {events.map((event) => (
          <div key={event.id} className={styles.eventCard}>
            <div className={styles.eventHeader}>
              <h3>{event.title}</h3>
              <div className={styles.attendeesWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={styles.attendeesIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                <span className={styles.attendees}>{event.attendees}</span>
              </div>
            </div>

            <p className={styles.description}>{event.description}</p>

            <div className={styles.eventDetails}>
              <div className={styles.detail}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={styles.detailIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span>{event.location}</span>
              </div>
              <div className={styles.detail}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={styles.detailIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                </svg>
                <span>{event.date}</span>
              </div>
              <div className={styles.detail}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={styles.detailIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>{event.time}</span>
              </div>
            </div>

            <button className={styles.joinBtn}>Katıl</button>
          </div>
        ))}
      </div>
    </div>
  );
}
