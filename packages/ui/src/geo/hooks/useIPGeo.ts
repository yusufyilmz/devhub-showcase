"use client";

import { useState, useEffect } from "react";
import { getClientGeo, type IPGeoLocation } from "../services/ipGeoLookup";

export interface UseIPGeoReturn {
  location: IPGeoLocation | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useIPGeo(autoFetch = true): UseIPGeoReturn {
  const [location, setLocation] = useState<IPGeoLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGeo = async () => {
    setLoading(true);
    setError(null);

    try {
      const geoData = await getClientGeo();
      if (geoData) {
        setLocation(geoData);
      } else {
        setError("Unable to determine location");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get location");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchGeo();
    }
  }, [autoFetch, fetchGeo]);

  return {
    location,
    loading,
    error,
    refetch: fetchGeo,
  };
}
