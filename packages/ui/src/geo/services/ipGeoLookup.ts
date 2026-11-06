"use client";

import { logger } from "@/shared/utils/logger";

export interface IPGeoLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp?: string;
  formatted_address: string;
}

/**
 * Get client's geo location using their IP address
 * This works without requiring user permission
 */
export async function getClientGeoFromIP(): Promise<IPGeoLocation | null> {
  try {
    // First, get the client's public IP
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    if (!ipResponse.ok) {
      throw new Error("Failed to get IP");
    }
    const { ip } = await ipResponse.json();

    // Then get geo data for that IP
    const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
    if (!geoResponse.ok) {
      throw new Error("Failed to get geo data");
    }

    const geoData = await geoResponse.json();

    if (geoData.status === "fail") {
      throw new Error(geoData.message || "Geo lookup failed");
    }

    return {
      ip,
      city: geoData.city || "Unknown",
      region: geoData.regionName || "Unknown",
      country: geoData.country || "Unknown",
      country_code: geoData.countryCode || "XX",
      latitude: geoData.lat || 0,
      longitude: geoData.lon || 0,
      timezone: geoData.timezone || "Unknown",
      isp: geoData.isp,
      formatted_address: `${geoData.city || "Unknown"}, ${geoData.regionName || "Unknown"}, ${geoData.country || "Unknown"}`,
    };
  } catch (error) {
    logger.error("IP geo lookup failed:", { error });
    return null;
  }
}

/**
 * Alternative using ipapi.co (backup service)
 */
export async function getClientGeoFromIPBackup(): Promise<IPGeoLocation | null> {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      throw new Error("Failed to get geo data");
    }

    const data = await response.json();

    return {
      ip: data.ip,
      city: data.city || "Unknown",
      region: data.region || "Unknown",
      country: data.country_name || "Unknown",
      country_code: data.country_code || "XX",
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      timezone: data.timezone || "Unknown",
      isp: data.org,
      formatted_address: `${data.city || "Unknown"}, ${data.region || "Unknown"}, ${data.country_name || "Unknown"}`,
    };
  } catch (error) {
    logger.error("IP geo lookup backup failed:", error);
    return null;
  }
}

/**
 * Get client geo with automatic fallback
 */
export async function getClientGeo(): Promise<IPGeoLocation | null> {
  // Try primary service first
  let result = await getClientGeoFromIP();

  if (!result) {
    // Try backup service
    result = await getClientGeoFromIPBackup();
  }

  return result;
}
