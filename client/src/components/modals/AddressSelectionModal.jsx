import { useEffect, useRef, useState } from 'react';
import styles from './AddressSelectionModal.module.css';

export default function AddressSelectionModal({ isOpen, onClose, onLocationSelect }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);
  const locationInputRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');

  useEffect(() => {
    if (isOpen && window.google && window.google.maps && mapRef.current) {
      initializeMap();
    }
  }, [isOpen]);

  const initializeMap = async () => {
    // Ankara merkez koordinatları
    const ankaraCenter = { lat: 39.9334, lng: 32.8597 };

    // Harita oluştur
    const map = new window.google.maps.Map(mapRef.current, {
      center: ankaraCenter,
      zoom: 12,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: true,
      zoomControl: true,
      restriction: {
        latLngBounds: {
          north: 40.4,
          south: 39.4,
          east: 33.9,
          west: 31.8
        }
      }
    });

    // Marker oluştur
    const marker = new window.google.maps.Marker({
      map: map,
      position: ankaraCenter,
      title: 'Seçilen Konum',
      draggable: true
    });

    markerRef.current = marker;

    // Haritaya tıklama olayı ekle
    map.addListener('click', (event) => {
      const clickedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      
      marker.setPosition(clickedLocation);
      
      // Geocoding ile adres al
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: clickedLocation }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setSelectedAddress(results[0].formatted_address);
          setSelectedPlace({
            formatted_address: results[0].formatted_address,
            geometry: { location: event.latLng },
            place_id: results[0].place_id
          });
        }
      });
    });

    // Marker sürükleme olayı
    marker.addListener('dragend', (event) => {
      const draggedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      
      // Geocoding ile adres al
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: draggedLocation }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setSelectedAddress(results[0].formatted_address);
          setSelectedPlace({
            formatted_address: results[0].formatted_address,
            geometry: { location: event.latLng },
            place_id: results[0].place_id
          });
        }
      });
    });

    // Autocomplete oluştur
    if (locationInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        locationInputRef.current,
        {
          fields: ['address_components', 'geometry', 'name', 'formatted_address'],
          types: ['establishment', 'geocode'],
          componentRestrictions: { country: 'tr' },
          bounds: new window.google.maps.LatLngBounds(
            { lat: 39.4, lng: 31.8 },
            { lat: 40.4, lng: 33.9 }
          )
        }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry) {
          alert(`"${place.name}" için detay bulunamadı`);
          return;
        }

        // Haritayı güncelle
        map.setCenter(place.geometry.location);
        marker.setPosition(place.geometry.location);

        // Seçilen adresi güncelle
        setSelectedAddress(place.formatted_address || place.name);
        setSelectedPlace(place);
      });

      autocompleteRef.current = autocomplete;
    }
  };

  const handleConfirm = () => {
    if (selectedPlace && selectedPlace.geometry) {
      onLocationSelect({
        address: selectedAddress,
        fullAddress: selectedPlace.formatted_address,
        coordinates: {
          lat: selectedPlace.geometry.location.lat(),
          lng: selectedPlace.geometry.location.lng()
        },
        placeId: selectedPlace.place_id
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.splitLayout}>
          {/* Sol Panel - Form */}
          <div className={styles.formPanel}>
            <div className={styles.header}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span className={styles.title}>Konum Seçimi</span>
            </div>

            <div className={styles.formGroup}>
              <input
                ref={locationInputRef}
                type="text"
                placeholder="Adres ara veya haritadan seç..."
                className={styles.input}
              />
            </div>

            {selectedAddress && (
              <div className={styles.selectedAddress}>
                <h4>Seçilen Adres:</h4>
                <p>{selectedAddress}</p>
              </div>
            )}

            <div className={styles.mapInstructions}>
              <p>💡 <strong>Nasıl kullanılır:</strong></p>
              <ul>
                <li>Yukarıdaki arama kutusuna adres yazabilirsiniz</li>
                <li>Haritaya tıklayarak konum seçebilirsiniz</li>
                <li>Kırmızı işareti sürükleyerek konumu ayarlayabilirsiniz</li>
              </ul>
            </div>

            <div className={styles.actions}>
              <button 
                className={styles.cancelBtn}
                onClick={onClose}
              >
                İptal
              </button>
              <button 
                className={styles.confirmBtn}
                onClick={handleConfirm}
                disabled={!selectedPlace}
              >
                Seç
              </button>
            </div>
          </div>

          {/* Sağ Panel - Harita */}
          <div className={styles.mapPanel}>
            <div ref={mapRef} className={styles.map}></div>
          </div>
        </div>
      </div>
    </div>
  );
}