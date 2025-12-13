import { useEffect, useRef, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../../api/firebase';
import styles from './MapContainer.module.css';

export default function MapContainer() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapType, setMapType] = useState('roadmap');
  const [events, setEvents] = useState([]);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Ankara koordinatları
    const ankaraCoords = { lat: 39.9334, lng: 32.8597 };

    // Google Maps API'ı kontrol et ve harita oluştur
    if (window.google && window.google.maps) {
      initializeMap(ankaraCoords);
    } else {
      // API henüz yüklenmemişse bekle
      const checkApi = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkApi);
          initializeMap(ankaraCoords);
        }
      }, 100);
    }

    function initializeMap(coords) {
      // Ankara sınırları (daha hassas)
      const ankaraBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(39.4, 32.4), // Southwest (güneybatı)
        new window.google.maps.LatLng(42.5, 36.3)   // Northeast (kuzeydoğu)
      );

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 11,
        center: coords,
        mapTypeId: 'roadmap',
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.LEFT_TOP
        },
        streetViewControl: true,
        streetViewControlOptions: {
          position: window.google.maps.ControlPosition.LEFT_TOP
        },
        mapTypeControl: false,
        fullscreenControl: false,
        rotateControl: false,
        scaleControl: false,
        panControl: false,
        minZoom: 11,
        maxZoom: 18,
        restriction: {
          latLngBounds: ankaraBounds,
          strictBounds: false
        }
      });

      // Bounds değiştiğinde kontrol et
      map.addListener('bounds_changed', () => {
        const bounds = map.getBounds();
        if (bounds && !ankaraBounds.contains(bounds.getCenter())) {
          map.fitBounds(ankaraBounds);
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter({ lat: 39.9334, lng: 32.8597 });
      }
    };
  }, []);

  // Firebase'den etkinlikleri yükle
  useEffect(() => {
    const eventsRef = ref(rtdb, 'etkinlikler');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const eventsData = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          const eventData = child.val();
          if (eventData.coordinates) {
            eventsData.push({
              id: child.key,
              ...eventData
            });
          }
        });
      }
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  // Etkinlik markerlarını haritaya ekle
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;

    // Önceki markerları temizle
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Yeni markerları ekle
    events.forEach(event => {
      if (event.coordinates) {
        const marker = new window.google.maps.Marker({
          position: event.coordinates,
          map: mapInstanceRef.current,
          title: event.title,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4a7ab5" width="32" height="32">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32)
          }
        });

        // InfoWindow ekle
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; min-width: 220px; font-family: 'Nunito', sans-serif;">
              <h3 style="margin: 0 0 8px 0; color: #2d3748; font-size: 16px;">${event.title}</h3>
              <p style="margin: 4px 0; color: #4a5568; font-size: 14px;">${event.description}</p>
              <p style="margin: 6px 0; font-weight: bold; color: #4a7ab5; font-size: 13px;">📍 ${event.location}</p>
              <div style="display: flex; gap: 12px; margin: 6px 0; font-size: 13px; color: #4a5568;">
                <span>📅 ${event.date}</span>
                <span>⏰ ${event.time}</span>
              </div>
              <p style="margin: 6px 0 0 0; color: #4a5568; font-size: 13px;">
                👥 ${event.participantCount || 1} kişi katılıyor
              </p>
              <p style="margin: 8px 0 0 0; padding: 4px 8px; background: #f0f9ff; border-radius: 4px; font-size: 12px; color: #1e40af;">
                ${event.category} kategorisinde
              </p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

        markersRef.current.push(marker);
      }
    });
  }, [events]);

  const changeMapType = (type) => {
    setMapType(type);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(type);
    }
  };

  return (
    <div className={styles.mapWrapper}>
      <div ref={mapRef} className={styles.mapContainer} />
      
      {/* Layer Selection Button - Top Right */}
      <div className={styles.layerControl}>
        <button
          className={`${styles.layerBtn} ${mapType === 'satellite' ? styles.active : ''}`}
          onClick={() => changeMapType('satellite')}
          title="Uydu Görüntüsü"
        >
          🛰️ Uydu
        </button>
        <button
          className={`${styles.layerBtn} ${mapType === 'roadmap' ? styles.active : ''}`}
          onClick={() => changeMapType('roadmap')}
          title="Harita"
        >
          🗺️ Harita
        </button>
      </div>

      {/* Footer Attribution - Bottom Right */}
      <div className={styles.mapFooter}>
        FriendlyGIS by kaanklcrsln
      </div>
    </div>
  );
}
