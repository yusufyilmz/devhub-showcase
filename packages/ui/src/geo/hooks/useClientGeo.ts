"use client";

import { useState } from "react";
import { logger } from "@/shared/utils/logger";

export interface ClientGeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  city?: string;
  region?: string;
  country?: string;
  formatted_address?: string;
}

export interface UseClientGeoReturn {
  location: ClientGeoLocation | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
}

export function useClientGeo(): UseClientGeoReturn {
  const [location, setLocation] = useState<ClientGeoLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;

          // Try to get address from coordinates using reverse geocoding
          let geoData: ClientGeoLocation = {
            latitude,
            longitude,
            accuracy,
          };

          try {
            // Use a free reverse geocoding service
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            );

            if (response.ok) {
              const data = await response.json();
              geoData = {
                ...geoData,
                city: data.city || data.locality || "Unknown",
                region: data.principalSubdivision || "Unknown",
                country: data.countryName || "Unknown",
                formatted_address: `${data.city || data.locality || "Unknown"}, ${data.principalSubdivision || "Unknown"}, ${data.countryName || "Unknown"}`,
              };
            }
          } catch (reverseGeoError) {
            logger.trace("Reverse geocoding failed:", reverseGeoError);
            // Continue with coordinates only
          }

          setLocation(geoData);
        } catch (err) {
          setError("Failed to process location data");
          logger.error("Geolocation processing error:", err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location access denied by user");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information unavailable");
            break;
          case err.TIMEOUT:
            setError("Location request timed out");
            break;
          default:
            setError("An unknown error occurred while retrieving location");
            break;
        }
        logger.error("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      },
    );
  };

  return {
    location,
    loading,
    error,
    requestLocation,
  };
}
