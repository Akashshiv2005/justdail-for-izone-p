import React, { createContext, useContext, useEffect } from 'react';
import { useGeolocation, LocationData } from '../hooks/useGeolocation';

interface LocationContextType {
  location: LocationData;
  setLocation: (loc: LocationData) => void;
  detectLocation: () => void;
  setCustomLocation: (city: string, lat?: number, lng?: number) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { location, setLocation, detectLocation } = useGeolocation();

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bizdial_location');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLocation({ ...parsed, loading: false });
      } catch (e) {
        detectLocation();
      }
    } else {
      detectLocation();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save to LocalStorage on change
  useEffect(() => {
    if (!location.loading && location.city) {
      localStorage.setItem('bizdial_location', JSON.stringify(location));
    }
  }, [location]);

  const setCustomLocation = (city: string, lat?: number, lng?: number) => {
    setLocation({
      lat: lat || null,
      lng: lng || null,
      city,
      area: null,
      pincode: null,
      error: null,
      loading: false,
      isCustom: true
    });
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, detectLocation, setCustomLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}
