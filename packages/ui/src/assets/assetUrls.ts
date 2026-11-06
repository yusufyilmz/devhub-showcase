// Centralized asset URL management for rustykey.io:8080

import { createComponentLogger } from "@shared/utils/client-logger";

import {
  ASSET_API_URL,
  ASSET_CDN_PREFIX,
  CRITICAL_ASSETS,
  HIGH_PRIORITY_ASSETS,
  LOW_PRIORITY_ASSETS,
  MEDIUM_PRIORITY_ASSETS,
} from "./constants";

const _logger = createComponentLogger("assetUrls");

// Asset URL builders
export const buildAssetUrl = (assetUrl: string, _token?: string): string => {
  const proxyBase = "/api/proxy";

  return `${proxyBase}?url=${assetUrl}`;
};

export const buildProxyUrl = (assetUrl: string, _token?: string): string => {
  const proxyBase = "/api/proxy";

  return `${proxyBase}?url=${assetUrl}`;
};

export const buildLogoUrl = (assetUrl: string, _token?: string): string => {
  const proxyBase = "/api/proxy";

  return `${proxyBase}/${assetUrl}`;
};

// // CDN-optimized URL builder for Next.js Image component
// export const buildCdnUrl = (
//   assetUrl: string,
//   _options?: {
//     width?: number
//     height?: number
//     quality?: number
//     format?: 'webp' | 'avif' | 'auto'
//   }
// ): string => {
//   // For Next.js Image component, return the direct URL
//   // Next.js will automatically optimize it through its image optimization API
//   return assetUrl
// }

// // Smart URL builder that chooses the best strategy
// export const buildOptimalUrl = (
//   assetUrl: string,
//   strategy: 'cdn' | 'enhanced' | 'auto' | 'logo' = 'auto',
//   options?: {
//     token?: string
//     width?: number
//     height?: number
//     quality?: number
//   }
// ): string => {
//   // const assetType = getAssetType(assetUrl)

//   // if (strategy === 'auto') {
//   //   // Use CDN for images that benefit from optimization
//   //   selectedStrategy = assetType === 'image' && !assetUrl.endsWith('.svg') ? 'cdn' : 'enhanced'
//   // }

//   switch (strategy) {
//     case 'logo':
//       return buildLogoUrl(assetUrl, options?.token)
//     case 'cdn':
//       return buildCdnUrl(assetUrl, options)
//     case 'enhanced':
//       return buildProxyUrl(assetUrl, options?.token)
//     default:
//       return assetUrl
//   }
// }

export const buildGuestPublicUrl = (guestId: string, imagePath: string): string => {
  return `${ASSET_API_URL}/guest_public_info/${guestId}/images/${imagePath}`;
};

// Asset type detection
export const getAssetType = (
  url: string,
): "image" | "font" | "icon" | "config" | "media" | "other" => {
  const lowercaseUrl = url.toLowerCase();

  if (
    lowercaseUrl.includes("/icons/") ||
    lowercaseUrl.endsWith(".ico") ||
    lowercaseUrl.endsWith(".svg")
  ) {
    return "icon";
  }

  if (lowercaseUrl.includes("/fonts/") || /\.(woff|woff2|ttf|eot|otf)$/i.test(url)) {
    return "font";
  }

  if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(url)) {
    return "image";
  }

  if (
    /\.(json|xml|txt)$/i.test(url) ||
    lowercaseUrl.includes("manifest") ||
    lowercaseUrl.includes("config")
  ) {
    return "config";
  }

  if (/\.(mp4|webm|ogg|mp3|wav|flac)$/i.test(url)) {
    return "media";
  }

  return "other";
};

// Cache strategy determination
export const getCacheStrategy = (url: string): "long" | "medium" | "short" => {
  const assetType = getAssetType(url);

  switch (assetType) {
    case "font":
    case "icon":
      return "long"; // Fonts and icons rarely change
    case "image":
      if (url.includes("/logos/") || url.includes("/icons/")) {
        return "long";
      }
      return "medium";
    case "config":
      return "medium"; // Config files change occasionally
    case "media":
      return "short"; // Media files might be updated
    default:
      return "short";
  }
};

// Asset validation
export const isValidAssetUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const allowedHosts = ["rustykey.io", "theranos.ai", "buzzybee.ai", "factorx.io"];

    return allowedHosts.some(
      (host) =>
        urlObj.hostname === host ||
        urlObj.hostname.endsWith(`.${host}`) ||
        urlObj.host.includes(host),
    );
  } catch {
    return false;
  }
};

// Asset preloading utilities
export const getAssetsByPriority = (priority: "critical" | "high" | "medium" | "low") => {
  switch (priority) {
    case "critical":
      return CRITICAL_ASSETS;
    case "high":
      return HIGH_PRIORITY_ASSETS;
    case "medium":
      return MEDIUM_PRIORITY_ASSETS;
    case "low":
      return LOW_PRIORITY_ASSETS;
    default:
      return [];
  }
};

export const withCdnUrl = (url: string | undefined) => {
  if (url === undefined) {
    return "";
  }

  let finalUrl = url;

  if (url.startsWith(ASSET_API_URL)) {
    finalUrl = url.replace(ASSET_API_URL, ASSET_CDN_PREFIX);
  }

  if (!url.startsWith("http")) {
    finalUrl = `${ASSET_CDN_PREFIX}${url}`;
  }

  return finalUrl;
};
