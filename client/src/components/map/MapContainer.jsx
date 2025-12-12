import styles from './MapContainer.module.css';
import { useEffect, useRef } from 'react';

export default function MapContainer() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Leaflet dinamik import (SSR uyumlu)
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        if (!mapRef.current || mapRef.current._leaflet_map) return;

        const map = L.map(mapRef.current).setView([39.0, 35.0], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        // Demo marker
        L.marker([39.9334, 32.8597])
          .bindPopup('Ankara, Türkiye')
          .addTo(map);
      });
    }
  }, []);

  return <div ref={mapRef} className={styles.mapContainer} />;
}
