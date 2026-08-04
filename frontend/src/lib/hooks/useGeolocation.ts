import { useState, useEffect } from 'react';

export interface LocationData {
  lat: number | null;
  lng: number | null;
  city: string | null;
  area: string | null;
  pincode: string | null;
  error: string | null;
  loading: boolean;
  isCustom: boolean; // True if the user manually selected a city
}

export function useGeolocation() {
  const [location, setLocation] = useState<LocationData>({
    lat: null, lng: null, city: null, area: null, pincode: null,
    error: null, loading: true, isCustom: false
  });

  const fetchIPLocation = async () => {
    try {
      // Using a free IP geolocation API
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      setLocation({
        lat: data.latitude,
        lng: data.longitude,
        city: data.city,
        area: null, // IP APIs usually don't give granular area
        pincode: data.postal,
        error: null,
        loading: false,
        isCustom: false
      });
    } catch (err) {
      setLocation(prev => ({ ...prev, error: "Failed to detect location", loading: false }));
    }
  };

  const detectLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    
    if (!navigator.geolocation) {
      fetchIPLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Use reverse geocoding to get city/area from lat/lng
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await res.json();
          
          setLocation({
            lat: latitude,
            lng: longitude,
            city: data.address.city || data.address.town || data.address.village || data.address.state_district,
            area: data.address.suburb || data.address.neighbourhood || null,
            pincode: data.address.postcode || null,
            error: null,
            loading: false,
            isCustom: false
          });
        } catch (err) {
          // Fallback if reverse geocoding fails but we have coordinates
          setLocation({
            lat: latitude, lng: longitude, city: "Current Location", area: null, pincode: null,
            error: null, loading: false, isCustom: false
          });
        }
      },
      (error) => {
        // Fallback to IP if permission denied or timeout
        console.warn("Geolocation Error:", error.message);
        fetchIPLocation();
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    // Only detect on mount if nothing is in local storage (we'll handle storage in context)
    // But for this hook, we expose the detectLocation method.
  }, []);

  return { location, setLocation, detectLocation };
}
