// import type { DBSchema } from 'idb'
import type { CSSProperties } from "react";

// Common asset types
export type AssetType =
  | "json"
  | "font"
  | "image"
  | "icon"
  | "config"
  | "media"
  | "content"
  | "logo"
  | "video"
  | "other";
export type CacheStrategy = "long" | "medium" | "short";
export type AssetPriority = "critical" | "high" | "medium" | "low";

// // Define Database Schema for assets
// export interface AssetDB extends DBSchema {
//   assets: {
//     key: string // URL as the key
//     value: CachedAsset
//     indexes: {
//       lastUpdated: Date
//       cacheStrategy: CacheStrategy
//       expiresAt: Date
//       type: AssetType
//     }
//   }
//   'static-assets': {
//     key: string // URL as the key
//     value: CachedAsset
//     indexes: {
//       expiresAt: Date
//       type: AssetType
//     }
//   }
// }

// Asset in cache
export interface CachedAsset {
  data: ArrayBuffer;
  type: AssetType;
  mimeType: string;
  lastUpdated: Date;
  etag?: string;
  cacheStrategy: CacheStrategy;
  expiresAt: Date;
}

// Base worker request type
export interface BaseWorkerRequest<T = unknown> {
  action: string;
  url?: string;
  type?: string;
  payload?: T;
}

// Asset worker request types
export interface AssetWorkerRequest<T = unknown> extends BaseWorkerRequest<T> {
  action:
    | "fetchEnhanced"
    | "fetchContent"
    | "preloadCritical"
    | "preloadBulk"
    | "cleanupCache"
    | "getCacheStats"
    | "clearCache"
    | "execute"
    | "storeImage"
    | "retrieveImage";
  url?: string;
  type?: AssetType | string;
  payload?: T;
  requestId?: string; // Unique ID to match requests with responses
}

// Combined worker request type
export type WorkerRequest<T = unknown> = AssetWorkerRequest<T>;

// Worker response for all operations
export interface WorkerResponse {
  status: "success" | "error";
  url?: string;
  type?: AssetType | string;
  data?: ArrayBuffer | any; // Allow for stats and other data types
  mimeType?: string;
  message?: string;
  action?: string;
  cached?: boolean;
  cacheStrategy?: CacheStrategy;
  notModified?: boolean;
  stale?: boolean;
  requestId?: string; // Unique ID to match requests with responses
}

// For backward compatibility
export type AssetWorkerResponse = WorkerResponse;

// Props for smart asset component
export interface SmartAssetProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  strategy?: "cdn" | "enhanced" | "auto";
  showLoading?: boolean;
  offlineFirst?: boolean;
  debug?: boolean;
}

// Cache statistics
export interface CacheStats {
  totalAssets: number;
  longCache: number;
  mediumCache: number;
  shortCache: number;
  expired: number;
  totalSize: number;
}

// Asset definition for constants
export interface AssetDefinition {
  name: string;
  url: string;
  priority: AssetPriority;
  type: AssetType;
  description?: string;
}

// Collection of assets by type
export interface AssetCollection {
  [key: string]: AssetDefinition;
}

export type AssetStrategy = "browser-cache" | "cdn" | "proxy";
